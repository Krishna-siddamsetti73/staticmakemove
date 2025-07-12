import React, { useState } from 'react';
import { MapPin, Clock, Users, Star } from 'lucide-react';

const Packages = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const packages = [
    {
      id: 1,
      title: "Tropical Paradise Escape",
      location: "Maldives",
      duration: "7 Days",
      price: "$2,499",
      rating: 4.9,
      image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "beach",
      description: "Crystal clear waters, overwater bungalows, and pristine beaches await."
    },
    {
      id: 2,
      title: "Mountain Adventure Trek",
      location: "Swiss Alps",
      duration: "10 Days",
      price: "$3,299",
      rating: 4.8,
      image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "adventure",
      description: "Breathtaking mountain views, challenging trails, and alpine experiences."
    },
    {
      id: 3,
      title: "Cultural Heritage Tour",
      location: "Japan",
      duration: "12 Days",
      price: "$4,199",
      rating: 4.9,
      image: "https://images.pexels.com/photos/248195/pexels-photo-248195.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "cultural",
      description: "Ancient temples, traditional ceremonies, and modern city exploration."
    },
    {
      id: 4,
      title: "Safari Wildlife Experience",
      location: "Kenya",
      duration: "8 Days",
      price: "$2,899",
      rating: 4.7,
      image: "https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "adventure",
      description: "Big Five encounters, savanna landscapes, and authentic African culture."
    },
    {
      id: 5,
      title: "Mediterranean Cruise",
      location: "Greek Islands",
      duration: "14 Days",
      price: "$3,799",
      rating: 4.8,
      image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "beach",
      description: "Island hopping, ancient ruins, and azure Mediterranean waters."
    },
    {
      id: 6,
      title: "Northern Lights Expedition",
      location: "Iceland",
      duration: "6 Days",
      price: "$2,199",
      rating: 4.6,
      image: "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "adventure",
      description: "Aurora viewing, ice caves, and geothermal hot springs adventure."
    }
  ];

  const filters = [
    { id: 'all', label: 'All Packages' },
    { id: 'beach', label: 'Beach' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'cultural', label: 'Cultural' }
  ];

  const filteredPackages = activeFilter === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.category === activeFilter);

  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked destinations and experiences crafted for every type of traveler
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg, index) => (
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
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                
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
                  <div className="text-2xl font-bold text-red-600">{pkg.price}</div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;