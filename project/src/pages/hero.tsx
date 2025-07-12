import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, MapPin, Plane, Home, Train, Bus, Car, CreditCard, Shield, Package } from 'lucide-react';

const MakeMyTripClone = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [tripType, setTripType] = useState('roundTrip');
  const [fromLocation, setFromLocation] = useState('Delhi');
  const [toLocation, setToLocation] = useState('Mumbai');
  const [departureDate, setDepartureDate] = useState('2025-07-01');
  const [returnDate, setReturnDate] = useState('2025-07-01');
  const [travelers, setTravelers] = useState(24);
  const [travelClass, setTravelClass] = useState('Economy');
  const [fareType, setFareType] = useState('Regular');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);

  const navTabs = [
    { id: 'flights', icon: '✈️', label: 'Flights' },
    { id: 'hotels', icon: '🏨', label: 'Hotels' },
    { id: 'homestays', icon: '🏠', label: 'Homestays & Villas' },
    { id: 'packages', icon: '📦', label: 'Holiday Packages' },
    { id: 'trains', icon: '🚄', label: 'Trains' },
    { id: 'buses', icon: '🚌', label: 'Buses' },
    { id: 'cabs', icon: '🚗', label: 'Cabs' },
    { id: 'visa', icon: '📄', label: 'Visa' },
    { id: 'forex', icon: '💳', label: 'Forex Card & Currency' },
    { id: 'insurance', icon: '🛡️', label: 'Travel Insurance' }
  ];

  const airports = [
    { code: 'DEL', name: 'Delhi', fullName: 'Indira Gandhi International Airport' },
    { code: 'BOM', name: 'Mumbai', fullName: 'Chhatrapati Shivaji International Airport' },
    { code: 'BLR', name: 'Bangalore', fullName: 'Kempegowda International Airport' },
    { code: 'MAA', name: 'Chennai', fullName: 'Chennai International Airport' },
    { code: 'CCU', name: 'Kolkata', fullName: 'Netaji Subhas Chandra Bose International Airport' },
    { code: 'HYD', name: 'Hyderabad', fullName: 'Rajiv Gandhi International Airport' },
    { code: 'AMD', name: 'Ahmedabad', fullName: 'Sardar Vallabhbhai Patel International Airport' },
    { code: 'PNQ', name: 'Pune', fullName: 'Pune Airport' },
    { code: 'GOI', name: 'Goa', fullName: 'Goa International Airport' },
    { code: 'JAI', name: 'Jaipur', fullName: 'Jaipur International Airport' }
  ];

interface FormattedDate {
    day: number;
    month: string;
    year: string;
    dayName: string;
}

