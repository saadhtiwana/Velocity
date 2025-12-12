import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar } from 'lucide-react';
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

    const params = new URLSearchParams();
    if (location.trim()) params.append('location', location.trim());
    if (pickupDate) params.append('pickup_date', pickupDate);
    if (returnDate) params.append('return_date', returnDate);

    const queryString = params.toString();
    navigate(`/cars${queryString ? `?${queryString}` : ''}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white w-full overflow-hidden min-h-[600px] sm:min-h-[650px] lg:h-[85vh] lg:min-h-[600px]">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-center gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8 sm:py-12 lg:py-0">
          {/* LEFT COLUMN - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center order-1 lg:order-1 text-center lg:text-left"
          >
            <h1 className="porsche-headline-hero text-[#1A1A1A] mb-6 lg:mb-8">
              Your Journey,
              <br className="hidden lg:block" />
              Your Way
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-full lg:max-w-[500px] mb-8 lg:mb-10 mx-auto lg:mx-0 leading-relaxed">
              Premium car rental. Seamless experience. Anywhere you need.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/cars')}
              className="btn-premium btn-premium-primary"
            >
              Explore Fleet
            </motion.button>
          </motion.div>

          {/* CENTER COLUMN - Car Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center h-full order-3 lg:order-2 relative overflow-hidden"
            style={{ paddingTop: '0px' }}
          >
            {/* Removed watermark for cleaner layout */}

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
            style={{ zIndex: 10 }}
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
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
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

                <div>
                  <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
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

                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
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

      {/* Stats Section - Dark Premium */}
      <section className="dark-premium section-padding px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {
              [
                { value: '500+', label: 'Cars Available' },
                { value: '10K+', label: 'Happy Customers' },
                { value: '4.8', label: 'Average Rating' },
                { value: '100%', label: 'Secure Booking' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="relative group"
                >
                  <div className="text-center">
                    <div className="text-6xl lg:text-8xl font-bold text-white mb-3 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </motion.div>
        </div>
      </section>

      {/* How It Works - Premium cards */}
      <section className="section-padding px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="porsche-headline-large text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Rent a car in three simple steps
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {
              [
                { number: '01', title: 'Search & Select', description: 'Browse through our wide selection of cars and find the perfect match for your needs.' },
                { number: '02', title: 'Book & Confirm', description: 'Choose your pickup and return dates, then confirm your booking instantly.' },
                { number: '03', title: 'Drive Away', description: 'Pick up your car and enjoy your journey with our reliable and well-maintained vehicles.' },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="relative bg-white p-10 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="text-8xl font-bold text-gray-100 absolute top-8 right-8 leading-none">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-red-600 mb-4 uppercase tracking-wider">
                      Step {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))
            }
          </motion.div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="section-padding px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="porsche-headline-large text-gray-900 mb-6">
              Featured Cars
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular rental vehicles
            </p>
          </motion.div>

          {
            loading ? (
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
                {
                  featuredCars.map((car) => (
                    <motion.div key={car.id} variants={itemVariants}>
                      <CarCard car={car} />
                    </motion.div>
                  ))
                }
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No featured cars available at the moment.</p>
              </div>
            )
          }
        </div>
      </section>
    </div>
  );
};

export default Home;

