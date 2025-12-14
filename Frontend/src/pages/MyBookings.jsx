import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  User,
  Filter,
  X,
  AlertCircle,
} from 'lucide-react';

import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CarCardSkeleton } from '../components/LoadingSkeleton';


import ChatBox from '../components/ChatBox';




const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'rejected', 'completed'];

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeChat, setActiveChat] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    // Check authentication and role
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/my-bookings' } });
        return;
      }
      if (user?.role !== 'renter') {
        navigate('/');
        return;
      }
      fetchBookings();
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: '/my-bookings' } });
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === 'all') return true;
    return booking.status === statusFilter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || user?.role !== 'renter') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-lg shadow-md"
          >
            <div className="max-w-md mx-auto">
              <AlertCircle className="w-24 h-24 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {statusFilter === 'all' ? 'No bookings yet' : `No ${statusFilter} bookings`}
              </h3>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all'
                  ? "You haven't made any bookings yet. Start exploring cars!"
                  : `You don't have any ${statusFilter} bookings.`}
              </p>
              {statusFilter === 'all' && (
                <button
                  onClick={() => navigate('/cars')}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Browse Cars
                </button>
              )}
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  View All Bookings
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Car Image */}
                <div
                  className="relative h-48 bg-gray-200 cursor-pointer group"
                  onClick={() => setSelectedBooking(booking)}
                >
                  {booking.car_image_url ? (
                    <img
                      src={booking.car_image_url}
                      alt={`${booking.car_brand || booking.car?.brand} ${booking.car_model || booking.car?.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                      <div className="text-center text-gray-600">
                        <svg
                          className="w-16 h-16 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6">
                  {/* Car Name */}
                  <h3
                    className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    {booking.car_brand || booking.car?.brand} {booking.car_model || booking.car?.model}
                  </h3>
                  {(booking.car?.year || booking.car_year) && (
                    <p className="text-sm text-gray-500 mb-4">
                      {booking.car?.year || booking.car_year}
                    </p>
                  )}

                  {/* Dates */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Pickup:</span>
                      <span className="ml-2">
                        {format(new Date(booking.pickup_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Return:</span>
                      <span className="ml-2">
                        {format(new Date(booking.return_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  {(booking.car?.location || booking.car_location) && (
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{booking.car?.location || booking.car_location}</span>
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-1" />
                      <span className="text-sm">Total Price</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">
                      ${booking.total_price?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Owner Contact Info (if confirmed) */}
                  {booking.status === 'confirmed' && booking.owner_name && (
                    <>
                      <div className="mt-4 pt-4 border-t bg-red-50 rounded-md p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Owner Contact
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Name:</span>{' '}
                            {booking.owner_name}
                          </p>
                          {booking.owner_phone && (
                            <div className="flex items-center text-sm text-gray-700">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Phone:</span>
                              <a
                                href={`tel:${booking.owner_phone}`}
                                className="ml-2 text-red-600 hover:text-red-700 transition-colors"
                              >
                                {booking.owner_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Chat Button */}
                      <button
                        onClick={() => setActiveChat({
                          booking: booking,
                          otherUser: {
                            id: booking.owner_id,
                            full_name: booking.owner_name,
                            role: 'Owner'
                          }
                        })}
                        className="mt-3 w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat with Owner
                      </button>
                    </>
                  )}




                  {/* Booking Date */}
                  {booking.created_at && (
                    <div className="mt-4 text-xs text-gray-500">
                      Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
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

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Status Badge */}
                <div className="mb-6">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeClass(selectedBooking.status)}`}>
                    {getStatusLabel(selectedBooking.status)}
                  </span>
                </div>

                {/* Car Image */}
                {selectedBooking.car_image_url && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img
                      src={selectedBooking.car_image_url}
                      alt={`${selectedBooking.car_brand || selectedBooking.car?.brand} ${selectedBooking.car_model || selectedBooking.car?.model}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Car Details */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedBooking.car_brand || selectedBooking.car?.brand} {selectedBooking.car_model || selectedBooking.car?.model}
                  </h3>
                  {(selectedBooking.car?.year || selectedBooking.car_year) && (
                    <p className="text-gray-600">Year: {selectedBooking.car?.year || selectedBooking.car_year}</p>
                  )}
                </div>

                {/* Booking Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Pickup Date */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">Pickup Date</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {format(new Date(selectedBooking.pickup_date), 'MMMM dd, yyyy')}
                    </p>
                  </div>

                  {/* Return Date */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">Return Date</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {format(new Date(selectedBooking.return_date), 'MMMM dd, yyyy')}
                    </p>
                  </div>

                  {/* Location */}
                  {(selectedBooking.car?.location || selectedBooking.car_location) && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Location</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedBooking.car?.location || selectedBooking.car_location}
                      </p>
                    </div>
                  )}

                  {/* Rental Duration */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">Rental Duration</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.ceil((new Date(selectedBooking.return_date) - new Date(selectedBooking.pickup_date)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-red-50 border-2 border-red-600 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700 mb-1">Total Price</p>
                      <p className="text-4xl font-bold text-red-600">
                        ${selectedBooking.total_price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <svg className="w-16 h-16 text-red-600 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                    </svg>
                  </div>
                </div>

                {/* Owner Contact Info (if confirmed) */}
                {selectedBooking.status === 'confirmed' && selectedBooking.owner_name && (
                  <div className="bg-gray-900 text-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Owner Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Name</p>
                        <p className="text-lg font-semibold">{selectedBooking.owner_name}</p>
                      </div>
                      {selectedBooking.owner_phone && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Phone</p>
                          <a
                            href={`tel:${selectedBooking.owner_phone}`}
                            className="text-lg font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {selectedBooking.owner_phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Chat Button */}
                    <button
                      onClick={() => {
                        setActiveChat({
                          booking: selectedBooking,
                          otherUser: {
                            id: selectedBooking.owner_id,
                            full_name: selectedBooking.owner_name,
                            role: 'Owner'
                          }
                        });
                        setSelectedBooking(null);
                      }}
                      className="mt-4 w-full px-4 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat with Owner
                    </button>
                  </div>
                )}

                {/* Booking Date */}
                {selectedBooking.created_at && (
                  <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                    Booked on {format(new Date(selectedBooking.created_at), 'MMMM dd, yyyy')}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyBookings;
