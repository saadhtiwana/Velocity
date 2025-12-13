import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import api from '../../utils/api';

import ChatBox from '../../components/ChatBox';
import { AnimatePresence } from 'framer-motion';



const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings/my-car-bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await api.patch(`/api/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      setBookings(bookings.map(b => (b.id === bookingId ? response.data : b)));
    } catch (err) {
      alert(err.response?.data?.detail || `Failed to ${newStatus} booking`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="porsche-headline-large text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600 mt-2">Review and respond to booking requests</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          {['all', 'pending', 'confirmed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`pb-4 px-2 font-semibold transition-colors relative ${statusFilter === status
                  ? 'text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {statusFilter === status && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-premium overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Car Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-start gap-4">
                      {booking.car_image_url && (
                        <img
                          src={booking.car_image_url}
                          alt={`${booking.car_brand} ${booking.car_model}`}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {booking.car_brand} {booking.car_model}
                        </h3>
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="lg:col-span-1 space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Renter</p>
                      <p className="text-gray-900">{booking.renter_name}</p>
                      {booking.status === 'confirmed' && (
                        <p className="text-sm text-gray-600">{booking.renter_phone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Dates</p>
                      <p className="text-gray-900">
                        {format(new Date(booking.pickup_date), 'MMM dd, yyyy')} -{' '}
                        {format(new Date(booking.return_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-red-600">
                        ${booking.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
<div className="lg:col-span-1 flex flex-col justify-center gap-3">
  {booking.status === 'pending' && (
    <>
      <button
        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
      >
        Confirm Booking
      </button>
      <button
        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
      >
        Reject Booking
      </button>
    </>
  )}
  {booking.status === 'confirmed' && (
    <>
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800 font-semibold">
          ✓ Booking Confirmed
        </p>
        <p className="text-xs text-green-700 mt-1">
          Chat with renter below
        </p>
      </div>
      <button
        onClick={() => setActiveChat({
          booking: booking,
          otherUser: {
            id: booking.renter_id,
            full_name: booking.renter_name,
            role: 'Renter'
          }
        })}
        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat with Renter
      </button>
    </>
  )}
                  </div>
                </div>

                {/* Booking Date */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-premium">
            <p className="text-gray-600">
              {statusFilter === 'all'
                ? 'No bookings yet'
                : `No ${statusFilter} bookings`}
            </p>
          </div>
        )}
      </div>
      {/* Chat Modal */}
      <AnimatePresence>
        {activeChat && (
          <ChatBox
            booking={activeChat.booking}
            otherUser={activeChat.otherUser}
            onClose={() => setActiveChat(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBookings;
