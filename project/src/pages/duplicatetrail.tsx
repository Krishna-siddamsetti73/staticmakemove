import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, Award, Shield, Clock, MapPin, X, Search, icons, Building2, Bus, Car, CreditCard, Palmtree, Ship, Train } from 'lucide-react';
import { Calendar, Plane } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import airportsData from "../../../iata_airports.json"; // Adjust path as needed

import destinationsData from '../destinations.json'; // Adjust path as needed
import TabPopup from '../pages/Tabpopup.tsx';
import Header from '../components/Header.tsx';



const Home = () => {
    
  // const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  type Airport = { city: string; airport: string; iata: string };
  const [airports, setAirports] = useState<Airport[]>([]);
   const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');
  const [tripType, setTripType] = useState('oneway'); // 'oneway', 'roundtrip', 'multicity'
  const [travelerError, setTravelerError] = useState('');
 interface CounterType {
    type: 'adults' | 'children' | 'infants';
  }
  const totalTravelers = adults + children + infants;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
const [travellers, setTravellers] = useState("1 Traveller - Economy");

const { packages } = usePackages();
const [currentSlide, setCurrentSlide] = useState(0);
const [currentTestimonial, setCurrentTestimonial] = useState(0);
const [showVideo, setShowVideo] = useState(false);

// Traveler and class selection
const [travelers, setTravelers] = useState(1); 


// Fare Type Selection
const [fareType, setFareType] = useState("Regular");


// Round Trip Date
const [departureDate, setDepartureDate] = useState("");
const [returnDate, setReturnDate] = useState("");

// Location Search UI (Optional separation if needed)
const [fromLocation, setFromLocation] = useState("");
const [toLocation, setToLocation] = useState("");


// Travelers dropdown

const swapLocations = () => {
  const temp = from;
  setFrom(to);
  setTo(temp);
};


// Add state for hotel check-in and check-out dates
// const [hotelCheckIn, setHotelCheckIn] = useState("");
// const [hotelCheckOut, setHotelCheckOut] = useState("");
 const today = new Date();
const yyyy = today.getFullYear();
const maxyyyy = yyyy + 1; // Set max year to next year
const mm = String(today.getMonth() + 1).padStart(2, '0'); 
const dd = String(today.getDate()).padStart(2, '0');
const [destination, setDestination] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<{ city: string; country: string }[]>([]);
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelCheckOut, setHotelCheckOut] = useState('');
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelChildAges, setHotelChildAges] = useState({});
  const [hotelPriceRange, setHotelPriceRange] = useState('');
  
interface Destination {
    city: string;
    country: string;
}

interface ChildAges {
    [key: number]: string;
}

const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setDestination(value);

  const filtered = destinationsData
    .filter(dest => dest.name.toLowerCase().includes(value.toLowerCase()))
    .map(dest => ({
      city: dest.name,
      country: dest.code
    }));

  setFilteredDestinations(filtered);
};


interface HandleChildAgeChange {
    (index: number, value: string): void;
}

const handleChildAgeChange: HandleChildAgeChange = (index, value) => {
    setHotelChildAges((prev) => ({ ...prev, [index]: value }));
};


 

 
const minDate = `${yyyy}-${mm}-${dd}`;
const maxDate = `${maxyyyy}-12-31`;

const thumbnailUrl = 'https://img.youtube.com/vi/3SsK-cxlj_w/hqdefault.jpg';
const [activeTab, setActiveTab] = useState<string | null>(null);

useEffect(() => {
  return setAirports(airportsData);
}, []);
interface ValidateTravelersParams {
  adultCount: number;
  infantCount: number;
}

const validateTravelers = (
  adultCount: ValidateTravelersParams['adultCount'],
  infantCount: ValidateTravelersParams['infantCount']
): boolean => {
  if (infantCount > adultCount) {
    setTravelerError('Number of adults should be equal or greater than number of infants');
    return false;
  } else {
    setTravelerError('');
    return true;
  }
};

  interface IncrementCounterType {
    type: 'adults' | 'children' | 'infants';
  }

  const incrementCounter = (type: IncrementCounterType['type']) => {
    switch(type) {
      case 'adults':
        const newAdults: number = adults + 1;
        setAdults(newAdults);
        validateTravelers(newAdults, infants);
        break;
      case 'children':
        setChildren(children + 1);
        break;
      case 'infants':
        const newInfants: number = infants + 1;
        setInfants(newInfants);
        validateTravelers(adults, newInfants);
        break;
    }
  };


  const decrementCounter = (type: CounterType['type']) => {
    switch(type) {
      case 'adults':
        const newAdults: number = Math.max(1, adults - 1);
        setAdults(newAdults);
        validateTravelers(newAdults, infants);
        break;
      case 'children':
        setChildren(Math.max(0, children - 1));
        break;
      case 'infants':
        const newInfants: number = Math.max(0, infants - 1);
        setInfants(newInfants);
        validateTravelers(adults, newInfants);
        break;
    }
  };

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  // Show a popup modal when account is inactive
  // Example: setShowInactive(true) to trigger this modal
  const [showInactive, setShowInactive] = useState(false);

  if (showInactive) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            onClick={() => setShowInactive(false)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-4">Account Inactive</h2>
          <p className="text-gray-600 mb-4">
            Your account is currently inactive. Please contact support for assistance.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Contact Support
          </button>
        </div>
      </div>
    );
  }
  // Add similar logic for other tabs if needed
};

  const heroSlides = [
    {
      image: "src/banner1.mp4",
      title: "Tropical Paradise Awaits",
      subtitle: "Discover pristine beaches and crystal waters",
      cta: "Explore Beach Packages"
    },
    {
      image: "src/banner0.mp4",
      title: "Mountain Adventures",
      subtitle: "Conquer peaks and embrace the wilderness",
      cta: "View Adventure Tours"
    },
    {
      image: "src/banner2.mp4",
      title: "Cultural Journeys",
      subtitle: "Immerse in ancient traditions and heritage",
      cta: "Cultural Experiences"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "Make A Move made our honeymoon absolutely perfect! The Maldives package exceeded all expectations.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      trip: "Tropical Paradise Escape"
    },
    {
      name: "Michael Chen",
      location: "Toronto, Canada",
      rating: 5,
      text: "The Swiss Alps adventure was incredible! Professional guides and stunning views throughout.",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      trip: "Mountain Adventure Trek"
    },
    {
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      text: "Japan cultural tour was life-changing. Perfect balance of traditional and modern experiences.",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      trip: "Cultural Heritage Tour"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "15", label: "Years Experience" },
    { number: "4.9", label: "Average Rating" }
  ];

  const whyChooseUs = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Best Price Guarantee",
      description: "We guarantee the best prices for all our travel packages with no hidden fees."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Local Guides",
      description: "Professional guides with deep local knowledge to enhance your experience."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support before, during, and after your trip."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Award Winning Service",
      description: "Recognized for excellence in travel services and customer satisfaction."
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(testimonialTimer);
    };
  }, [heroSlides.length, testimonials.length]);
  const activePackages = packages.filter(pkg => pkg.status !== 'deleted');
  const featuredPackages = activePackages.filter(pkg => pkg.featured).slice(0, 3);

  return (
    <div>
      {/* Hero Slider */}
      
      <section className="relative h-screen overflow-hidden">
        

        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-blue-600/80 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-blue-600/80 z-10">
            <video
    className="w-full h-full object-cover"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src={slide.image} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
             
            <div className="relative z-20 h-full flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </p>
                <Link
                  to="/packages"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              title={`Go to slide ${index + 1}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
      </section>
    {/* <Header activeTab={activeTab} setActiveTab={setActiveTab} />
    <TabPopup activeTab={activeTab} setActiveTab={setActiveTab}>
{/*       
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Plan Your Travel with Make A Move
          </h2> */}
          {/* <div className="flex flex-row justify-center gap-6 mb-8">
            <img
              src="src/make a move final logo M.png"
              alt="Travel 1"
              className="h-10 w-15 object-contain" 
            />
            <img
              src="src/make_a_move_final_logo_text[1].png"
              alt="Travel 2"
             className="h-10 w-15 object-contain" 
            />
          </div> */} 
{/* 
           <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { name: 'Flights', icon: Plane },
    { name: 'Hotels', icon: Building2 },
    // { name: 'Homestays', icon: Home },
    { name: 'Packages', icon: Palmtree },
      {name: 'Cruise', icon: Ship},
    { name: 'Trains', icon: Train },
    { name: 'Buses', icon: Bus },
    { name: 'Cabs', icon: Car },
    { name: 'Visa', icon: CreditCard },
    { name: 'ForexCard', icon: MapPin },
    { name: 'Insurance', icon: Shield },
            ].map(
              (tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-2 py-2 rounded-full font-medium transition-all ${
                    activeTab === tab.name ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <tab.icon />
                </button>
              )
            )}
          </div>  */}

         {/* {activeTab === "Flights" && (
     <div className="space-y-6"> */}
      {/* Trip Type Selection */}
{/*       
      <div className="flex gap-8 mb-6">
        {[
          { value: "oneWay", label: "One Way" },
          { value: "roundTrip", label: "Round Trip" },
          { value: "multiCity", label: "Multi City" },
        ].map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={option.value}
              checked={tripType === option.value}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className={`text-gray-700 ${option.value === "roundTrip" ? "font-semibold" : ""}`}>{option.label}</span>
          </label>
        ))}
      </div> */}

      {/* Main Search Form */}
      {/* <div className="flex flex-wrap gap-4 items-center"> */}
        {/* From Location */}
         {/* <div className="relative">
            <div className="relative flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <div className="relative">
     
      <input
        className="border p-3 rounded w-full"
        placeholder="From (City or Airport)"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      {from && (
        <div className="absolute z-10 bg-white border w-full max-h-60 overflow-auto shadow-lg">
          {airports
            .filter((airport) =>
              `${airport.city} ${airport.airport} ${airport.iata}`
                .toLowerCase()
                .includes(from.toLowerCase())
            )
            .slice(0, 5)
            .map((airport, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setFrom(`${airport.city} - ${airport.airport} (${airport.iata})`)}
              >
                {airport.city} - {airport.airport} ({airport.iata})
              </div>
            ))}
        </div>
      )}
    </div>
    </div>
        </div> */}

        {/* Swap Button */}
        {/* <button onClick={swapLocations} className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full mt-6">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button> */}

        {/* To Location */}
        {/* <div className="relative flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <div className="relative">
      <input
        className="border p-3 rounded w-full"
        placeholder="To (City or Airport)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      {to && (
        <div className="absolute z-10 bg-white border w-full max-h-60 overflow-auto shadow-lg">
          {airports
            .filter((airport) =>
              `${airport.city} ${airport.airport} ${airport.iata}`
                .toLowerCase()
                .includes(to.toLowerCase())
            )
            .slice(0, 5)
            .map((airport, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setTo(`${airport.city} - ${airport.airport} (${airport.iata})`)}
              >
                {airport.city} - {airport.airport} ({airport.iata})
              </div>
            ))}
        </div>
      )}
    </div>
        </div> */}

        {/* Departure Date */}
        {/* <div className="flex-1 min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Departure</label>
          <input type="date" min={minDate} max={maxDate} value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="border-2 border-gray-200 rounded-lg p-3 w-full" />
        </div> */}

        {/* Return Date */}
        {/* {tripType === "roundTrip" && (
          <div className="flex-1 min-w-32">
            <label className="block text-sm text-gray-600 mb-1">Return</label>
            <input type="date" min={departureDate} max={maxDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="border-2 border-gray-200 rounded-lg p-3 w-full" />
          </div>
        )} */}

        {/* Travelers & Class */}
         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> */}
        {/* Travelers Dropdown */}
        {/* <div className="relative">
          <label className="block text-sm font-medium mb-1">Travelers</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <button 
              onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
            >
              {totalTravelers} Traveler{totalTravelers !== 1 ? 's' : ''}, {travelClass}
            </button>
          </div> */}

          {/* Traveler Dropdown */}
          {/* {showTravelerDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-10 p-4 mt-1">
              <div className="space-y-4">
                {/* Adults */}
                {/* <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Adult</div>
                    <div className="text-sm text-gray-500">12+ Years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => decrementCounter('adults')}
                      disabled={adults <= 1}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        adults <= 1 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={adults}
                      onChange={(e) => {
                        const value = Math.max(1, parseInt(e.target.value) || 1);
                        setAdults(value);
                        validateTravelers(value, infants);
                      }}
                      className="w-12 text-center font-medium border rounded px-1 py-1"
                      min="1"
                    />
                    <button 
                      onClick={() => incrementCounter('adults')}
                      className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div> 
                </div> */}

                {/* Children */}
                {/* <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Children</div>
                    <div className="text-sm text-gray-500">2-11 Years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => decrementCounter('children')}
                      disabled={children <= 0}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        children <= 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={children}
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        setChildren(value);
                      }}
                      className="w-12 text-center font-medium border rounded px-1 py-1"
                      min="0"
                    />
                    <button 
                      onClick={() => incrementCounter('children')}
                      className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                {/* <div className="flex items-center justify-between"> */}
                  {/* <div>
                    <div className="font-medium text-gray-900">Infant</div>
                    <div className="text-sm text-gray-500">Under 2 Years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => decrementCounter('infants')}
                      disabled={infants <= 0}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        infants <= 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={infants}
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        setInfants(value);
                        validateTravelers(adults, value);
                      }}
                      className="w-12 text-center font-medium border rounded px-1 py-1"
                      min="0"
                    />
                    <button 
                      onClick={() => incrementCounter('infants')}
                      className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div> */}

                {/* Error Message */}
                {/* {travelerError && (
                  <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                    {travelerError}
                  </div>
                )} */}
                {/* Class Selection */}
                {/* <div className="pt-4 border-t">
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <select 
                    value={travelClass} 
                    onChange={(e) => setTravelClass(e.target.value)} 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div> */}

                {/* <button 
                  onClick={() => setShowTravelerDropdown(false)} 
                  disabled={!!travelerError}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    travelerError 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>)}
         </div>
         </div>
         </div>

       
   
  

      {/* Fare Type Selection */}
      {/* <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">Select a special fare</span>
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">EXTRA SAVINGS</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {["Regular", "Student", "Senior Citizen", "Armed Forces", "Doctor and Nurses"].map((fare) => (
            <label key={fare} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="fareType" value={fare} checked={fareType === fare} onChange={(e) => setFareType(e.target.value)} className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium">{fare}</div>
              </div>
            </label>
          ))}
        </div>
      </div>  */}

      {/* Search Button */}
      {/* <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2">
        <Search className="w-5 h-5" /> SEARCH
      </button>
    </div>
  )}
        {activeTab === "Hotels" && (
          <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Search Hotels</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6"> */}
        {/* Destination */}
        {/* <div className="relative">
          <label className="block text-sm text-gray-700 mb-1">Destination</label>
          <input
            type="text"
            className="border p-3 rounded w-full"
            placeholder="City or Property"
            value={destination}
            onChange={handleDestinationChange}
          />
          {filteredDestinations.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
              {filteredDestinations.map((dest, i) => (
                <li
                  key={i}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setDestination(dest.city);
                    setFilteredDestinations([]);
                  }}
                >
                  {dest.city}, {dest.country}
                </li>
              ))}
            </ul>
          )}
        </div> */}

        {/* Check-in / Check-out */}
        {/* <div>
          <label className="block text-sm text-gray-700 mb-1">Check-in</label>
          <input
            type="date"
            className="border p-3 rounded w-full"
            min={minDate}
            value={hotelCheckIn}
            onChange={(e) => {
              setHotelCheckIn(e.target.value);
              if (hotelCheckOut && e.target.value >= hotelCheckOut) {
                setHotelCheckOut('');
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Check-out</label>
          <input
            type="date"
            className="border p-3 rounded w-full"
            min={hotelCheckIn || minDate}
            value={hotelCheckOut}
            onChange={(e) => setHotelCheckOut(e.target.value)}
            disabled={!hotelCheckIn}
          />
        </div> */}

        {/* Room, Adults, Children */}
        {/* <div>
          <label className="block text-sm text-gray-700 mb-1">Rooms</label>
          <select className="border p-3 rounded w-full" value={hotelRooms} onChange={(e) => setHotelRooms(+e.target.value)}>
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Adults</label>
          <select className="border p-3 rounded w-full" value={hotelAdults} onChange={(e) => setHotelAdults(+e.target.value)}>
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Children</label>
          <select className="border p-3 rounded w-full" value={hotelChildren} onChange={(e) => setHotelChildren(+e.target.value)}>
            {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} Child{n !== 1 ? 'ren' : ''}</option>)}
          </select>
        </div> */}

        {/* Age of each child */}
        {/* {Array.from({ length: hotelChildren }, (_, index) => (
          <div key={index}>
            <label className="block text-sm text-gray-700 mb-1">Age of Child {index + 1}</label>
            <select
              className="border p-3 rounded w-full"
              onChange={(e) => handleChildAgeChange(index, e.target.value)}
            >
              <option value="">Select Age</option>
              {[...Array(18)].map((_, i) => (
                <option key={i} value={i}>{i} years</option>
              ))}
            </select>
          </div>
        ))} */}

        {/* Price Filter */}
        {/* <div>
          <label className="block text-sm text-gray-700 mb-1">Price Range</label>
          <input
            type="range"
            min={0}
            max={5000}
            step={500}
            value={hotelPriceRange ? parseInt(hotelPriceRange) : 0}
            onChange={(e) => setHotelPriceRange(e.target.value)}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>₹1500</span>
            <span>₹2500</span>
            <span>₹5000+</span>
          </div>
          <div className="mt-2 text-sm font-medium text-gray-700">
            Selected: {hotelPriceRange ? `₹${hotelPriceRange}+` : "Any"}
          </div>
        </div>
      </div>

      {/* Search Button */}
      {/* <button
        onClick={handleSearch}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
      >
        Search Hotels
      </button>
    </div>
      )}
      {activeTab === "Packages" && (
        <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="Destination" />
              <input className="border p-3 rounded w-full" type="date"   min={minDate}
  max={maxDate}/>
              <select className="border p-3 rounded w-full">
                <option>Package Type</option>
              </select>
              <Link to={'/contact'}>
             <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
        Search Packages
      </button>
      </Link>
            </div>
          )}

          {activeTab === "Cruise" && (
            <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="From (e.g., Delhi)" />
              <input className="border p-3 rounded w-full" placeholder="To (e.g., Mumbai)" />
              <input className="border p-3 rounded w-full" type="date"    min={minDate}
  max={maxDate}/>
              <select className="border p-3 rounded w-full">
                <option>1 Traveller - Economy</option>
                <option>2 Travellers - Economy</option>
                <option>Business Class</option>
              </select>
              <Link to={'/contact'}>
              <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
        Search Hotels
      </button>
      </Link>
            </div>
          )}

          {activeTab === "Trains" && (
            <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="From Station" />
              <input className="border p-3 rounded w-full" placeholder="To Station" />
              <input className="border p-3 rounded w-full" type="date" min={minDate}
            max={maxDate}/>
               <Link to={'/contact'}>
            <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
        Search Trains
      </button>
      </Link>
            </div>
          )}

          {activeTab === "Buses" && (
            <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="From City" />
              <input className="border p-3 rounded w-full" placeholder="To City" />
              <input className="border p-3 rounded w-full" type="date" min={minDate}
            max={maxDate}/>
                  <Link to={'/contact'}>
             <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
        Search Buses
      </button>
      </Link>
            </div>
          )}

          {activeTab === "Cabs" && (
            <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="Pickup Location" />
              <input className="border p-3 rounded w-full" placeholder="Drop Location" />
              <input className="border p-3 rounded w-full" type="date"   min={minDate}
  max={maxDate} />
                <Link to={'/contact'}>
              <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
        Search Cabs
      </button>
       </Link>
            </div>
          )}

          {activeTab === "Visa" && (
            <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="Destination Country" />
              <select className="border p-3 rounded w-full">
                <option>Visa Type</option>
              </select>
                <Link to={'/contact'}>
             <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
       Apply for Visa
      </button>
      </Link>
            </div>
          )} */}

          {/* {activeTab === "Forex" && (
            <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="Currency to Buy" />
              <input className="border p-3 rounded w-full" placeholder="Amount" />
              <Link to={'/contact'}>
              <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
        Apply for Forex
      </button>
      </Link>
            </div>
          )}

          {activeTab === "Insurance" && (
            <div className="grid md:grid-cols-2 gap-6">
              <input className="border p-3 rounded w-full" placeholder="Destination" />
              <input className="border p-3 rounded w-full" type="date" placeholder="Travel Date" min={minDate}
            max={maxDate} />
          <Link to={'/contact'}>
            <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full md:col-span-2"
        onClick={handleSearch}
      >
        Apply for Insurance
      </button>
      </Link>
            </div>
          )}
     
        </TabPopup> */} 

      {/* Stats Section */}
      {/* <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      </section> */}
      
  

            {/* <section className="py-20 bg-gradient-to-r from-blue-100 to-red-100">
      <div className="container mx-auto px-4"> */}
     
      {/* </div>
    </section> */}
    
      {/* Featured Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked destinations and experiences crafted for every type of traveler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
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
                  {pkg.originalPrice && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save ${pkg.originalPrice - pkg.price}
                    </div>
                  )}
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

          <div className="text-center mt-12">
            <Link
              to="/packages"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <span>View All Packages</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-900 text-white relative z-0">

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience the Journey
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch our travelers share their incredible experiences and get inspired for your next adventure
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-1">
            <div className="bg-gray-800 rounded-2xl p-8 md:p-16 text-center">
                <img 
            src={thumbnailUrl} 
            alt="Video Thumbnail" 
            className="w-full h-auto object-cover"
          />
              <div className="mb-8">
                <div 
                  className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-white/30 transition-colors cursor-pointer"
                  onClick={() => setShowVideo(true)}
                >
                  <Play className="h-12 w-12 text-white ml-1" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Watch Our Travel Stories</h3>
                <p className="text-gray-300">
                  Discover breathtaking destinations through the eyes of our travelers. 
                  From tropical paradises to mountain adventures, see what awaits you.
                </p>
              </div>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                onClick={() => setShowVideo(true)}
              >
                Play Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl px-4">
            <button 
              className="absolute top-4 right-4 text-white hover:text-red-500"
              onClick={() => setShowVideo(false)}
            >
              <X size={28} />
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/3SsK-cxlj_w?si=uhmW4roLAQVzUnOE&amp;start=3" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/3SsK-cxlj_w?si=uhmW4roLAQVzUnOE&amp;start=3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
      {/* Testimonials Carousel */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-red-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Real experiences from real travelers who made their move with us
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-80 flex items-center">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 p-8 md:p-12 flex items-center transition-all duration-500 ${
                      index === currentTestimonial
                        ? 'opacity-100 transform translate-x-0'
                        : index < currentTestimonial
                        ? 'opacity-0 transform -translate-x-full'
                        : 'opacity-0 transform translate-x-full'
                    }`}
                  >
                    <div className="w-full text-center">
                      <div className="flex items-center justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <blockquote className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-red-600"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{testimonial.name}</div>
                          <div className="text-gray-600">{testimonial.location}</div>
                          <div className="text-sm text-red-600 font-medium">{testimonial.trip}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  title={`Go to testimonial ${index + 1}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Make A Move?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional travel experiences with unmatched service and value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


       