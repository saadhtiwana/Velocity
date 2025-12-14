import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchMyCars();
  }, []);

  const fetchMyCars = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cars/my-cars');
      setCars(response.data);
    } catch (err) {
      setError('Failed to load your cars');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (carId, currentStatus) => {
    try {
      await api.patch(`/api/cars/${carId}/status`);
      // Update local state
      setCars(cars.map(car =>
        car.id === carId
          ? { ...car, status: currentStatus === 'available' ? 'unavailable' : 'available' }
          : car
      ));
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update car status');
    }
  };

  const handleDelete = async (carId) => {
    if (!confirm('Are you sure you want to delete this car? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/cars/${carId}`);
      setCars(cars.filter(car => car.id !== carId));
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete car');
    }
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setEditFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      daily_price: car.daily_price,
      category: car.category,
      fuel_type: car.fuel_type,
      seating_capacity: car.seating_capacity,
      location: car.location,
      description: car.description || '',
    });
  };

  const closeEditModal = () => {
    setEditingCar(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/cars/${editingCar.id}`, editFormData);
      setCars(cars.map(car => car.id === editingCar.id ? response.data : car));
      closeEditModal();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update car');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="porsche-headline-large text-gray-900">Manage Cars</h1>
            <p className="text-gray-600 mt-2">Edit, toggle availability, or remove your listings</p>
          </div>
          <Link to="/owner/add-car" className="btn-premium btn-premium-primary">
            Add New Car
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-premium overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${car.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {car.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {car.year} • {car.category} • {car.fuel_type}
                  </p>
                  <p className="text-2xl font-bold text-red-600 mb-4">
                    Rs. {car.daily_price}/day
                  </p>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => openEditModal(car)}
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleToggleStatus(car.id, car.status)}
                      className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      {car.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Car
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-premium">
            <p className="text-gray-600 mb-4">You haven't added any cars yet</p>
            <Link to="/owner/add-car" className="btn-premium btn-premium-primary inline-flex">
              Add Your First Car
            </Link>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-premium-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Car Details</h2>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={editFormData.brand}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={editFormData.model}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={editFormData.year}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Daily Price (PKR)
                  </label>
                  <input
                    type="number"
                    name="daily_price"
                    value={editFormData.daily_price}
                    onChange={handleEditChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="sports">Sports</option>
                    <option value="luxury">Luxury</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <select
                    name="fuel_type"
                    value={editFormData.fuel_type}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="seating_capacity"
                    value={editFormData.seating_capacity}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-premium btn-premium-primary"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 btn-premium btn-premium-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
