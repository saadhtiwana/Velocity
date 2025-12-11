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
      icon: Car,
      title: 'Wide Selection',
      description: 'Choose from hundreds of vehicles from trusted owners in your area.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'All bookings are protected with secure payment and verification systems.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book your perfect car in minutes with our streamlined process.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of satisfied renters and car owners.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const stats = [
    { icon: Car, value: '500+', label: 'Cars Available', color: 'text-red-600' },
    { icon: Users, value: '10K+', label: 'Happy Customers', color: 'text-blue-600' },
    { icon: Star, value: '4.8', label: 'Average Rating', color: 'text-yellow-600' },
    { icon: Award, value: '100%', label: 'Secure Booking', color: 'text-green-600' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We go above and beyond to ensure you have the best experience.',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making car rental accessible to everyone, everywhere. Quality transportation for all.',
    },
    {
      icon: Clock,
      title: 'Reliability',
      description: 'Count on us for dependable service. We ensure your car is ready when you need it.',
    },
    {
      icon: Award,
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
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative z-10"
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
              className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed relative z-10"
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
                className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform"
              >
                Explore Our Cars
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Velocity was born from a simple idea: what if renting a car could be as easy as booking a ride? 
                We envisioned a platform where car owners could share their vehicles with others, creating a 
                sustainable and accessible transportation solution.
              </p>
              <p>
                Founded in 2024, Velocity has quickly grown into a trusted peer-to-peer car rental platform, 
                connecting thousands of car owners with renters across the country. We believe that everyone 
                deserves access to reliable transportation, and we're making that vision a reality.
              </p>
              <p>
                Our mission is to transform the way people think about car rental, making it more affordable, 
                convenient, and community-driven. Every booking on Velocity supports local car owners while 
                providing renters with quality vehicles at competitive prices.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
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
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <stat.icon className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Velocity?</h2>
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
                className={`${feature.bgColor} p-6 rounded-2xl border-2 border-transparent hover:border-gray-200 transition-all`}
              >
                <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Values</h2>
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
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-red-50 to-red-100 p-10 rounded-2xl"
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
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-2xl"
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

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Velocity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ahmad Mustafa', role: 'Frontend Developer', description: 'Crafting beautiful and intuitive user experiences' },
              { name: 'Muneeb Zia', role: 'Developer', description: 'Building seamless integrations and features' },
              { name: 'Malik Saad Hayat', role: 'Backend Engineer', description: 'Architecting robust and scalable systems' },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-red-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-gray-50 p-8 rounded-2xl">
              <Phone className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <Mail className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">support@velocity.com</p>
            </div>
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

