import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Fuel, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CarCard = ({ car, featured = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cars/${car.id}`);
  };

  // Generate random rating for demo (4.0 to 5.0)
  const rating = (4.0 + Math.random() * 1.0).toFixed(1);
  const reviews = Math.floor(Math.random() * 50) + 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="bg-white rounded-xl shadow-soft overflow-hidden card-hover cursor-pointer group relative"
    >
      {/* Car Image with Zoom Effect */}
      <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover image-zoom group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-accent-200">
            <div className="text-center text-gray-600">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              car.status === 'available'
                ? 'bg-emerald-500/90 text-white shadow-lg'
                : 'bg-red-500/90 text-white shadow-lg'
            }`}
          >
            {car.status === 'available' ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">{rating}</span>
            <span className="text-xs text-gray-600">({reviews})</span>
          </div>
        </div>
      </div>

      {/* Car Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{car.year}</p>
          </div>
          <div className="text-right ml-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ${car.daily_price}
            </p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </div>

        {/* Car Features */}
        <div className="mt-4 space-y-2">
          {car.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-primary-500" />
              <span className="truncate">{car.location}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {car.category && (
              <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                <span className="text-xs font-medium">{car.category}</span>
              </div>
            )}
            {car.seating_capacity && (
              <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                <Users className="w-3 h-3 mr-1 text-primary-500" />
                <span className="text-xs font-medium">{car.seating_capacity} seats</span>
              </div>
            )}
            {car.fuel_type && (
              <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                <Fuel className="w-3 h-3 mr-1 text-accent-500" />
                <span className="text-xs font-medium">{car.fuel_type}</span>
              </div>
            )}
          </div>

          {car.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-3">
              {car.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;

