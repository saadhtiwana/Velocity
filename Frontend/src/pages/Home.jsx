import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Sparkles, Car, Users, Star, Shield, Zap } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/LoadingSkeleton';

const Home = () => {
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set minimum date to today
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cars/featured');
      setFeaturedCars(response.data);
    } catch (error) {
      console.error('Error fetching featured cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (location.trim()) {
      params.append('location', location.trim());
    }
    if (pickupDate) {
      params.append('pickup_date', pickupDate);
    }
    if (returnDate) {
      params.append('return_date', returnDate);
    }

    // Navigate to cars page with query params
    const queryString = params.toString();
    navigate(`/cars${queryString ? `?${queryString}` : ''}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Three Column Layout */}
      <div 
        className="relative bg-white w-full overflow-hidden min-h-[600px] sm:min-h-[650px] lg:h-[85vh] lg:min-h-[600px]"
      >
        <div 
          className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-center gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8 sm:py-12 lg:py-0"
        >
          {/* LEFT COLUMN - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center order-1 lg:order-1 text-center lg:text-left"
          >
            <h1 
              className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[56px] font-bold leading-tight sm:leading-tight lg:leading-[1.2] text-[#1A1A1A] mb-4 sm:mb-6 lg:mb-6"
            >
              <span className="block">Your Journey,</span>
              <span className="block">Your Car,</span>
              <span className="block">Your Way</span>
            </h1>
            <p 
              className="text-base sm:text-lg lg:text-[18px] text-[#6B7280] max-w-full lg:max-w-[400px] mb-4 sm:mb-6 lg:mb-6 mx-auto lg:mx-0"
            >
              Find and rent the perfect car for your next adventure. Choose from hundreds of vehicles available near you.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/cars')}
              className="px-6 sm:px-8 lg:px-8 py-3 sm:py-3 lg:py-3 bg-[#EF4444] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 w-full sm:w-fit mx-auto lg:mx-0 min-h-[44px]"
            >
              Browse Cars
            </motion.button>
          </motion.div>

          {/* CENTER COLUMN - Car Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center h-full order-3 lg:order-2 relative overflow-hidden"
            style={{
              paddingTop: '0px'
            }}
          >
            {/* Background Text "VELOCITY" - Only in center column */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none hidden sm:flex"
              style={{
                zIndex: 0,
                top: '-3%',
                transform: 'translateY(-30%)'
              }}
            >
              <span
                className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] font-black text-[#FEE2E2] opacity-50 tracking-wide"
              >
                VELOCITY
              </span>
            </div>
            
            {/* Car Image */}
            <div 
              className="w-full h-full flex items-center justify-center relative scale-100 sm:scale-110 md:scale-125 lg:scale-[1.4]"
              style={{
                filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))',
                zIndex: 5
              }}
            >
              <img
                src="/images/car-2.png"
                alt="Premium Car"
                className="h-full w-auto object-contain max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[90vh]"
              />
            </div>
          </motion.div>

          {/* RIGHT COLUMN - Search Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-center order-2 lg:order-3 relative w-full"
            style={{
              zIndex: 10
            }}
          >
            <form
              onSubmit={handleSearch}
              className="w-full max-w-full sm:max-w-[400px] lg:max-w-[350px] bg-white rounded-2xl relative p-5 sm:p-6 lg:p-8"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                zIndex: 10
              }}
            >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Search Cars</h2>
            
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Pickup Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <MapPin className="w-4 h-4 inline mr-1 text-red-600" />
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or area"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 transition-all duration-200 min-h-[44px]"
                />
              </div>

              {/* Pickup Date */}
              <div>
                <label
                  htmlFor="pickupDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="w-4 h-4 inline mr-1 text-red-600" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  value={pickupDate}
                  min={today}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    if (!returnDate && e.target.value) {
                      const pickup = new Date(e.target.value);
                      const nextDay = new Date(pickup);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setReturnDate(format(nextDay, 'yyyy-MM-dd'));
                    }
                    if (returnDate && e.target.value && returnDate <= e.target.value) {
                      const pickup = new Date(e.target.value);
                      const nextDay = new Date(pickup);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setReturnDate(format(nextDay, 'yyyy-MM-dd'));
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 transition-all duration-200 min-h-[44px]"
                />
              </div>

              {/* Return Date */}
              <div>
                <label
                  htmlFor="returnDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="w-4 h-4 inline mr-1 text-red-600" />
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  min={pickupDate || today}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 transition-all duration-200 min-h-[44px]"
                />
              </div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2 min-h-[44px]"
              >
                <Search className="w-5 h-5" />
                Search Cars
              </motion.button>
            </div>
          </form>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {[
              { icon: Car, value: '500+', label: 'Cars Available', color: 'text-red-600' },
              { icon: Users, value: '10K+', label: 'Happy Customers', color: 'text-blue-600' },
              { icon: Star, value: '4.8', label: 'Average Rating', color: 'text-yellow-600' },
              { icon: Shield, value: '100%', label: 'Secure Booking', color: 'text-green-600' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mx-auto mb-2 sm:mb-3 ${stat.color}`} />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Rent a car in three simple steps
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          >
            {[
              { icon: Search, title: 'Search & Select', description: 'Browse through our wide selection of cars and find the perfect match for your needs.' },
              { icon: Calendar, title: 'Book & Confirm', description: 'Choose your pickup and return dates, then confirm your booking instantly.' },
              { icon: Car, title: 'Drive Away', description: 'Pick up your car and enjoy your journey with our reliable and well-maintained vehicles.' },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 sm:p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Cars
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular rental vehicles
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(4)].map((_, index) => (
                <CarCardSkeleton key={index} />
              ))}
            </div>
          ) : featuredCars.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {featuredCars.map((car) => (
                <motion.div key={car.id} variants={itemVariants}>
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured cars available at the moment.</p>
            </div>
          )}
        </div>
      </section>
          
    </div>
  );
};

export default Home;

