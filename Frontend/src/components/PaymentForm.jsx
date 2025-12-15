import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, User, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const PaymentForm = ({ booking, clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        try {
          await api.post(`/api/bookings/${booking.id}/confirm-payment`);
          onSuccess();
        } catch (backendError) {
          setError(backendError.response?.data?.detail || 'Payment succeeded but failed to update booking. Please contact support.');
          setProcessing(false);
        }
      } else {
        setError('Payment was not completed. Please try again.');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
        >
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </motion.div>
      )}

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-1 text-red-600" />
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
        />
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <CreditCard className="w-4 h-4 inline mr-1 text-red-600" />
          Card Details
        </label>
        <div className="px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 transition-all bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-gradient-to-br from-red-50 to-red-50 rounded-xl p-4 border border-red-100">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-red-600">
            Rs. {booking.total_price?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !cardholderName}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;

