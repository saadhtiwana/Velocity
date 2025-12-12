import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/LoadingSkeleton';

// Common categories and fuel types (matching backend)
const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Van'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const SEATING_OPTIONS = [2, 4, 5, 7, 8];

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickup_date') || '');
  const [returnDate, setReturnDate] = useState(searchParams.get('return_date') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? searchParams.get('category').split(',') : []
  );
  const [selectedFuelTypes, setSelectedFuelTypes] = useState(
    searchParams.get('fuel_type') ? searchParams.get('fuel_type').split(',') : []
  );
  const [seating, setSeating] = useState(searchParams.get('seating') || '');

  // Fetch cars when filters change
  useEffect(() => {
    fetchCars();
  }, [searchParams]);

  // Sync local state with URL params on mount
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setLocation(searchParams.get('location') || '');
    setPickupDate(searchParams.get('pickup_date') || '');
    setReturnDate(searchParams.get('return_date') || '');
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
    setSelectedCategories(searchParams.get('category') ? searchParams.get('category').split(',') : []);
    setSelectedFuelTypes(searchParams.get('fuel_type') ? searchParams.get('fuel_type').split(',') : []);
    setSeating(searchParams.get('seating') || '');
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add all active filters to params
      if (searchParams.get('search')) params.append('search', searchParams.get('search'));
      if (searchParams.get('location')) params.append('location', searchParams.get('location'));
      if (searchParams.get('pickup_date')) params.append('pickup_date', searchParams.get('pickup_date'));
      if (searchParams.get('return_date')) params.append('return_date', searchParams.get('return_date'));
      if (searchParams.get('min_price')) params.append('min_price', searchParams.get('min_price'));
      if (searchParams.get('max_price')) params.append('max_price', searchParams.get('max_price'));
      if (searchParams.get('seating')) params.append('seating', searchParams.get('seating'));

      // Handle category - backend accepts single value, so send first selected
      const categoryParam = searchParams.get('category');
      if (categoryParam) {
        const categories = categoryParam.split(',');
        if (categories.length > 0) {
          params.append('category', categories[0]);
        }
      }

      // Handle fuel type - backend accepts single value, so send first selected
      const fuelTypeParam = searchParams.get('fuel_type');
      if (fuelTypeParam) {
        const fuelTypes = fuelTypeParam.split(',');
        if (fuelTypes.length > 0) {
          params.append('fuel_type', fuelTypes[0]);
        }
      }

      const response = await api.get(`/api/cars?${params.toString()}`);
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = () => {
    const newParams = new URLSearchParams();

    if (search.trim()) newParams.append('search', search.trim());
    if (location.trim()) newParams.append('location', location.trim());
    if (pickupDate) newParams.append('pickup_date', pickupDate);
    if (returnDate) newParams.append('return_date', returnDate);
    if (minPrice) newParams.append('min_price', minPrice);
    if (maxPrice) newParams.append('max_price', maxPrice);
    if (seating) newParams.append('seating', seating);
    if (selectedCategories.length > 0) newParams.append('category', selectedCategories.join(','));
    if (selectedFuelTypes.length > 0) newParams.append('fuel_type', selectedFuelTypes.join(','));

    setSearchParams(newParams);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);

    // Update URL immediately
    const newParams = new URLSearchParams(searchParams);
    if (newCategories.length > 0) {
      newParams.set('category', newCategories.join(','));
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleFuelTypeToggle = (fuelType) => {
    const newFuelTypes = selectedFuelTypes.includes(fuelType)
      ? selectedFuelTypes.filter(f => f !== fuelType)
      : [...selectedFuelTypes, fuelType];
    setSelectedFuelTypes(newFuelTypes);

    // Update URL immediately
    const newParams = new URLSearchParams(searchParams);
    if (newFuelTypes.length > 0) {
      newParams.set('fuel_type', newFuelTypes.join(','));
    } else {
      newParams.delete('fuel_type');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setPickupDate('');
    setReturnDate('');
    setMinPrice('');
    setMaxPrice('');
    setSeating('');
    setSelectedCategories([]);
    setSelectedFuelTypes([]);
    setSearchParams(new URLSearchParams());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters();
  };

  const hasActiveFilters = search || location || pickupDate || returnDate || minPrice || maxPrice || seating || selectedCategories.length > 0 || selectedFuelTypes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Cars</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside
            className={`${showFilters ? 'block' : 'hidden'
              } md:block w-full md:w-80 bg-white rounded-lg shadow-md p-6 h-fit sticky top-4`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </button>
              )}
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-6">
              {/* Search Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Brand/Model
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={updateFilters}
                    placeholder="Search cars..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={updateFilters}
                  placeholder="City or area"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    updateFilters();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    updateFilters();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (per day)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={updateFilters}
                    placeholder="Min"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={updateFilters}
                    placeholder="Max"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Seating Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Seating
                </label>
                <select
                  value={seating}
                  onChange={(e) => {
                    setSeating(e.target.value);
                    updateFilters();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="">Any</option>
                  {SEATING_OPTIONS.map((seats) => (
                    <option key={seats} value={seats}>
                      {seats} seats
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Type Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fuel Type
                </label>
                <div className="space-y-2">
                  {FUEL_TYPES.map((fuelType) => (
                    <label key={fuelType} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedFuelTypes.includes(fuelType)}
                        onChange={() => handleFuelTypeToggle(fuelType)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{fuelType}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </aside>

          {/* Cars Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <CarCardSkeleton key={index} />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to see more results.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Found {cars.length} {cars.length === 1 ? 'car' : 'cars'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;

