import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import TabPopup from '../pages/Tabpopup'; // Adjust path if necessary
import RoomGuestSelector from './dropdown'; // Adjust path if necessary
import ValidatedDateInput from './validatedate'; // Adjust path if necessary
import airportsData from "../../../iata_airports.json"; // Adjust path based on your project structure
import destinationsData from '../destinations.json'; // Adjust path based on your project structure
import { Plane, Building2, Ship, Train, Bus, Car, CreditCard, HandCoins, Search, X, Users, Shield } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  type Airport = { city: string; airport: string; iata: string };
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);


  const [travelLocations, setTravelLocations] = useState({
    flightsFrom: "",
    flightsTo: "",
    hotelsDestination: "",
    cruiseFrom: "",
    cruiseTo: "",
    trainsFrom: "",
    trainsTo: "",
    busesFrom: "",
    busesTo: "",
    cabsFrom: "",
    cabsTo: "",
    visaDestination: "",
    insuranceDestination: "",
    currencyToBuy: "",
    amount: "",
  });

  const [liveSearchInput, setLiveSearchInput] = useState<{ key: string; value: string } | null>(null);
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);
  const [locationErrors, setLocationErrors] = useState<{[key: string]: string}>({});

  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [departureDate, setDepartureDate] = useState("");
  const [visaDate, setVisaDate] = useState('');

  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0); // Renamed 'children' to 'numChildren'
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');
  const [tripType, setTripType] = useState("oneWay");
  const [travelerError, setTravelerError] = useState('');

  const totalTravelers = adults + numChildren + infants; // Use numChildren here
  const [fareType, setFareType] = useState("Regular");
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelCheckOut, setHotelCheckOut] = useState('');
  const [hotelPriceRange, setHotelPriceRange] = useState('');
  
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);

  const [savedFormData, setSavedFormData] = useState<{[tab: string]: any}>({});


  const today = new Date();
  const yyyy = today.getFullYear();
  const maxyyyy = yyyy + 1;
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  const maxDate = `${maxyyyy}-12-31`;

  useEffect(() => {
    setAirports(airportsData);
  }, []);

  const validateLocation = (key: keyof typeof travelLocations, value: string, dataType: 'airport' | 'destination'): boolean => {
    let isValid = false;
    if (!value.trim()) {
      isValid = false;
    } else if (dataType === 'airport') {
      isValid = airports.some(airport => `${airport.city} - ${airport.airport} (${airport.iata})` === value);
    } else {
      isValid = destinationsData.some(dest => dest.name === value);
    }

    setLocationErrors(prev => ({
      ...prev,
      [key]: isValid ? "" : "Please select a valid location from the dropdown."
    }));
    return isValid;
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof travelLocations,
    dataType: 'airport' | 'destination'
  ) => {
    const value = e.target.value;

    setLiveSearchInput({ key, value });
    setLocationErrors(prev => ({ ...prev, [key]: "" }));

    if (travelLocations[key] && !travelLocations[key].toLowerCase().includes(value.toLowerCase())) {
      setTravelLocations(prev => ({ ...prev, [key]: "" }));
    }

    setActiveDropdownKey(key);

    if (dataType === 'airport') {
      const filtered = airports
        .filter(airport =>
          `${airport.city} ${airport.airport} (${airport.iata})`
            .toLowerCase()
            .includes(value.toLowerCase())
        )
        .slice(0, 10);
      setFilteredSuggestions(filtered);
    } else {
      const filtered = destinationsData
        .filter(dest => dest.name.toLowerCase().includes(value.toLowerCase()))
        .map(dest => ({
          city: dest.name,
          country: dest.code
        }))
        .slice(0, 10);
      setFilteredSuggestions(filtered);
    }
  };

  const handleSuggestionSelect = (
    selectedValue: string,
    key: keyof typeof travelLocations
  ) => {
    setTravelLocations(prev => ({ ...prev, [key]: selectedValue }));
    setLiveSearchInput(null);
    setFilteredSuggestions([]);
    setActiveDropdownKey(null);
    setLocationErrors(prev => ({ ...prev, [key]: "" }));
  };

  const handleInputBlur = (key: keyof typeof travelLocations, dataType: 'airport' | 'destination') => {
    if (activeDropdownKey === key) {
        setActiveDropdownKey(null);
    }
    validateLocation(key, travelLocations[key], dataType);
  };


  const swapLocations = () => {
    const fromVal = travelLocations.flightsFrom;
    const toVal = travelLocations.flightsTo;

    setTravelLocations(prev => ({
      ...prev,
      flightsFrom: toVal,
      flightsTo: fromVal,
    }));
    setLocationErrors(prev => ({
      ...prev,
      flightsFrom: "",
      flightsTo: ""
    }));
  };

  const validateTravelers = (
    adultCount: number,
    infantCount: number
  ): boolean => {
    if (infantCount > adultCount) {
      setTravelerError('Number of adults should be equal or greater than number of infants');
      return false;
    } else {
      setTravelerError('');
      return true;
    }
  };

  const incrementCounter = (type: 'adults' | 'children' | 'infants') => {
    switch (type) {
      case 'adults':
        const newAdults = adults + 1;
        setAdults(newAdults);
        validateTravelers(newAdults, infants);
        break;
      case 'children':
        setNumChildren(numChildren + 1); // Use numChildren
        break;
      case 'infants':
        const newInfants = infants + 1;
        setInfants(newInfants);
        validateTravelers(adults, newInfants);
        break;
    }
  };

  const decrementCounter = (type: 'adults' | 'children' | 'infants') => {
    switch (type) {
      case 'adults':
        const newAdults = Math.max(1, adults - 1);
        setAdults(newAdults);
        validateTravelers(newAdults, infants);
        break;
      case 'children':
        setNumChildren(Math.max(0, numChildren - 1)); // Use numChildren
        break;
      case 'infants':
        const newInfants = Math.max(0, infants - 1);
        setInfants(newInfants);
        validateTravelers(adults, newInfants);
        break;
    }
  };

  // Centralized validation function for the entire form submission
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: {[key: string]: string} = {};

    const invalidate = (key: string, message: string) => {
      newErrors[key] = message;
      isValid = false;
    };

    const isDateValid = (dateString: string, fieldName: string, min?: string, max?: string): boolean => {
        if (!dateString) {
            invalidate(fieldName, `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`);
            return false;
        }
        const selected = new Date(dateString);
        const todayNormalized = new Date();
        todayNormalized.setHours(0, 0, 0, 0);

        if (isNaN(selected.getTime())) {
            invalidate(fieldName, `Invalid date format for ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
            return false;
        }
        if (min && selected < new Date(min)) {
            invalidate(fieldName, `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} cannot be before ${min}.`);
            return false;
        }
        if (max && selected > new Date(max)) {
            invalidate(fieldName, `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} cannot be after ${max}.`);
            return false;
        }
        return true;
    };


    switch (activeTab) {
      case "Flights":
        if (!validateLocation('flightsFrom', travelLocations.flightsFrom, 'airport')) {
          invalidate('flightsFrom', "Please select a valid 'From' airport.");
        }
        if (!validateLocation('flightsTo', travelLocations.flightsTo, 'airport')) {
          invalidate('flightsTo', "Please select a valid 'To' airport.");
        }
        if (travelLocations.flightsFrom && travelLocations.flightsTo && travelLocations.flightsFrom === travelLocations.flightsTo) {
          invalidate('flightsTo', "'From' and 'To' airports cannot be the same.");
        }

        if (!isDateValid(departureDate, 'departureDate', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        if (tripType === "roundTrip") {
            if (!isDateValid(returnDate, 'returnDate', departureDate, maxDate)) {
                // Error already set by isDateValid
            }
        }
        if (travelerError) {
            invalidate('travelers', travelerError);
        }
        if (totalTravelers === 0) {
            invalidate('travelers', 'At least one traveler is required.');
        }
        break;

      case "Hotels":
        if (!validateLocation('hotelsDestination', travelLocations.hotelsDestination, 'destination')) {
          invalidate('hotelsDestination', "Please select a valid destination.");
        }
        if (!isDateValid(hotelCheckIn, 'hotelCheckIn', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        if (!isDateValid(hotelCheckOut, 'hotelCheckOut', hotelCheckIn || minDate, maxDate)) {
            // Error already set by isDateValid
        }
        break;

      case "Cruise":
        if (!validateLocation('cruiseFrom', travelLocations.cruiseFrom, 'destination')) {
          invalidate('cruiseFrom', "Please select a valid 'From' port.");
        }
        if (!validateLocation('cruiseTo', travelLocations.cruiseTo, 'destination')) {
          invalidate('cruiseTo', "Please select a valid 'To' port.");
        }
        if (travelLocations.cruiseFrom && travelLocations.cruiseTo && travelLocations.cruiseFrom === travelLocations.cruiseTo) {
          invalidate('cruiseTo', "'From' and 'To' ports cannot be the same.");
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        break;

      case "Trains":
        if (!validateLocation('trainsFrom', travelLocations.trainsFrom, 'destination')) {
          invalidate('trainsFrom', "Please select a valid 'From' station.");
        }
        if (!validateLocation('trainsTo', travelLocations.trainsTo, 'destination')) {
          invalidate('trainsTo', "Please select a valid 'To' station.");
        }
        if (travelLocations.trainsFrom && travelLocations.trainsTo && travelLocations.trainsFrom === travelLocations.trainsTo) {
          invalidate('trainsTo', "'From' and 'To' stations cannot be the same.");
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        break;

      case "Buses":
        if (!validateLocation('busesFrom', travelLocations.busesFrom, 'destination')) {
          invalidate('busesFrom', "Please select a valid 'Departure Bus Depo'.");
        }
        if (!validateLocation('busesTo', travelLocations.busesTo, 'destination')) {
          invalidate('busesTo', "Please select a valid 'Arrival Bus Depo'.");
        }
        if (travelLocations.busesFrom && travelLocations.busesTo && travelLocations.busesFrom === travelLocations.busesTo) {
          invalidate('busesTo', "'Departure' and 'Arrival' bus depos cannot be the same.");
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        break;

      case "Cabs":
        if (!validateLocation('cabsFrom', travelLocations.cabsFrom, 'destination')) {
          invalidate('cabsFrom', "Please select a valid 'Pickup Point'.");
        }
        if (!validateLocation('cabsTo', travelLocations.cabsTo, 'destination')) {
          invalidate('cabsTo', "Please select a valid 'Dropping Location'.");
        }
        if (travelLocations.cabsFrom && travelLocations.cabsTo && travelLocations.cabsFrom === travelLocations.cabsTo) {
          invalidate('cabsTo', "'Pickup' and 'Dropping' locations cannot be the same.");
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        break;

      case "Visa":
        if (!validateLocation('visaDestination', travelLocations.visaDestination, 'destination')) {
          invalidate('visaDestination', "Please select a valid 'Destination Country'.");
        }
        if (!isDateValid(visaDate, 'visaDate', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        if (!isDateValid(returnDate, 'returnDate', visaDate || minDate, maxDate)) {
            // Error already set by isDateValid
        }
        break;

      case "ForexCard":
        if (!travelLocations.currencyToBuy.trim()) {
          invalidate('currencyToBuy', 'Currency to Buy is required.');
        }
        if (!travelLocations.amount.trim() || isNaN(Number(travelLocations.amount))) {
          invalidate('amount', 'Valid amount is required.');
        }
        break;

      case "Insurance":
        if (!validateLocation('insuranceDestination', travelLocations.insuranceDestination, 'destination')) {
          invalidate('insuranceDestination', "Please select a valid 'Destination'.");
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) {
            // Error already set by isDateValid
        }
        break;

      default:
        isValid = false;
        break;
    }

    setLocationErrors(prev => ({...prev, ...newErrors}));
    return isValid;
  };

  useEffect(() => {
    const isFormReady = validateForm();
    setIsSearchButtonDisabled(!isFormReady);
  }, [activeTab, travelLocations, departureDate, returnDate, hotelCheckIn, hotelCheckOut, visaDate, travelerError, totalTravelers, travelDate, adults, numChildren, infants]); // Added numChildren to dependencies


  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabPopup activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
          <img
            src="src/make a move final logo M.png"
            alt="Travel 1"
            className="h-10 w-auto max-w-[120px] object-contain"
            style={{ maxWidth: "40vw" }}
          />
          <img
            src="src/make_a_move_final_logo_text[1].png"
            alt="Travel 2"
            className="h-10 w-auto max-w-[200px] object-contain"
            style={{ maxWidth: "60vw" }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { name: 'Flights', icon: Plane },
            { name: 'Hotels', icon: Building2 },
            { name: 'Cruise', icon: Ship },
            { name: 'Trains', icon: Train },
            { name: 'Buses', icon: Bus },
            { name: 'Cabs', icon: Car },
            { name: 'Visa', icon: CreditCard },
            { name: 'ForexCard', icon: HandCoins },
            { name: 'Insurance', icon: Shield },
          ].map(
            (tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-2 py-2 rounded-full font-medium transition-all ${activeTab === tab.name ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                <tab.icon />
              </button>
            )
          )}
        </div>

        {activeTab === "Flights" && (
          <div className="space-y-6">
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
                    required
                  />
                  <span className={`text-gray-700 ${option.value === "roundTrip" ? "font-semibold" : ""}`}>{option.label}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* From Location - Flights */}
              <div className="relative">
                <div className="relative flex-1 min-w-48">
                  <label className="block text-sm text-gray-600 mb-1">From</label>
                  <input
                    className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.flightsFrom ? 'border-red-500' : ''}`}
                    placeholder="From (City or Airport)"
                    value={travelLocations.flightsFrom || (liveSearchInput?.key === 'flightsFrom' ? liveSearchInput.value : "")}
                    onClick={() => {
                      setTravelLocations(prev => ({ ...prev, flightsFrom: "" }));
                      setLiveSearchInput({ key: 'flightsFrom', value: "" });
                      setActiveDropdownKey('flightsFrom');
                      setFilteredSuggestions(airports.slice(0, 10));
                    }}
                    onChange={(e) => handleLocationInputChange(e, 'flightsFrom', 'airport')}
                    onBlur={() => handleInputBlur('flightsFrom', 'airport')}
                    readOnly={!!travelLocations.flightsFrom}
                  />
                  {activeDropdownKey === 'flightsFrom' && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 bg-white border w-full max-h-72 overflow-auto shadow-lg rounded-lg mt-1">
                      <ul className="divide-y">
                        {filteredSuggestions.map((airport: Airport, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => handleSuggestionSelect(`${airport.city} - ${airport.airport} (${airport.iata})`, 'flightsFrom')}
                          >
                            <div className="font-medium text-sm">
                              {airport.city}, {airport.iata}
                            </div>
                            <div className="text-xs text-gray-600">
                              {airport.airport} ({airport.iata})
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {locationErrors.flightsFrom && <p className="text-red-500 text-xs mt-1">{locationErrors.flightsFrom}</p>}
                </div>
              </div>

              {/* Swap Button */}
              <button onClick={swapLocations} className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full mt-6">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              {/* To Location - Flights */}
              <div className="relative flex-1 min-w-48">
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <div className="relative">
                  <input
                    className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.flightsTo ? 'border-red-500' : ''}`}
                    placeholder="To (City or Airport)"
                    value={travelLocations.flightsTo || (liveSearchInput?.key === 'flightsTo' ? liveSearchInput.value : "")}
                    onClick={() => {
                      setTravelLocations(prev => ({ ...prev, flightsTo: "" }));
                      setLiveSearchInput({ key: 'flightsTo', value: "" });
                      setActiveDropdownKey('flightsTo');
                      setFilteredSuggestions(airports.slice(0, 10));
                    }}
                    onChange={(e) => handleLocationInputChange(e, 'flightsTo', 'airport')}
                    onBlur={() => handleInputBlur('flightsTo', 'airport')}
                    readOnly={!!travelLocations.flightsTo}
                  />
                  {activeDropdownKey === 'flightsTo' && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 bg-white border w-full max-h-72 overflow-auto shadow-lg rounded-lg mt-1">
                      <ul className="divide-y">
                        {filteredSuggestions.map((airport: Airport, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => handleSuggestionSelect(`${airport.city} - ${airport.airport} (${airport.iata})`, 'flightsTo')}
                          >
                            <div className="font-medium text-sm">
                              {airport.city}, {airport.iata}
                            </div>
                            <div className="text-xs text-gray-600">
                              {airport.airport} ({airport.iata})
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {locationErrors.flightsTo && <p className="text-red-500 text-xs mt-1">{locationErrors.flightsTo}</p>}
                </div>
              </div>

              {/* Departure Date */}
              <div className="flex-1 min-w-32">
                <ValidatedDateInput
                  label="Departure Date"
                  value={departureDate}
                  onChange={setDepartureDate}
                  min={minDate}
                  max={maxDate}
                />
              </div>

              {/* Return Date */}
              {tripType === "roundTrip" && (
                <div className="flex-1 min-w-32">
                  <ValidatedDateInput
                    label="Return Date"
                    value={returnDate}
                    onChange={setReturnDate}
                    min={departureDate}
                    max={maxDate}
                  />
                </div>
              )}

              {/* Travelers & Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <button
                      onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                    >
                      {totalTravelers} Traveler{totalTravelers !== 1 ? 's' : ''}, {travelClass}
                    </button>
                  </div>

                  {showTravelerDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-10 p-4 mt-1 min-w-[300px]">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Adult</div>
                            <div className="text-sm text-gray-500">12+ Years</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decrementCounter('adults')}
                              disabled={adults <= 1}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${adults <= 1
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
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Children</div>
                            <div className="text-sm text-gray-500">2-11 Years</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decrementCounter('children')}
                              disabled={numChildren <= 0} // Use numChildren here
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${numChildren <= 0 // Use numChildren here
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={numChildren} // Use numChildren here
                              onChange={(e) => {
                                const value = Math.max(0, parseInt(e.target.value) || 0);
                                setNumChildren(value); // Use setNumChildren
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

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Infant</div>
                            <div className="text-sm text-gray-500">Under 2 Years</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decrementCounter('infants')}
                              disabled={infants <= 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${infants <= 0
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
                        </div>

                        {travelerError && (
                          <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                            {travelerError}
                          </div>
                        )}

                        <div className="pt-4 border-t">
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
                        </div>

                        <button
                          onClick={() => setShowTravelerDropdown(false)}
                          disabled={!!travelerError}
                          className={`w-full py-2 px-4 rounded-lg transition-colors ${travelerError
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

            <div className="border border-gray-200 rounded-lg p-4">
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
            </div>

            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          flightsFrom: travelLocations.flightsFrom,
                          flightsTo: travelLocations.flightsTo,
                          departureDate,
                          returnDate: tripType === "roundTrip" ? returnDate : null,
                          adults,
                          numChildren, // Use numChildren here
                          infants,
                          travelClass,
                          tripType,
                          fareType
                      }
                  }));
                  console.log("Saved Flights Data:", savedFormData); // For demonstration
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              <Search className="w-5 h-5" /> SEARCH
            </button>
          </div>
        )}

        {activeTab === "Hotels" && (
          <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Search Hotels</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Destination - Hotels */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.hotelsDestination ? 'border-red-500' : ''}`}
                  placeholder="City or Property"
                  value={travelLocations.hotelsDestination || (liveSearchInput?.key === 'hotelsDestination' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, hotelsDestination: "" }));
                    setLiveSearchInput({ key: 'hotelsDestination', value: "" });
                    setActiveDropdownKey('hotelsDestination');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'hotelsDestination', 'destination')}
                  onBlur={() => handleInputBlur('hotelsDestination', 'destination')}
                  readOnly={!!travelLocations.hotelsDestination}
                />
                {activeDropdownKey === 'hotelsDestination' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'hotelsDestination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {locationErrors.hotelsDestination && <p className="text-red-500 text-xs mt-1">{locationErrors.hotelsDestination}</p>}
              </div>

              {/* Check-in / Check-out */}
              <div>
                <ValidatedDateInput
                  label="Check-in Date"
                  value={hotelCheckIn}
                  onChange={(date) => {
                    setHotelCheckIn(date);
                    if (hotelCheckOut && date >= hotelCheckOut) {
                      setHotelCheckOut('');
                    }
                  }}
                  min={minDate}
                  max={maxDate}
                />
              </div>
              <div>
                <ValidatedDateInput
                  label="Check-out Date"
                  value={hotelCheckOut}
                  onChange={setHotelCheckOut}
                  min={hotelCheckIn || minDate}
                  max={maxDate}
                />
              </div>
              <div className="relative">
                <RoomGuestSelector activeTab={'Hotels'} label="Rooms & Guests" onChange={(data) => console.log('Selected:', data)} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Price Range</label>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={500}
                  value={Number(hotelPriceRange)} // Ensure value is a number
                  onChange={(e) => setHotelPriceRange(e.target.value)}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹500</span>
                  <span>₹1500</span>
                  <span>₹2500</span>
                  <span>₹5000+</span>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-700">
                  Selected: {hotelPriceRange ? `₹${hotelPriceRange}+` : "Any"}
                </div>
              </div>
            </div>
            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          hotelsDestination: travelLocations.hotelsDestination,
                          hotelCheckIn,
                          hotelCheckOut,
                          hotelPriceRange
                      }
                  }));
                  console.log("Saved Hotels Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Search Hotels
            </button>
          </div>
        )}

        {activeTab === "Cruise" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">From Port</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.cruiseFrom ? 'border-red-500' : ''}`}
                placeholder="Boarding Port"
                value={travelLocations.cruiseFrom || (liveSearchInput?.key === 'cruiseFrom' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, cruiseFrom: "" }));
                  setLiveSearchInput({ key: 'cruiseFrom', value: "" });
                  setActiveDropdownKey('cruiseFrom');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'cruiseFrom', 'destination')}
                onBlur={() => handleInputBlur('cruiseFrom', 'destination')}
                readOnly={!!travelLocations.cruiseFrom}
              />
              {activeDropdownKey === 'cruiseFrom' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'cruiseFrom')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.cruiseFrom && <p className="text-red-500 text-xs mt-1">{locationErrors.cruiseFrom}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">To port</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.cruiseTo ? 'border-red-500' : ''}`}
                placeholder="Boarding Port"
                value={travelLocations.cruiseTo || (liveSearchInput?.key === 'cruiseTo' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, cruiseTo: "" }));
                  setLiveSearchInput({ key: 'cruiseTo', value: "" });
                  setActiveDropdownKey('cruiseTo');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'cruiseTo', 'destination')}
                onBlur={() => handleInputBlur('cruiseTo', 'destination')}
                readOnly={!!travelLocations.cruiseTo}
              />
              {activeDropdownKey === 'cruiseTo' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'cruiseTo')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.cruiseTo && <p className="text-red-500 text-xs mt-1">{locationErrors.cruiseTo}</p>}
            </div>
            <ValidatedDateInput
              label="Travel Date"
              value={travelDate}
              onChange={setTravelDate}
              min={minDate}
              max={maxDate}
            />
            <div className="relative">
              <RoomGuestSelector activeTab='Cruise' label="Passengers & Type of Cruise" onChange={(data) => console.log('Selected:', data)} />
            </div>
            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          cruiseFrom: travelLocations.cruiseFrom,
                          cruiseTo: travelLocations.cruiseTo,
                          travelDate
                      }
                  }));
                  console.log("Saved Cruise Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Search Cruise
            </button>
          </div>
        )}

        {activeTab === "Trains" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">From Station</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.trainsFrom ? 'border-red-500' : ''}`}
                placeholder="Boarding Station"
                value={travelLocations.trainsFrom || (liveSearchInput?.key === 'trainsFrom' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, trainsFrom: "" }));
                  setLiveSearchInput({ key: 'trainsFrom', value: "" });
                  setActiveDropdownKey('trainsFrom');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'trainsFrom', 'destination')}
                onBlur={() => handleInputBlur('trainsFrom', 'destination')}
                readOnly={!!travelLocations.trainsFrom}
              />
              {activeDropdownKey === 'trainsFrom' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'trainsFrom')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.trainsFrom && <p className="text-red-500 text-xs mt-1">{locationErrors.trainsFrom}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">To Station</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.trainsTo ? 'border-red-500' : ''}`}
                placeholder="Boarding Station"
                value={travelLocations.trainsTo || (liveSearchInput?.key === 'trainsTo' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, trainsTo: "" }));
                  setLiveSearchInput({ key: 'trainsTo', value: "" });
                  setActiveDropdownKey('trainsTo');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'trainsTo', 'destination')}
                onBlur={() => handleInputBlur('trainsTo', 'destination')}
                readOnly={!!travelLocations.trainsTo}
              />
              {activeDropdownKey === 'trainsTo' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'trainsTo')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.trainsTo && <p className="text-red-500 text-xs mt-1">{locationErrors.trainsTo}</p>}
            </div>
            <ValidatedDateInput
              label="Travel Date"
              value={travelDate}
              onChange={setTravelDate}
              min={minDate}
              max={maxDate}
            />
            <RoomGuestSelector activeTab='Trains' label='Passengers and Type of Coach' onChange={(data) => console.log('Selected:', data)} />
            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          trainsFrom: travelLocations.trainsFrom,
                          trainsTo: travelLocations.trainsTo,
                          travelDate
                      }
                  }));
                  console.log("Saved Trains Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Search Trains
            </button>
          </div>
        )}

        {activeTab === "Buses" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Departure Bus Depo</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.busesFrom ? 'border-red-500' : ''}`}
                placeholder="Boarding Bus Depo"
                value={travelLocations.busesFrom || (liveSearchInput?.key === 'busesFrom' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, busesFrom: "" }));
                  setLiveSearchInput({ key: 'busesFrom', value: "" });
                  setActiveDropdownKey('busesFrom');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'busesFrom', 'destination')}
                onBlur={() => handleInputBlur('busesFrom', 'destination')}
                readOnly={!!travelLocations.busesFrom}
              />
              {activeDropdownKey === 'busesFrom' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'busesFrom')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.busesFrom && <p className="text-red-500 text-xs mt-1">{locationErrors.busesFrom}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Arrival Bus Depo</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.busesTo ? 'border-red-500' : ''}`}
                placeholder="Arrival Bus Depo"
                value={travelLocations.busesTo || (liveSearchInput?.key === 'busesTo' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, busesTo: "" }));
                  setLiveSearchInput({ key: 'busesTo', value: "" });
                  setActiveDropdownKey('busesTo');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'busesTo', 'destination')}
                onBlur={() => handleInputBlur('busesTo', 'destination')}
                readOnly={!!travelLocations.busesTo}
              />
              {activeDropdownKey === 'busesTo' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'busesTo')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.busesTo && <p className="text-red-500 text-xs mt-1">{locationErrors.busesTo}</p>}
            </div>
            <ValidatedDateInput
              label="Travel Date"
              value={travelDate}
              onChange={setTravelDate}
              min={minDate}
              max={maxDate}
            />
            <RoomGuestSelector activeTab='Buses' label='Passengers and Type of Bus' onChange={(data) => console.log('Selected:', data)} />
            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          busesFrom: travelLocations.busesFrom,
                          busesTo: travelLocations.busesTo,
                          travelDate
                      }
                  }));
                  console.log("Saved Buses Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Search Buses
            </button>
          </div>
        )}

        {activeTab === "Cabs" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Pickup Point</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.cabsFrom ? 'border-red-500' : ''}`}
                placeholder="Pickup Location"
                value={travelLocations.cabsFrom || (liveSearchInput?.key === 'cabsFrom' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, cabsFrom: "" }));
                  setLiveSearchInput({ key: 'cabsFrom', value: "" });
                  setActiveDropdownKey('cabsFrom');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'cabsFrom', 'destination')}
                onBlur={() => handleInputBlur('cabsFrom', 'destination')}
                readOnly={!!travelLocations.cabsFrom}
              />
              {activeDropdownKey === 'cabsFrom' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'cabsFrom')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.cabsFrom && <p className="text-red-500 text-xs mt-1">{locationErrors.cabsFrom}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Dropping Location</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.cabsTo ? 'border-red-500' : ''}`}
                placeholder="Dropping Location"
                value={travelLocations.cabsTo || (liveSearchInput?.key === 'cabsTo' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, cabsTo: "" }));
                  setLiveSearchInput({ key: 'cabsTo', value: "" });
                  setActiveDropdownKey('cabsTo');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'cabsTo', 'destination')}
                onBlur={() => handleInputBlur('cabsTo', 'destination')}
                readOnly={!!travelLocations.cabsTo}
              />
              {activeDropdownKey === 'cabsTo' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'cabsTo')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.cabsTo && <p className="text-red-500 text-xs mt-1">{locationErrors.cabsTo}</p>}
            </div>
            <ValidatedDateInput
              label="Travel Date"
              value={travelDate}
              onChange={setTravelDate}
              min={minDate}
              max={maxDate}
            />
            <RoomGuestSelector activeTab='Cabs' label='Passengers and Type of Cab' onChange={(data) => console.log('Selected:', data)} />
            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          cabsFrom: travelLocations.cabsFrom,
                          cabsTo: travelLocations.cabsTo,
                          travelDate
                      }
                  }));
                  console.log("Saved Cabs Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Search Cabs
            </button>
          </div>
        )}

        {activeTab === "Visa" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Select Destination</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.visaDestination ? 'border-red-500' : ''}`}
                placeholder="Destination Country"
                value={travelLocations.visaDestination || (liveSearchInput?.key === 'visaDestination' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, visaDestination: "" }));
                  setLiveSearchInput({ key: 'visaDestination', value: "" });
                  setActiveDropdownKey('visaDestination');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'visaDestination', 'destination')}
                onBlur={() => handleInputBlur('visaDestination', 'destination')}
                readOnly={!!travelLocations.visaDestination}
              />
              {activeDropdownKey === 'visaDestination' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'visaDestination')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.visaDestination && <p className="text-red-500 text-xs mt-1">{locationErrors.visaDestination}</p>}
            </div>
            <div className="relative">
              <ValidatedDateInput
                label="Visa Date"
                value={visaDate}
                onChange={setVisaDate}
                min={minDate}
                max={maxDate}
              />
            </div>
            <div className="relative">
              <ValidatedDateInput
                label="Return Date"
                value={returnDate}
                onChange={setReturnDate}
                min={visaDate || minDate}
                max={maxDate}
              />
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">Visa Type</label>
              <select className="border p-3 rounded w-full">
                <option disabled >Visa Type</option>
                <option>Tourist Visa</option>
                <option>Business Visa</option>
                <option>Student Visa</option>
                <option>Transit Visa</option>
                <option>Work Visa</option>
                <option>Family Visa</option>
                <option>Medical Visa</option>

              </select>
            </div>
            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          visaDestination: travelLocations.visaDestination,
                          visaDate,
                          returnDate
                      }
                  }));
                  console.log("Saved Visa Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Apply for Visa
            </button>
          </div>
        )}

        {activeTab === "ForexCard" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Currency to Buy</label>
              <input
                  className={`border p-3 rounded w-full ${locationErrors.currencyToBuy ? 'border-red-500' : ''}`}
                  placeholder="e.g., USD"
                  value={travelLocations.currencyToBuy}
                  onChange={(e) => {
                      setTravelLocations(prev => ({ ...prev, currencyToBuy: e.target.value }));
                      setLocationErrors(prev => ({ ...prev, currencyToBuy: '' }));
                  }}
                  onBlur={() => validateForm()}
              />
              {locationErrors.currencyToBuy && <p className="text-red-500 text-xs mt-1">{locationErrors.currencyToBuy}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Amount</label>
              <input
                  type="number"
                  className={`border p-3 rounded w-full ${locationErrors.amount ? 'border-red-500' : ''}`}
                  placeholder="Enter amount"
                  value={travelLocations.amount}
                  onChange={(e) => {
                      setTravelLocations(prev => ({ ...prev, amount: e.target.value }));
                      setLocationErrors(prev => ({ ...prev, amount: '' }));
                  }}
                  onBlur={() => validateForm()}
              />
              {locationErrors.amount && <p className="text-red-500 text-xs mt-1">{locationErrors.amount}</p>}
            </div>
            <button id='search' className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          currencyToBuy: travelLocations.currencyToBuy,
                          amount: travelLocations.amount
                      }
                  }));
                  console.log("Saved ForexCard Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Apply for Forex
            </button>
          </div>
        )}

        {activeTab === "Insurance" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1"> Destination</label>
              <input
                type="text"
                className={`border p-3 rounded w-full cursor-pointer bg-white ${locationErrors.insuranceDestination ? 'border-red-500' : ''}`}
                placeholder="Destination (City or Country)"
                value={travelLocations.insuranceDestination || (liveSearchInput?.key === 'insuranceDestination' ? liveSearchInput.value : "")}
                onClick={() => {
                  setTravelLocations(prev => ({ ...prev, insuranceDestination: "" }));
                  setLiveSearchInput({ key: 'insuranceDestination', value: "" });
                  setActiveDropdownKey('insuranceDestination');
                  setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                }}
                onChange={(e) => handleLocationInputChange(e, 'insuranceDestination', 'destination')}
                onBlur={() => handleInputBlur('insuranceDestination', 'destination')}
                readOnly={!!travelLocations.insuranceDestination}
              />
              {activeDropdownKey === 'insuranceDestination' && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(dest.city, 'insuranceDestination')}
                    >
                      {dest.city}, {dest.country}
                    </li>
                  ))}
                </ul>
              )}
              {locationErrors.insuranceDestination && <p className="text-red-500 text-xs mt-1">{locationErrors.insuranceDestination}</p>}
            </div>
            <div className='relative'>
              <ValidatedDateInput
                label="Travel Date"
                value={travelDate}
                onChange={setTravelDate}
                min={minDate}
                max={maxDate}
              />
            </div>
            <button id='search'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
              onClick={() => {
                if (!validateForm()) {
                  alert("Please fix the errors in the form.");
                } else {
                  setSavedFormData(prev => ({
                      ...prev,
                      [activeTab!]: {
                          insuranceDestination: travelLocations.insuranceDestination,
                          travelDate
                      }
                  }));
                  console.log("Saved Insurance Data:", savedFormData);
                  setActiveTab(null);
                }
              }}
              disabled={isSearchButtonDisabled}
            >
              Apply for Insurance
            </button>
          </div>
        )}

      </TabPopup>
      <Footer />
    </div>
  );
};

export default MainLayout;