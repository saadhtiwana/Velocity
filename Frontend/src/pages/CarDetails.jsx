import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, addDays } from 'date-fns';
import {
  MapPin,
  Calendar,
  Users,
  Fuel,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Car,
  Shield,
  Star,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/LoadingSkeleton';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [booking, setBooking] = useState({
    pickup_date: '',
    return_date: '',
  });
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    if (car) {
      fetchSimilarCars();
    }
  }, [car]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/cars/${id}`);
      setCar(response.data);
      if (response.data.image_url) {
        setSelectedImage(response.data.image_url);
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
      setError('Car not found');
      setTimeout(() => {
        navigate('/cars');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCars = async () => {
    try {
      const params = new URLSearchParams();
      if (car.category) params.append('category', car.category);
      if (car.location) params.append('location', car.location);
      
      const response = await api.get(`/api/cars?${params.toString()}`);
      const similar = response.data.filter(c => c.id !== car.id).slice(0, 4);
      setSimilarCars(similar);
    } catch (error) {
      console.error('Error fetching similar cars:', error);
    }
  };

  const calculateTotalPrice = () => {
    if (!car || !booking.pickup_date || !booking.return_date) {
      return 0;
    }
    const pickup = new Date(booking.pickup_date);
    const returnDate = new Date(booking.return_date);
    const days = differenceInDays(returnDate, pickup) + 1;
    return car.daily_price * days;
  };

  const handleDateChange = (field, value) => {
    setBooking((prev) => {
      const newBooking = { ...prev, [field]: value };
      if (field === 'pickup_date' && value && !newBooking.return_date) {
        const pickup = new Date(value);
        const nextDay = addDays(pickup, 1);
        newBooking.return_date = format(nextDay, 'yyyy-MM-dd');
      }
      if (field === 'pickup_date' && newBooking.return_date && value >= newBooking.return_date) {
        const pickup = new Date(value);
        const nextDay = addDays(pickup, 1);
        newBooking.return_date = format(nextDay, 'yyyy-MM-dd');
      }
      return newBooking;
    });
    setError('');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');

    // Check authentication
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }

    // Check if user is renter
    if (user?.role !== 'renter') {
      setError('Only renters can book cars. Please login with a renter account.');
      return;
    }

    if (!booking.pickup_date || !booking.return_date) {
      setError('Please select both pickup and return dates');
      return;
    }

    if (booking.pickup_date >= booking.return_date) {
      setError('Return date must be after pickup date');
      return;
    }

    try {
      setBookingLoading(true);
      
      // Convert dates to ISO datetime format (backend expects "2025-01-15T10:00:00")
      const pickupDateTime = `${booking.pickup_date}T10:00:00`;
      const returnDateTime = `${booking.return_date}T10:00:00`;

      await api.post('/api/bookings', {
        car_id: id,
        pickup_date: pickupDateTime,
        return_date: returnDateTime,
      });

      // Success - redirect to my-bookings
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to create booking. Please try again.';
      setError(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mb-4"></div>
          <p className="text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Car not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The car you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/cars')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Browse Cars
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const days = booking.pickup_date && booking.return_date
    ? differenceInDays(new Date(booking.return_date), new Date(booking.pickup_date)) + 1
    : 0;

  const features = [
    { icon: Car, label: 'Category', value: car.category },
    { icon: Users, label: 'Seating', value: car.seating_capacity ? `${car.seating_capacity} seats` : null },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type },
    { icon: MapPin, label: 'Location', value: car.location },
  ].filter(f => f.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft overflow-hidden"
            >
              {selectedImage && selectedImage !== car.image_url ? (
                <div className="relative h-96 bg-gray-100">
                  <img
                    src={selectedImage}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(car.image_url)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              ) : (
                <div className="relative h-96 bg-gradient-to-br from-red-200 to-red-200 overflow-hidden group cursor-pointer"
                  onClick={() => car.image_url && setSelectedImage(car.image_url)}
                >
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Car Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-soft p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-xl text-gray-600">{car.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent">
                    ${car.daily_price}
                  </p>
                  <p className="text-sm text-gray-500">per day</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    car.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {car.status === 'available' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Available
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Unavailable
                    </>
                  )}
                </span>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100"
                  >
                    <feature.icon className="w-6 h-6 text-red-600 mb-2" />
                    <p className="text-xs text-gray-500 mb-1">{feature.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{feature.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              {car.description && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{car.description}</p>
                </div>
              )}
            </motion.div>

            {/* Similar Cars */}
            {similarCars.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-soft p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Cars</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarCars.map((similarCar) => (
                    <CarCard key={similarCar.id} car={similarCar} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Car</h2>

              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-6">
                    Please login or create an account to book this car.
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      state={{ from: `/cars/${id}` }}
                      className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-center font-semibold"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-center font-semibold"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              ) : user?.role !== 'renter' ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Owner Account</h3>
                  <p className="text-gray-600">
                    Only renters can book cars.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Pickup Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1 text-red-600" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={booking.pickup_date}
                      min={today}
                      onChange={(e) => handleDateChange('pickup_date', e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    />
                  </div>

                  {/* Return Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1 text-red-600" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={booking.return_date}
                      min={booking.pickup_date || today}
                      onChange={(e) => handleDateChange('return_date', e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    />
                  </div>

                  {/* Price Breakdown */}
                  {days > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gradient-to-br from-red-50 to-red-50 rounded-xl p-4 space-y-3 border border-red-100"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="text-gray-900 font-semibold">${car.daily_price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Days</span>
                        <span className="text-gray-900 font-semibold">{days}</span>
                      </div>
                      <div className="border-t border-red-200 pt-3 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total Price</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Book Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={bookingLoading || car.status !== 'available' || !booking.pickup_date || !booking.return_date}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </span>
                    ) : (
                      'Book Now'
                    )}
                  </motion.button>

                  {car.status !== 'available' && (
                    <p className="text-sm text-red-600 text-center">
                      This car is currently unavailable
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox for Image */}
      <AnimatePresence>
        {selectedImage && selectedImage !== car.image_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(car.image_url)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt={`${car.brand} ${car.model}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(car.image_url)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarDetails;

