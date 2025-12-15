"""
Stripe Payment Service
Uses direct HTTP requests to Stripe API instead of the Stripe Python library
to avoid initialization issues.
"""
import requests
from typing import Dict, Optional
from app.config import settings


def create_payment_intent(booking_id: str, user_id: str, amount: float, currency: str = 'usd') -> Dict:
    """
    Create a payment intent using direct HTTP request to Stripe API
    
    Args:
        booking_id: Booking ID
        user_id: User ID
        amount: Amount in dollars (will be converted to cents)
        currency: Currency code (default: 'usd')
        
    Returns:
        Dict with client_secret, payment_intent_id, and status
    """
    if not settings.STRIPE_SECRET_KEY:
        raise ValueError(
            "STRIPE_SECRET_KEY is not configured. "
            "Please add STRIPE_SECRET_KEY to your .env file in the Backend directory."
        )
    
    # Convert amount to cents
    amount_cents = int(amount * 100)
    
    # Prepare data for form-urlencoded request
    data = {
        'amount': str(amount_cents),
        'currency': currency,
        'metadata[booking_id]': str(booking_id),
        'metadata[user_id]': str(user_id),
        'automatic_payment_methods[enabled]': 'true'
    }
    
    # Make HTTP request to Stripe API
    response = requests.post(
        'https://api.stripe.com/v1/payment_intents',
        headers={
            'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data=data
    )
    
    response.raise_for_status()
    result = response.json()
    
    return {
        'client_secret': result.get('client_secret'),
        'payment_intent_id': result.get('id'),
        'status': result.get('status')
    }


def confirm_payment(payment_intent_id: str) -> Dict:
    """
    Retrieve payment intent to check its status
    
    Args:
        payment_intent_id: Stripe PaymentIntent ID
        
    Returns:
        Dict with payment intent details
    """
    if not settings.STRIPE_SECRET_KEY:
        raise ValueError(
            "STRIPE_SECRET_KEY is not configured. "
            "Please add STRIPE_SECRET_KEY to your .env file in the Backend directory."
        )
    
    response = requests.get(
        f'https://api.stripe.com/v1/payment_intents/{payment_intent_id}',
        headers={
            'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}'
        }
    )
    
    response.raise_for_status()
    return response.json()


def get_payment_details(payment_intent_id: str) -> Dict:
    """
    Get payment details including payment method information
    
    Args:
        payment_intent_id: Stripe PaymentIntent ID
        
    Returns:
        Dict with payment details including card information
    """
    if not settings.STRIPE_SECRET_KEY:
        raise ValueError(
            "STRIPE_SECRET_KEY is not configured. "
            "Please add STRIPE_SECRET_KEY to your .env file in the Backend directory."
        )
    
    # Get payment intent
    response = requests.get(
        f'https://api.stripe.com/v1/payment_intents/{payment_intent_id}',
        headers={
            'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}'
        }
    )
    
    response.raise_for_status()
    payment_intent = response.json()
    
    # Get payment method details if available
    payment_method_id = payment_intent.get('payment_method')
    payment_method_info = None
    
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
                payment_method_info = {
                    'brand': card.get('brand', ''),
                    'last4': card.get('last4', ''),
                    'exp_month': card.get('exp_month'),
                    'exp_year': card.get('exp_year')
                }
    
    return {
        'payment_intent': payment_intent,
        'payment_method': payment_method_info,
        'amount': payment_intent.get('amount', 0) / 100,  # Convert from cents
        'status': payment_intent.get('status'),
        'currency': payment_intent.get('currency')
    }


def refund_payment(payment_intent_id: str, amount: Optional[float] = None) -> Dict:
    """
    Refund a payment
    
    Args:
        payment_intent_id: Stripe PaymentIntent ID
        amount: Optional amount to refund (in dollars). If None, full refund.
        
    Returns:
        Dict with refund details
    """
    if not settings.STRIPE_SECRET_KEY:
        raise ValueError(
            "STRIPE_SECRET_KEY is not configured. "
            "Please add STRIPE_SECRET_KEY to your .env file in the Backend directory."
        )
    
    # First, get the payment intent to find the charge ID
    pi_response = requests.get(
        f'https://api.stripe.com/v1/payment_intents/{payment_intent_id}',
        headers={
            'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}'
        }
    )
    
    pi_response.raise_for_status()
    payment_intent = pi_response.json()
    
    # Get the charge ID from the payment intent
    charges = payment_intent.get('charges', {}).get('data', [])
    if not charges:
        raise ValueError("No charges found for this payment intent")
    
    charge_id = charges[0].get('id')
    
    # Prepare refund data
    data = {
        'charge': charge_id
    }
    
    # Add amount if partial refund
    if amount is not None:
        data['amount'] = str(int(amount * 100))  # Convert to cents
    
    # Create refund
    response = requests.post(
        'https://api.stripe.com/v1/refunds',
        headers={
            'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data=data
    )
    
    response.raise_for_status()
    return response.json()


def cancel_payment_intent(payment_intent_id: str) -> Dict:
    """
    Cancel a payment intent
    
    Args:
        payment_intent_id: Stripe PaymentIntent ID
        
    Returns:
        Dict with cancelled payment intent details
    """
    if not settings.STRIPE_SECRET_KEY:
        raise ValueError(
            "STRIPE_SECRET_KEY is not configured. "
            "Please add STRIPE_SECRET_KEY to your .env file in the Backend directory."
        )
    
    response = requests.post(
        f'https://api.stripe.com/v1/payment_intents/{payment_intent_id}/cancel',
        headers={
            'Authorization': f'Bearer {settings.STRIPE_SECRET_KEY}'
        }
    )
    
    response.raise_for_status()
    return response.json()