const formatDate = (dateString: string): FormattedDate => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    const dayName = date.toLocaleString('default', { weekday: 'short' });
    return { day, month, year, dayName };
};

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const renderFlightBooking = () => (
    <div className="space-y-6">
      {/* Trip Type Selection */}
      <div className="flex gap-8 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="oneWay"
            checked={tripType === 'oneWay'}
            onChange={(e) => setTripType(e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">One Way</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="roundTrip"
            checked={tripType === 'roundTrip'}
            onChange={(e) => setTripType(e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700 font-semibold">Round Trip</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="multiCity"
            checked={tripType === 'multiCity'}
            onChange={(e) => setTripType(e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">Multi City</span>
        </label>
      </div>

      {/* Main Search Form */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* From Location */}
        <div className="relative flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <div 
            className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => setShowFromDropdown(!showFromDropdown)}
          >
            <div className="font-bold text-lg">{fromLocation}</div>
            <div className="text-sm text-gray-500">
              {airports.find(a => a.name === fromLocation)?.code}, {airports.find(a => a.name === fromLocation)?.fullName}
            </div>
          </div>
          {showFromDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {airports.map(airport => (
                <div 
                  key={airport.code}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    setFromLocation(airport.name);
                    setShowFromDropdown(false);
                  }}
                >
                  <div className="font-semibold">{airport.name}</div>
                  <div className="text-sm text-gray-500">{airport.code}, {airport.fullName}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <button 
          onClick={swapLocations}
          className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full mt-6 transition-colors"
        >
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* To Location */}
        <div className="relative flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <div 
            className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => setShowToDropdown(!showToDropdown)}
          >
            <div className="font-bold text-lg">{toLocation}</div>
            <div className="text-sm text-gray-500">
              {airports.find(a => a.name === toLocation)?.code}, {airports.find(a => a.name === toLocation)?.fullName?.slice(0, 30)}...
            </div>
          </div>
          {showToDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {airports.map(airport => (
                <div 
                  key={airport.code}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    setToLocation(airport.name);
                    setShowToDropdown(false);
                  }}
                >
                  <div className="font-semibold">{airport.name}</div>
                  <div className="text-sm text-gray-500">{airport.code}, {airport.fullName}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="flex-1 min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Departure</label>
          <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors">
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-transparent outline-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(departureDate).dayName}
            </div>
          </div>
        </div>

        {/* Return Date */}
        {tripType === 'roundTrip' && (
          <div className="flex-1 min-w-32">
            <label className="block text-sm text-gray-600 mb-1">Return</label>
            <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent outline-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(returnDate).dayName}
              </div>
            </div>
          </div>
        )}

        {/* Travelers & Class */}
        <div className="relative flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">Travellers & Class</label>
          <div 
            className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
          >
            <div className="font-bold text-lg">{travelers} Travellers</div>
            <div className="text-sm text-gray-500">{travelClass}/Premium Economy</div>
          </div>
          {showTravelerDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Travelers</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{travelers}</span>
                    <button 
                      onClick={() => setTravelers(travelers + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <select 
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowTravelerDropdown(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fare Type Selection */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">Select a special fare</span>
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">EXTRA SAVINGS</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { id: 'Regular', label: 'Regular', desc: 'Regular fares' },
            { id: 'Student', label: 'Student', desc: 'Extra discounts/baggage' },
            { id: 'Senior Citizen', label: 'Senior Citizen', desc: 'Up to ₹ 600 off' },
            { id: 'Armed Forces', label: 'Armed Forces', desc: 'Up to ₹ 600 off' },
            { id: 'Doctor and Nurses', label: 'Doctor and Nurses', desc: 'Up to ₹ 600 off' }
          ].map(fare => (
            <label key={fare.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="fareType"
                value={fare.id}
                checked={fareType === fare.id}
                onChange={(e) => setFareType(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="text-sm font-medium">{fare.label}</div>
                <div className="text-xs text-gray-500">{fare.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2">
        <Search className="w-5 h-5" />
        SEARCH
      </button>
    </div>
  );

  const renderHotelBooking = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-64">
          <label className="block text-sm text-gray-600 mb-1">City, Area or Property</label>
          <input
            type="text"
            placeholder="Where do you want to stay?"
            className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="flex-1 min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Check-in</label>
          <input
            type="date"
            defaultValue="2025-07-01"
            className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="flex-1 min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Check-out</label>
          <input
            type="date"
            defaultValue="2025-07-02"
            className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">Rooms & Guests</label>
          <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
            <option>1 Room, 2 Guests</option>
            <option>1 Room, 1 Guest</option>
            <option>2 Rooms, 4 Guests</option>
          </select>
        </div>
      </div>
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
        SEARCH HOTELS
      </button>
    </div>
  );

  const renderHomestaysBooking = () => (
    <div className="space-y-6">
      <div className="flex gap-8 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="homestayType"
            value="homestays"
            defaultChecked
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700 font-semibold">Homestays</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="homestayType"
            value="villas"
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">Villas</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-64">
          <label className="block text-sm text-gray-600 mb-1">Location</label>
          <input
            type="text"
            placeholder="Where do you want to stay?"
            className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="flex-1 min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Check-in</label>
          <input
            type="date"
            defaultValue="2025-07-01"
            className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="flex-1 min-w-32">
          <label className="block text-sm text-gray-600 mb-1">Check-out</label>
          <input
            type="date"
            defaultValue="2025-07-02"
            className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="flex-1 min-w-48">
          <label className="block text-sm text-gray-600 mb-1">Guests</label>
          <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
            <option>2 Guests</option>
            <option>1 Guest</option>
            <option>3 Guests</option>
            <option>4 Guests</option>
            <option>5+ Guests</option>
          </select>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">Property Type</div>
        <div className="flex flex-wrap gap-4">
          {['Entire Place', 'Private Room', 'Shared Room', 'Villa', 'Apartment', 'Cottage'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
        SEARCH HOMESTAYS & VILLAS
      </button>
    </div>
  );

  const renderPackagesBooking = () => {
    const [packageType, setPackageType] = useState('domestic');
    
    return (
      <div className="space-y-6">
        <div className="flex gap-8 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="packageType"
              value="domestic"
              checked={packageType === 'domestic'}
              onChange={(e) => setPackageType(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 font-semibold">Domestic Packages</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="packageType"
              value="international"
              checked={packageType === 'international'}
              onChange={(e) => setPackageType(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">International Packages</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>Chennai</option>
              <option>Kolkata</option>
            </select>
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
              {packageType === 'domestic' ? (
                <>
                  <option>Goa</option>
                  <option>Kerala</option>
                  <option>Rajasthan</option>
                  <option>Himachal Pradesh</option>
                  <option>Kashmir</option>
                  <option>Andaman</option>
                </>
              ) : (
                <>
                  <option>Thailand</option>
                  <option>Dubai</option>
                  <option>Singapore</option>
                  <option>Maldives</option>
                  <option>Europe</option>
                  <option>Bali</option>
                </>
              )}
            </select>
          </div>
          <div className="flex-1 min-w-32">
            <label className="block text-sm text-gray-600 mb-1">Departure</label>
            <input
              type="date"
              defaultValue="2025-07-01"
              className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
            />
          </div>
          <div className="flex-1 min-w-32">
            <label className="block text-sm text-gray-600 mb-1">Duration</label>
            <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
              <option>3 Days / 2 Nights</option>
              <option>4 Days / 3 Nights</option>
              <option>5 Days / 4 Nights</option>
              <option>7 Days / 6 Nights</option>
              <option>10 Days / 9 Nights</option>
              <option>15 Days / 14 Nights</option>
            </select>
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm text-gray-600 mb-1">Travelers</label>
            <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
              <option>2 Adults</option>
              <option>1 Adult</option>
              <option>2 Adults, 1 Child</option>
              <option>2 Adults, 2 Children</option>
              <option>4 Adults</option>
            </select>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium mb-3">Package Preferences</div>
          <div className="flex flex-wrap gap-4">
            {['Honeymoon', 'Family', 'Adventure', 'Beach', 'Hill Station', 'Cultural', 'Pilgrimage', 'Wildlife'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
          SEARCH PACKAGES
        </button>
      </div>
    );
  };

  const renderTrainsBooking = () => {
    const [trainJourneyType, setTrainJourneyType] = useState('oneWay');
    
    const trainStations = [
      { code: 'NDLS', name: 'New Delhi', state: 'Delhi' },
      { code: 'CSMT', name: 'Mumbai CST', state: 'Maharashtra' },
      { code: 'SBC', name: 'Bangalore City', state: 'Karnataka' },
      { code: 'MAS', name: 'Chennai Central', state: 'Tamil Nadu' },
      { code: 'HWH', name: 'Howrah', state: 'West Bengal' },
      { code: 'SC', name: 'Secunderabad', state: 'Telangana' },
      { code: 'ADI', name: 'Ahmedabad', state: 'Gujarat' },
      { code: 'PUNE', name: 'Pune', state: 'Maharashtra' },
      { code: 'JP', name: 'Jaipur', state: 'Rajasthan' },
      { code: 'LKO', name: 'Lucknow', state: 'Uttar Pradesh' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex gap-8 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trainJourneyType"
              value="oneWay"
              checked={trainJourneyType === 'oneWay'}
              onChange={(e) => setTrainJourneyType(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 font-semibold">One Way</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trainJourneyType"
              value="roundTrip"
              checked={trainJourneyType === 'roundTrip'}
              onChange={(e) => setTrainJourneyType(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">Round Trip</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-48">
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
              {trainStations.map(station => (
                <option key={station.code} value={station.code}>
                  {station.name} ({station.code}) - {station.state}
                </option>
              ))}
            </select>
          </div>
          
          <button className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full mt-6 transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <div className="flex-1 min-w-48">
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
              {trainStations.map(station => (
                <option key={station.code} value={station.code}>
                  {station.name} ({station.code}) - {station.state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-32">
            <label className="block text-sm text-gray-600 mb-1">Departure</label>
            <input
              type="date"
              defaultValue="2025-07-01"
              className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
            />
          </div>

          {trainJourneyType === 'roundTrip' && (
            <div className="flex-1 min-w-32">
              <label className="block text-sm text-gray-600 mb-1">Return</label>
              <input
                type="date"
                defaultValue="2025-07-02"
                className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none"
              />
            </div>
          )}

          <div className="flex-1 min-w-48">
            <label className="block text-sm text-gray-600 mb-1">Class</label>
            <select className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 focus:border-blue-400 outline-none">
              <option>All Classes</option>
              <option>AC First Class (1A)</option>
              <option>AC 2 Tier (2A)</option>
              <option>AC 3 Tier (3A)</option>
              <option>AC 3 Economy (3E)</option>
              <option>AC Chair Car (CC)</option>
              <option>Sleeper (SL)</option>
              <option>Second Sitting (2S)</option>
            </select>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium mb-3">Train Preferences</div>
          <div className="flex flex-wrap gap-4">
            {[
              'Flexible with Date',
              'Railway Pass Concession',
              'Person with Disability Concession',
              'Flexible with Train',
              'Premium Tatkal',
              'Book on Alternate Date'
            ].map(pref => (
              <label key={pref} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
          SEARCH TRAINS
        </button>
      </div>
    );
  };

interface GenericBookingProps {
    type: string;
}

interface NavTab {
    id: string;
    icon: string;
    label: string;
}

const renderGenericBooking = (type: GenericBookingProps['type']) => (
    <div className="space-y-6">
        <div className="text-center py-12">
            <div className="text-6xl mb-4">
                {type === 'buses' && '🚌'}
                {type === 'cabs' && '🚗'}
                {type === 'visa' && '📄'}
                {type === 'forex' && '💳'}
                {type === 'insurance' && '🛡️'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {navTabs.find((tab: NavTab) => tab.id === type)?.label} Booking
            </h2>
            <p className="text-gray-600">Coming Soon! Book your {type} with ease.</p>
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Notify Me
            </button>
        </div>
    </div>
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-4 rounded-xl min-w-24 transition-all transform hover:scale-105 ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <div className="text-2xl mb-2">{tab.icon}</div>
              <div className="text-xs text-center font-medium leading-tight">
                {tab.label}
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Book {navTabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            {activeTab === 'flights' && (
              <div className="flex items-center gap-2 text-blue-600">
                <Plane className="w-5 h-5" />
                <span className="text-sm">Book International and Domestic Flights</span>
              </div>
            )}
          </div>

          {/* Render appropriate booking form */}
          {activeTab === 'flights' && renderFlightBooking()}
          {activeTab === 'hotels' && renderHotelBooking()}
          {activeTab === 'homestays' && renderHomestaysBooking()}
          {activeTab === 'packages' && renderPackagesBooking()}
          {activeTab === 'trains' && renderTrainsBooking()}
          {!['flights', 'hotels', 'homestays', 'packages', 'trains'].includes(activeTab) && renderGenericBooking(activeTab)}
        </div>

        {/* Flight Tracker */}
        {activeTab === 'flights' && (
          <div className="mt-4 flex justify-end">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2 flex items-center gap-2 text-white">
              <Plane className="w-4 h-4" />
              <span className="text-sm">Flight Tracker</span>
              <span className="bg-red-500 text-xs px-2 py-1 rounded">NEW</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeMyTripClone;