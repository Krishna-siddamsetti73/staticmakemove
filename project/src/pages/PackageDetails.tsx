import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, Users, Star, Calendar, Check, X, 
  ChevronLeft, ChevronRight, Minus, Plus, Shield, Award, Phone
} from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import RoomGuestSelector from '../components/dropdown';
import ValidatedDateInput from '../components/validatedate';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { packages, setSelectedPackage, setBookingData } = usePackages();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [travelers, setTravelers] = useState(2);
  const [selectedDate, setSelectedDate] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const today = new Date();
  const yyyy = today.getFullYear();
const maxyyyy = yyyy + 1; // Set max year to next year
const mm = String(today.getMonth() + 1).padStart(2, '0'); 
const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
const maxDate = `${maxyyyy}-12-31`;

  const packageData = packages.find(pkg => String(pkg.id) === (id || '0'));

  useEffect(() => {
    if (!packageData) {
      navigate('/packages');
    }
  }, [packageData, navigate]);

  if (!packageData) {
    return null;
  }

  const totalPrice = packageData.price * travelers;
  const savings = packageData.originalPrice ? (packageData.originalPrice - packageData.price) * travelers : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % packageData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + packageData.images.length) % packageData.images.length);
  };

  const handleBookNow = () => {
    setSelectedPackage(packageData);
    setBookingData({
      packageId: packageData.id,
      travelers,
      selectedDate,
      totalPrice
    });
    navigate('/contact');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'included', label: 'What\'s Included' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/packages"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Packages</span>
        </Link>
      </div>

      {/* Image Gallery */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={packageData.images[currentImageIndex]}
              alt={packageData.title}
              className="w-full h-full object-cover"
            />
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300"
              title="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
          <button
  onClick={nextImage}
  title="Next image"
  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300"
>
  <ChevronRight className="h-6 w-6" />
</button>


            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {packageData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  title={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 p-4">
            {packageData.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-20 rounded-lg overflow-hidden ${
                  index === currentImageIndex ? 'ring-2 ring-red-600' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${packageData.title} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Package Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {packageData.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-5 w-5" />
                      <span>{packageData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-5 w-5" />
                      <span>{packageData.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-5 w-5" />
                      <span>{packageData.groupSize}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{packageData.rating}</span>
                    {/* <span className="text-sm text-gray-600">({packageData.reviewCount} reviews)</span> */}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    packageData.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    packageData.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {packageData.difficulty}
                  </span>
                </div>   
              </div>
<div> <span className="text-sm text-gray-600">({packageData.reviewCount} reviews)</span></div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {packageData.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-red-600 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {packageData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="h-5 w-5 text-green-600" />
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Best Time</div>
                        <div className="text-gray-600">{packageData.bestTime}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Group Size</div>
                        <div className="text-gray-600">{packageData.groupSize}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">Difficulty</div>
                        <div className="text-gray-600">{packageData.difficulty}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Day-by-Day Itinerary</h3>
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-red-600 pl-6 pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {day.day}
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">{day.title}</h4>
                        </div>
                        <p className="text-gray-700 mb-3">{day.description}</p>
                        <div className="grid md:grid-cols-2 gap-2">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-gray-600">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'included' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Check className="h-6 w-6 text-green-600 mr-2" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {packageData.included.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <X className="h-6 w-6 text-red-600 mr-2" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {packageData.excluded.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <X className="h-4 w-4 text-red-600" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{packageData.rating}</span>
                        <span className="text-gray-600">({packageData.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center space-x-4 mb-2">
                            <img
                              src={`https://images.pexels.com/photos/${774909 + review}/pexels-photo-${774909 + review}.jpeg?auto=compress&cs=tinysrgb&w=50`}
                              alt="Reviewer"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">Happy Traveler {review}</div>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">
                            Amazing experience! The trip was well organized and exceeded our expectations. 
                            Would definitely recommend to anyone looking for an unforgettable adventure.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-red-600">${packageData.price}</span>
                  {packageData.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">${packageData.originalPrice}</span>
                  )}
                </div>
                <div className="text-gray-600">per person</div>
                {savings > 0 && (
                  <div className="text-green-600 font-semibold">Save ${savings} total!</div>
                )}
              </div> */}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  {/* <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <button
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="p-1 text-gray-600 hover:text-red-600"
                      title="Decrease number of travelers"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-semibold">{travelers} Travelers</span>
                    <button
                      onClick={() => setTravelers(travelers + 1)}
                      className="p-1 text-gray-600 hover:text-red-600"
                      title="Increase number of travelers"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div> */}
                  <RoomGuestSelector
                                      onChange={(data) => {
                                        // const activeTab = "Hotels"; // Ensure activeTab is set to Hotels
                                        console.log('Selected:', data);
                                        // Save to local state or use in API call
                                      } } activeTab={''}/>
                </div>

                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Select a date"
                    title="Preferred Date"
                  /> */}
                            <ValidatedDateInput
  label="Departure Date"
  value={departureDate}
  onChange={setDepartureDate}
  min={minDate}
  max={maxDate}
/>
                </div>
              </div>

              {/* <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">${packageData.price} × {travelers} travelers</span>
                  <span className="font-semibold">${totalPrice}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600">Total Savings</span>
                    <span className="font-semibold text-green-600">-${savings}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">${totalPrice}</span>
                </div>
              </div> */}

              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Book Now
              </button>

              <div className="text-center text-sm text-gray-600 mb-4">
                Free cancellation up to 24 hours before departure
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Best price guarantee</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>Award-winning service</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;