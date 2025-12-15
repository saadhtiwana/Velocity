import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Elements } from '@stripe/react-stripe-js';
import { useStripeContext } from '../context/StripeContext';
import PaymentForm from './PaymentForm';

const PaymentModal = ({ isOpen, onClose, booking, clientSecret }) => {
  const { stripePromise } = useStripeContext();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Car:</span>
                  <span>{booking.car_brand} {booking.car_model}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Pickup:</span>
                  <span>{format(new Date(booking.pickup_date), 'MMM dd, yyyy')}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Return:</span>
                  <span>{format(new Date(booking.return_date), 'MMM dd, yyyy')}</span>
                </div>
                
                {(booking.car?.location || booking.car_location) && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{booking.car?.location || booking.car_location}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-red-600">
                    <DollarSign className="w-5 h-5 inline mr-1" />
                    Rs. {booking.total_price?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            {stripePromise && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  booking={booking}
                  clientSecret={clientSecret}
                  onSuccess={() => {
                    onClose();
                    // Reload page or refresh bookings list
                    window.location.reload();
                  }}
                  onCancel={onClose}
                />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600 mb-4"></div>
                <p className="text-gray-600">Loading payment form...</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;

