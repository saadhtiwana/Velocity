import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  Settings,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileMenuRef = useRef(null);

  // Handle scroll for backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(path)
      ? 'bg-red-50 text-red-700 shadow-sm'
      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
      }`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'glass shadow-lg backdrop-blur-xl bg-white/90'
        : 'bg-white shadow-sm'
        }`}
    >
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center group">
            <span className="velocity-logo transition-colors duration-200 group-hover:text-red-600">
              VELOCITY
            </span>
          </Link>

          {/* Desktop Navigation - Center Menu */}
          <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/cars" className={navLinkClass('/cars')}>
              Browse Cars
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>
              About
            </Link>
          </div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Renter links */}
                {user?.role === 'renter' && (
                  <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>
                    My Bookings
                  </Link>
                )}

                {/* Owner links */}
                {user?.role === 'owner' && (
                  <>
                    <Link to="/owner/dashboard" className={navLinkClass('/owner/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/owner/cars" className={navLinkClass('/owner/cars')}>
                      My Cars
                    </Link>
                    <Link to="/owner/bookings" className={navLinkClass('/owner/bookings')}>
                      Bookings
                    </Link>
                    <Link to="/owner/chats" className={navLinkClass('/owner/chats')}>
                      Chats
                    </Link>
                  </>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline">{user?.full_name || 'User'}</span>
                    <motion.div
                      animate={{ rotate: profileMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-xl py-2 z-50 border border-white/20"
                      >
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <p className="text-sm font-semibold text-gray-900">{user?.full_name}</p>
                          <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                          <p className="text-xs text-red-600 capitalize mt-1 font-medium">
                            {user?.role || 'User'}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50 flex items-center transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:scale-105 active:scale-95 text-sm font-medium transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-gray-200/50"
            >
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/')}`}
                >
                  Home
                </Link>
                <Link
                  to="/cars"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/cars')}`}
                >
                  Browse Cars
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/about')}`}
                >
                  About
                </Link>
                {isAuthenticated ? (
                  <>

                    {user?.role === 'renter' && (
                      <Link
                        to="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/my-bookings')}`}
                      >
                        My Bookings
                      </Link>
                    )}

                    {user?.role === 'owner' && (
                      <>
                        <Link
                          to="/owner/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/owner/dashboard')}`}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/owner/cars"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/owner/cars')}`}
                        >
                          My Cars
                        </Link>
                        <Link
                          to="/owner/bookings"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/owner/bookings')}`}
                        >
                          Bookings
                        </Link>
                        <Link
                          to="/owner/chats"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${navLinkClass('/owner/chats')}`}
                        >
                          Chats
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200/50 pt-4 mt-4">
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900">{user?.full_name}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;

