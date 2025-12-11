import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import About from './pages/About'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/about" element={<About />} />
          {/* Add more routes here as you build them */}
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App

