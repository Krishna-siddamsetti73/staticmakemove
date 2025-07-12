import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { usePackages } from '../context/PackageContext';

const Packages = () => {
  var { packages } = usePackages();
  const [activeFilter, setActiveFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

 

  const difficulties = ['Easy', 'Moderate', 'Challenging'];
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
   packages = packages.filter(pkg => pkg.status !== 'deleted'); // Filter to only include featured packages
  const filteredPackages = packages
    .filter(pkg => {
      
      const matchesCategory = activeFilter === 'all' || pkg.category === activeFilter;
      const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];
      const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(pkg.difficulty);
      
      return matchesCategory && matchesPrice && matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
     const categories = [
    { id: 'all', label: 'All Packages', count: packages.length },
    { id: 'beach', label: 'Beach & Islands', count: packages.filter(p => p.category === 'beach').length },
    { id: 'adventure', label: 'Adventure', count: packages.filter(p => p.category === 'adventure').length },
    { id: 'cultural', label: 'Cultural', count: packages.filter(p => p.category === 'cultural').length }
  ];

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Travel Packages</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Discover your perfect adventure from our curated collection of travel experiences
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-600 hover:text-red-600"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Packages
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search destinations..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveFilter(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeFilter === category.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.label}</span>
                          <span className="text-sm opacity-75">({category.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div> */}

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Difficulty Level
                  </label>
                  <div className="space-y-2">
                    {difficulties.map((difficulty) => (
                      <label key={difficulty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDifficulties.includes(difficulty)}
                          onChange={() => toggleDifficulty(difficulty)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                        />
                        <span className="ml-2 text-gray-700">{difficulty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    // setPriceRange([0, 5000]);
                    setSearchTerm('');
                    setSelectedDifficulties([]);
                    setSortBy('featured');
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredPackages.length} Package{filteredPackages.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-600">
                  {activeFilter !== 'all' && `Filtered by ${categories.find(c => c.id === activeFilter)?.label}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  {/* <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option> */}
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              console.log(filteredPackages),
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPackages.map((pkg, index) => (
                  console.log(pkg),
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{pkg.rating}</span>
                        <span className="text-xs text-gray-600">({pkg.reviewCount})</span>
                      </div>
                      {/* {pkg.originalPrice && (
                        // <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        //   Save ${pkg.originalPrice - pkg.price}
                        // </div>
                      )} */}
                      {pkg.featured && (
                        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pkg.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          pkg.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pkg.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">{pkg.groupSize}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{pkg.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{pkg.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                       
                        <Link
                          to={`/package/${pkg.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;