import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { format } from 'date-fns';

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings/owner/dashboard');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchDashboardStats} className="btn-premium btn-premium-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="porsche-headline-large text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your business overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-premium p-6"
          >
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Total Cars
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_cars || 0}</div>
            <Link to="/owner/cars" className="text-sm text-red-600 hover:text-red-700 mt-3 inline-block">
              Manage Cars →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-premium p-6"
          >
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Total Bookings
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_bookings || 0}</div>
            <Link to="/owner/bookings" className="text-sm text-red-600 hover:text-red-700 mt-3 inline-block">
              View All →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-premium p-6"
          >
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Pending
            </div>
            <div className="text-4xl font-bold text-yellow-600">{stats?.pending_bookings || 0}</div>
            <Link to="/owner/bookings?status=pending" className="text-sm text-red-600 hover:text-red-700 mt-3 inline-block">
              Review →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-premium p-6"
          >
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              This Month Revenue
            </div>
            <div className="text-4xl font-bold text-green-600">
              ${stats?.monthly_revenue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-gray-600 mt-3">From confirmed bookings</p>
          </motion.div>
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-premium overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          </div>

          {stats?.recent_bookings && stats.recent_bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Renter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recent_bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.car_brand} {booking.car_model}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.renter_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(booking.pickup_date), 'MMM dd')} -{' '}
                          {format(new Date(booking.return_date), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${booking.total_price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">No bookings yet</p>
              <Link to="/owner/add-car" className="btn-premium btn-premium-primary mt-4 inline-flex">
                Add Your First Car
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/owner/add-car"
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold mb-2">Add New Car</h3>
            <p className="text-red-100">List a new vehicle for rent</p>
          </Link>

          <Link
            to="/owner/cars"
            className="bg-gray-900 hover:bg-black text-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold mb-2">Manage Cars</h3>
            <p className="text-gray-300">Edit or remove your listings</p>
          </Link>

          <Link
            to="/owner/bookings"
            className="bg-gray-900 hover:bg-black text-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold mb-2">Manage Bookings</h3>
            <p className="text-gray-300">Review and respond to requests</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
