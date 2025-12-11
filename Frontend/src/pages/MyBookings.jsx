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
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CarCardSkeleton } from '../components/LoadingSkeleton';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'rejected', 'completed'];

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

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
                  onClick={() => navigate(`/cars/${booking.car_id || booking.car?.id}`)}
                >
                  {booking.car?.image_url ? (
                    <img
                      src={booking.car.image_url}
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
                    onClick={() => navigate(`/cars/${booking.car_id || booking.car?.id}`)}
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
                  {booking.status === 'confirmed' && booking.car?.owner && (
                    <div className="mt-4 pt-4 border-t bg-red-50 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Owner Contact
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Name:</span>{' '}
                          {booking.car.owner.full_name}
                        </p>
                        {booking.car.owner.phone && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-medium">Phone:</span>
                            <a
                              href={`tel:${booking.car.owner.phone}`}
                              className="ml-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                              {booking.car.owner.phone}
                            </a>
                          </div>
                        )}
                        {booking.car.owner.email && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Email:</span>{' '}
                            <a
                              href={`mailto:${booking.car.owner.email}`}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              {booking.car.owner.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
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
    </div>
  );
};

export default MyBookings;

