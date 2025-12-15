import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { StripeProvider } from './context/StripeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Chats from './pages/owner/Chats'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <StripeProvider>
        <AppContent />
      </StripeProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const location = useLocation();

  // Hide navbar and footer on auth pages
  const hideNavAndFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes for Renters */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute requireRole="renter">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes for Owners */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute requireRole="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/add-car"
            element={
              <ProtectedRoute requireRole="owner">
                <AddCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/cars"
            element={
              <ProtectedRoute requireRole="owner">
                <ManageCars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute requireRole="owner">
                <ManageBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/chats"
            element={
              <ProtectedRoute requireRole="owner">
                <Chats />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  )
}

export default App




