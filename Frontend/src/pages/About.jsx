import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Shield,
  Zap,
  Users,
  Star,
  MapPin,
  CheckCircle,
  Heart,
  Award,
  Globe,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Wide Selection',
      description: 'Choose from hundreds of vehicles from trusted owners in your area.',
    },
    {
      title: 'Secure & Safe',
      description: 'All bookings are protected with secure payment and verification systems.',
    },
    {
      title: 'Instant Booking',
      description: 'Book your perfect car in minutes with our streamlined process.',
    },
    {
      title: 'Trusted Community',
      description: 'Join thousands of satisfied renters and car owners.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Cars Available' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '4.8', label: 'Average Rating' },
    { value: '100%', label: 'Secure Booking' },
  ];

  const values = [
    {
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We go above and beyond to ensure you have the best experience.',
    },
    {
      title: 'Accessibility',
      description: 'Making car rental accessible to everyone, everywhere. Quality transportation for all.',
    },
    {
      title: 'Reliability',
      description: 'Count on us for dependable service. We ensure your car is ready when you need it.',
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in every interaction, from booking to return.',
    },
  ];

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}></div>

        {/* Car Image Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            src="/images/car-2.png"
            alt="Velocity Car"
            className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl h-auto object-contain opacity-20 md:opacity-25 lg:opacity-30"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
              transform: 'translateY(10%)',
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="porsche-headline-hero mb-6 relative z-10"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              About Velocity
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-red-100 mb-10 leading-relaxed relative z-10 max-w-3xl mx-auto"
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              Revolutionizing car rental with a peer-to-peer platform that connects car owners with renters seamlessly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <button
                onClick={() => navigate('/cars')}
                className="btn-premium btn-premium-white"
              >
                Explore Our Fleet
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Stats Section */}
      <section className="section-padding px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-8 bg-white border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-base text-gray-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="porsche-headline-large text-gray-900 mb-4">Why Choose Velocity?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best car rental experience for both owners and renters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="p-8 border-l-2 border-gray-200 hover:border-red-600 transition-all"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="porsche-headline-large text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Velocity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-8 border-l-4 border-gray-200 hover:border-red-600 transition-all"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-white p-10 rounded-2xl border border-gray-100 hover:border-red-600 transition-all hover:shadow-xl"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To democratize access to transportation by creating a seamless, secure, and sustainable
                peer-to-peer car rental platform that benefits both car owners and renters while building
                stronger communities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-white p-10 rounded-2xl border border-gray-100 hover:border-red-600 transition-all hover:shadow-xl"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become the leading peer-to-peer car rental platform globally, where sharing vehicles
                is the norm, making transportation more affordable, sustainable, and accessible for everyone,
                everywhere.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 mb-8">
              Have questions? We'd love to hear from you.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-block"
            >
              <a
                href="mailto:support@velocity.com"
                className="text-xl text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                support@velocity.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and start your journey with Velocity today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/cars')}
                className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Browse Cars
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Sign Up Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

