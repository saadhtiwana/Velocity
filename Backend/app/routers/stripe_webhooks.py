"""
Stripe Webhook Router
Handles Stripe webhook events
"""
from fastapi import APIRouter, HTTPException, Request, Header, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.booking import Booking
from app.config import settings
import stripe
import json

router = APIRouter()


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Stripe webhook events
    
    No authentication required - Stripe verifies via signature
    """
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stripe webhook secret not configured"
        )
    
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stripe secret key not configured"
        )
    
    # Initialize Stripe for webhook signature verification only
    stripe.api_key = settings.STRIPE_SECRET_KEY
    
    payload = await request.body()
    
    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload,
            stripe_signature,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid payload: {str(e)}"
        )
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid signature: {str(e)}"
        )
    
    # Handle the event
    event_type = event['type']
    event_data = event['data']['object']
    
    try:
        if event_type == 'payment_intent.succeeded':
            # Payment succeeded
            payment_intent_id = event_data.get('id')
            metadata = event_data.get('metadata', {})
            booking_id = metadata.get('booking_id')
            
            if booking_id:
                # Find booking
                result = await db.execute(
                    select(Booking).where(Booking.id == booking_id)
                )
                booking = result.scalar_one_or_none()
                
                if booking:
                    # Update booking payment status
                    booking.payment_status = 'paid'
                    booking.amount_paid = event_data.get('amount', 0) / 100
                    
                    # Get payment method details via HTTP request
                    import requests
                    payment_method_id = event_data.get('payment_method')
                    if payment_method_id:
                        pm_response = requests.get(
                            f'https://api.stripe.com/v1/payment_methods/{payment_method_id}',
                            headers={
                                'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}'
                            }
                        )
                        if pm_response.status_code == 200:
                            pm_data = pm_response.json()
                            card = pm_data.get('card', {})
                            if card:
                                booking.stripe_payment_method = f"{card.get('brand', '').upper()} •••• {card.get('last4', '')}"
                    
                    await db.commit()
        
        elif event_type == 'payment_intent.payment_failed':
            # Payment failed
            payment_intent_id = event_data.get('id')
            metadata = event_data.get('metadata', {})
            booking_id = metadata.get('booking_id')
            
            if booking_id:
                # Find booking
                result = await db.execute(
                    select(Booking).where(Booking.id == booking_id)
                )
                booking = result.scalar_one_or_none()
                
                if booking:
                    booking.payment_status = 'failed'
                    await db.commit()
        
        elif event_type == 'charge.refunded':
            # Charge refunded
            charge_id = event_data.get('id')
            payment_intent_id = event_data.get('payment_intent')
            
            if payment_intent_id:
                # Get payment intent to find booking_id from metadata
                import requests
                pi_response = requests.get(
                    f'https://api.stripe.com/v1/payment_intents/{payment_intent_id}',
                    headers={
                        'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}'
                    }
                )
                
                if pi_response.status_code == 200:
                    pi_data = pi_response.json()
                    metadata = pi_data.get('metadata', {})
                    booking_id = metadata.get('booking_id')
                    
                    if booking_id:
                        # Find booking
                        result = await db.execute(
                            select(Booking).where(Booking.id == booking_id)
                        )
                        booking = result.scalar_one_or_none()
                        
                        if booking:
                            booking.payment_status = 'refunded'
                            booking.status = 'cancelled'
                            await db.commit()
    
    except Exception as e:
        # Log error but return 200 to Stripe
        print(f"Error processing webhook event {event_type}: {str(e)}")
    
    # Always return 200 OK to Stripe
    return {"status": "success"}

