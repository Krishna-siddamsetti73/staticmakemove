import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import { PackageProvider } from './context/PackageContext';
import '././firebase/firebase';
import UserProfile from './pages/profilepage';
import MyBookings from './pages/Mybookings';
import SalesPage from './pages/salesPage';
import EditablePackage from './pages/editpackage';
import AddPackage from './addpackage';
import Home from './pages/duplicatetrail';
import TabPopup from './pages/Tabpopup';
import RoomGuestSelector from './components/dropdown';
import ValidatedDateInput from './components/validatedate'; // Assuming you've updated this component to accept 'error' prop

import airportsData from "../../iata_airports.json";
import destinationsData from './destinations.json';
import countriesData from '../src/components/countryandflags.json';
import ChatBot from "../src/components/chatbot";

import { Plane, Building2, Ship, Train, Bus, Car, CreditCard, HandCoins, Search, X, Users, Shield } from 'lucide-react';


type CountryCurrency = {
  name: string;
  dial_code: string;
  flag: string;
  currency_name: string;
  currency_symbol: string;
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<string | null>("Flights");

  type Airport = { city: string; airport: string; iata: string };
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);

  const [countryCurrencies, setCountryCurrencies] = useState<CountryCurrency[]>([]);
  const [filteredCurrencySuggestions, setFilteredCurrencySuggestions] = useState<CountryCurrency[]>([]);
  const [currencySearchInput, setCurrencySearchInput] = useState<string>("");
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

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

  // NEW: State to track which fields have been touched
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  // NEW: State to track if form submission was attempted
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('');

  const [visaDate, setVisaDate] = useState('');

  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');
  const [tripType, setTripType] = useState("oneWay");
  const [travelerError, setTravelerError] = useState('');

  const totalTravelers = adults + numChildren + infants;
  const [fareType, setFareType] = useState("Regular");
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelCheckOut, setHotelCheckOut] = useState('');
  const [hotelPriceRange, setHotelPriceRange] = useState('');

  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);

  const [savedFormData, setSavedFormData] = useState<{[tab: string]: any}>({});

  const [showInactive, setShowInactive] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();


  const today = new Date();
  const yyyy = today.getFullYear();
  const maxyyyy = yyyy + 1;
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  const maxDate = `${maxyyyy}-12-31`;

  useEffect(() => {
    setAirports(airportsData);
    setCountryCurrencies(countriesData as CountryCurrency[]);
  }, []);

  useEffect(() => {
    setActiveTab(null);
    // NEW: Reset touched state and submit attempted state when route changes
    setTouchedFields({});
    setIsSubmitAttempted(false);
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab !== "ForexCard") {
      setTravelLocations(prev => ({ ...prev, currencyToBuy: "", amount: "" }));
      setLocationErrors(prev => ({ ...prev, currencyToBuy: "", amount: "" }));
      setCurrencySearchInput("");
      setFilteredCurrencySuggestions([]);
      // NEW: Reset touched for ForexCard fields if tab changes away
      setTouchedFields(prev => {
        const newTouched = { ...prev };
        delete newTouched.currencyToBuy;
        delete newTouched.amount;
        return newTouched;
      });
    }
     // NEW: When activeTab changes, reset touched fields related to previous tab's inputs
     setTouchedFields({});
     setIsSubmitAttempted(false);

  }, [activeTab]);

const headerconp= [
              { name: 'Flights', icon: Plane },
              { name: 'Hotels', icon: Building2 },
              { name: 'Cruise', icon: Ship },
              { name: 'Trains', icon: Train },
              { name: 'Buses', icon: Bus },
              { name: 'Cabs', icon: Car },
              { name: 'Visa', icon: CreditCard },
              { name: 'ForexCard', icon: HandCoins },
              { name: 'Insurance', icon: Shield },
            ]
  const validateLocation = (key: keyof typeof travelLocations, value: string, dataType: 'airport' | 'destination'): boolean => {
    let isValid = true; // Start assuming valid for this field
    let errorMessage = "";

    if (!value.trim()) {
      errorMessage = `Please select a valid ${dataType === 'airport' ? 'airport' : 'location'} from the dropdown.`;
      isValid = false;
    } else if (dataType === 'airport') {
      isValid = airports.some(airport => `${airport.city} - ${airport.airport} (${airport.iata})` === value);
      if (!isValid) {
        errorMessage = "Please select a valid airport from the dropdown.";
      }
    } else { // dataType === 'destination'
      isValid = destinationsData.some(dest => dest.name === value);
      if (!isValid) {
        errorMessage = "Please select a valid location from the dropdown.";
      }
    }

    // Specific check for same origin/destination for Flights, Cruise, Trains, Buses, Cabs
    if (isValid) { // Only perform this check if the individual field itself is valid
        if (key === 'flightsTo' && travelLocations.flightsFrom && travelLocations.flightsFrom === value) {
            errorMessage = "'From' and 'To' airports cannot be the same.";
            isValid = false;
        } else if (key === 'flightsFrom' && travelLocations.flightsTo && travelLocations.flightsTo === value) { // Check 'flightsFrom' against 'flightsTo'
            errorMessage = "'From' and 'To' airports cannot be the same.";
            isValid = false;
        }
        else if (key === 'cruiseTo' && travelLocations.cruiseFrom && travelLocations.cruiseFrom === value) {
            errorMessage = "'From' and 'To' ports cannot be the same.";
            isValid = false;
        } else if (key === 'cruiseFrom' && travelLocations.cruiseTo && travelLocations.cruiseTo === value) {
            errorMessage = "'From' and 'To' ports cannot be the same.";
            isValid = false;
        }
        else if (key === 'trainsTo' && travelLocations.trainsFrom && travelLocations.trainsFrom === value) {
            errorMessage = "'From' and 'To' stations cannot be the same.";
            isValid = false;
        } else if (key === 'trainsFrom' && travelLocations.trainsTo && travelLocations.trainsTo === value) {
            errorMessage = "'From' and 'To' stations cannot be the same.";
            isValid = false;
        }
        else if (key === 'busesTo' && travelLocations.busesFrom && travelLocations.busesFrom === value) {
            errorMessage = "'Departure' and 'Arrival' bus depos cannot be the same.";
            isValid = false;
        } else if (key === 'busesFrom' && travelLocations.busesTo && travelLocations.busesTo === value) {
            errorMessage = "'Departure' and 'Arrival' bus depos cannot be the same.";
            isValid = false;
        }
        else if (key === 'cabsTo' && travelLocations.cabsFrom && travelLocations.cabsFrom === value) {
            errorMessage = "'Pickup' and 'Dropping' locations cannot be the same.";
            isValid = false;
        } else if (key === 'cabsFrom' && travelLocations.cabsTo && travelLocations.cabsTo === value) {
            errorMessage = "'Pickup' and 'Dropping' locations cannot be the same.";
            isValid = false;
        }
    }

    setLocationErrors(prev => ({
      ...prev,
      [key]: errorMessage
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
    setLocationErrors(prev => ({ ...prev, [key]: "" })); // Clear error as user types
    setTouchedFields(prev => ({ ...prev, [key]: true })); // Mark as touched

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
    key: keyof typeof travelLocations,
    dataType: 'airport' | 'destination'
  ) => {
    setTravelLocations(prev => ({ ...prev, [key]: selectedValue }));
    setLiveSearchInput(null);
    setFilteredSuggestions([]);
    setActiveDropdownKey(null);
    setTouchedFields(prev => ({ ...prev, [key]: true })); // Mark as touched on select

    validateLocation(key, selectedValue, dataType);
    // Also validate the counterpart if it exists (e.g., flightsTo when flightsFrom is selected)
    if (key === 'flightsFrom' && travelLocations.flightsTo) {
        validateLocation('flightsTo', travelLocations.flightsTo, 'airport');
    } else if (key === 'flightsTo' && travelLocations.flightsFrom) {
        validateLocation('flightsFrom', travelLocations.flightsFrom, 'airport');
    }
    else if (key === 'cruiseFrom' && travelLocations.cruiseTo) {
        validateLocation('cruiseTo', travelLocations.cruiseTo, 'destination');
    } else if (key === 'cruiseTo' && travelLocations.cruiseFrom) {
        validateLocation('cruiseFrom', travelLocations.cruiseFrom, 'destination');
    }
    else if (key === 'trainsFrom' && travelLocations.trainsTo) {
        validateLocation('trainsTo', travelLocations.trainsTo, 'destination');
    } else if (key === 'trainsTo' && travelLocations.trainsFrom) {
        validateLocation('trainsFrom', travelLocations.trainsFrom, 'destination');
    }
    else if (key === 'busesFrom' && travelLocations.busesTo) {
        validateLocation('busesTo', travelLocations.busesTo, 'destination');
    } else if (key === 'busesTo' && travelLocations.busesFrom) {
        validateLocation('busesFrom', travelLocations.busesFrom, 'destination');
    }
    else if (key === 'cabsFrom' && travelLocations.cabsTo) {
        validateLocation('cabsTo', travelLocations.cabsTo, 'destination');
    } else if (key === 'cabsTo' && travelLocations.cabsFrom) {
        validateLocation('cabsFrom', travelLocations.cabsFrom, 'destination');
    }
  };

  const handleInputBlur = (key: keyof typeof travelLocations, dataType: 'airport' | 'destination') => {
    if (activeDropdownKey === key) {
        setActiveDropdownKey(null);
    }
    setTouchedFields(prev => ({ ...prev, [key]: true })); // Mark as touched on blur
    validateLocation(key, travelLocations[key], dataType);
    // Also validate the counterpart if it exists
    if (key === 'flightsFrom' && travelLocations.flightsTo) {
        validateLocation('flightsTo', travelLocations.flightsTo, 'airport');
    } else if (key === 'flightsTo' && travelLocations.flightsFrom) {
        validateLocation('flightsFrom', travelLocations.flightsFrom, 'airport');
    }
    else if (key === 'cruiseFrom' && travelLocations.cruiseTo) {
        validateLocation('cruiseTo', travelLocations.cruiseTo, 'destination');
    } else if (key === 'cruiseTo' && travelLocations.cruiseFrom) {
        validateLocation('cruiseFrom', travelLocations.cruiseFrom, 'destination');
    }
    else if (key === 'trainsFrom' && travelLocations.trainsTo) {
        validateLocation('trainsTo', travelLocations.trainsTo, 'destination');
    } else if (key === 'trainsTo' && travelLocations.trainsFrom) {
        validateLocation('trainsFrom', travelLocations.trainsFrom, 'destination');
    }
    else if (key === 'busesFrom' && travelLocations.busesTo) {
        validateLocation('busesTo', travelLocations.busesTo, 'destination');
    } else if (key === 'busesTo' && travelLocations.busesFrom) {
        validateLocation('busesFrom', travelLocations.busesFrom, 'destination');
    }
    else if (key === 'cabsFrom' && travelLocations.cabsTo) {
        validateLocation('cabsTo', travelLocations.cabsTo, 'destination');
    } else if (key === 'cabsTo' && travelLocations.cabsFrom) {
        validateLocation('cabsFrom', travelLocations.cabsFrom, 'destination');
    }
  };


  const swapLocations = () => {
    const fromVal = travelLocations.flightsFrom;
    const toVal = travelLocations.flightsTo;

    setTravelLocations(prev => ({
      ...prev,
      flightsFrom: toVal,
      flightsTo: fromVal,
    }));
    // Mark both fields as touched immediately after swap
    setTouchedFields(prev => ({ ...prev, flightsFrom: true, flightsTo: true }));
    // Re-validate after swap
    validateLocation('flightsFrom', toVal, 'airport');
    validateLocation('flightsTo', fromVal, 'airport');
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
    // Mark travelers field as touched when modifying counts
    setTouchedFields(prev => ({ ...prev, travelers: true }));
    switch (type) {
      case 'adults':
        const newAdults = adults + 1;
        setAdults(newAdults);
        validateTravelers(newAdults, infants);
        break;
      case 'children':
        setNumChildren(numChildren + 1);
        break;
      case 'infants':
        const newInfants = infants + 1;
        setInfants(newInfants);
        validateTravelers(adults, newInfants);
        break;
    }
  };

  const decrementCounter = (type: 'adults' | 'children' | 'infants') => {
    // Mark travelers field as touched when modifying counts
    setTouchedFields(prev => ({ ...prev, travelers: true }));
    switch (type) {
      case 'adults':
        const newAdults = Math.max(1, adults - 1);
        setAdults(newAdults);
        validateTravelers(newAdults, infants);
        break;
      case 'children':
        setNumChildren(Math.max(0, numChildren - 1));
        break;
      case 'infants':
        const newInfants = Math.max(0, infants - 1);
        setInfants(newInfants);
        validateTravelers(adults, newInfants);
        break;
    }
  };

  const validateForm = (): boolean => {
    let currentFormErrors: {[key: string]: string} = {};
    let overallValid = true;

    const invalidate = (key: string, message: string) => {
      currentFormErrors[key] = message;
      overallValid = false;
    };

    const isDateValid = (dateString: string, fieldName: string, min?: string, max?: string): boolean => {
        let dateIsValid = true;
        if (!dateString) {
            invalidate(fieldName, `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`);
            dateIsValid = false;
        } else {
            const selected = new Date(dateString);
            const todayNormalized = new Date();
            todayNormalized.setHours(0, 0, 0, 0);

            if (isNaN(selected.getTime())) {
                invalidate(fieldName, `Invalid date format for ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                dateIsValid = false;
            }
            if (min && selected < new Date(min)) {
                invalidate(fieldName, `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} cannot be before ${min}.`);
                dateIsValid = false;
            }
            if (max && selected > new Date(max)) {
                invalidate(fieldName, `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} cannot be after ${max}.`);
                dateIsValid = false;
            }
        }
        return dateIsValid;
    };


    switch (activeTab) {
      case "Flights":
        if (!validateLocation('flightsFrom', travelLocations.flightsFrom, 'airport')) { overallValid = false; }
        if (!validateLocation('flightsTo', travelLocations.flightsTo, 'airport')) { overallValid = false; }
        if (travelLocations.flightsFrom && travelLocations.flightsTo && travelLocations.flightsFrom === travelLocations.flightsTo) {
          invalidate('flightsTo', "'From' and 'To' airports cannot be the same.");
          invalidate('flightsFrom', "'From' and 'To' airports cannot be the same.");
          overallValid = false;
        }

        if (!isDateValid(departureDate, 'departureDate', minDate, maxDate)) { overallValid = false; }
        if (tripType === "roundTrip") {
            if (!isDateValid(returnDate, 'returnDate', departureDate || minDate, maxDate)) { overallValid = false; }
        }
        if (travelerError) { // This error is managed by validateTravelers, so just propagate
            invalidate('travelers', travelerError);
            overallValid = false;
        }
        if (totalTravelers === 0) {
            invalidate('travelers', 'At least one traveler is required.');
            overallValid = false;
        }
        break;

      case "Hotels":
        if (!validateLocation('hotelsDestination', travelLocations.hotelsDestination, 'destination')) { overallValid = false; }
        if (!isDateValid(hotelCheckIn, 'hotelCheckIn', minDate, maxDate)) { overallValid = false; }
        if (!isDateValid(hotelCheckOut, 'hotelCheckOut', hotelCheckIn || minDate, maxDate)) { overallValid = false; }
        break;

      case "Cruise":
        if (!validateLocation('cruiseFrom', travelLocations.cruiseFrom, 'destination')) { overallValid = false; }
        if (!validateLocation('cruiseTo', travelLocations.cruiseTo, 'destination')) { overallValid = false; }
        if (travelLocations.cruiseFrom && travelLocations.cruiseTo && travelLocations.cruiseFrom === travelLocations.cruiseTo) {
          invalidate('cruiseTo', "'From' and 'To' ports cannot be the same.");
          invalidate('cruiseFrom', "'From' and 'To' ports cannot be the same.");
          overallValid = false;
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) { overallValid = false; }
        break;

      case "Trains":
        if (!validateLocation('trainsFrom', travelLocations.trainsFrom, 'destination')) { overallValid = false; }
        if (!validateLocation('trainsTo', travelLocations.trainsTo, 'destination')) { overallValid = false; }
        if (travelLocations.trainsFrom && travelLocations.trainsTo && travelLocations.trainsFrom === travelLocations.trainsTo) {
          invalidate('trainsTo', "'From' and 'To' stations cannot be the same.");
          invalidate('trainsFrom', "'From' and 'To' stations cannot be the same.");
          overallValid = false;
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) { overallValid = false; }
        break;

      case "Buses":
        if (!validateLocation('busesFrom', travelLocations.busesFrom, 'destination')) { overallValid = false; }
        if (!validateLocation('busesTo', travelLocations.busesTo, 'destination')) { overallValid = false; }
        if (travelLocations.busesFrom && travelLocations.busesTo && travelLocations.busesFrom === travelLocations.busesTo) {
          invalidate('busesTo', "'Departure' and 'Arrival' bus depos cannot be the same.");
          invalidate('busesFrom', "'Departure' and 'Arrival' bus depos cannot be the same.");
          overallValid = false;
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) { overallValid = false; }
        break;

      case "Cabs":
        if (!validateLocation('cabsFrom', travelLocations.cabsFrom, 'destination')) { overallValid = false; }
        if (!validateLocation('cabsTo', travelLocations.cabsTo, 'destination')) { overallValid = false; }
        if (travelLocations.cabsFrom && travelLocations.cabsTo && travelLocations.cabsFrom === travelLocations.cabsTo) {
          invalidate('cabsTo', "'Pickup' and 'Dropping' locations cannot be the same.");
          invalidate('cabsFrom', "'Pickup' and 'Dropping' locations cannot be the same.");
          overallValid = false;
        }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) { overallValid = false; }
        break;

      case "Visa":
        if (!validateLocation('visaDestination', travelLocations.visaDestination, 'destination')) { overallValid = false; }
        if (!isDateValid(visaDate, 'visaDate', minDate, maxDate)) { overallValid = false; }
        if (!isDateValid(returnDate, 'returnDate', visaDate || minDate, maxDate)) { overallValid = false; }
        break;

      case "ForexCard":
        if (!travelLocations.currencyToBuy.trim()) {
          invalidate('currencyToBuy', 'Currency to Buy is required.');
          overallValid = false;
        } else {
            const isCurrencySelectedValid = countryCurrencies.some(c =>
                `${c.currency_name} (${c.currency_symbol})` === travelLocations.currencyToBuy
            );
            if (!isCurrencySelectedValid) {
                invalidate('currencyToBuy', "Please select a valid currency from the dropdown.");
                overallValid = false;
            }
        }
        const amountNum = Number(travelLocations.amount);
        if (!travelLocations.amount.trim() || isNaN(amountNum) || amountNum <= 0) {
          invalidate('amount', 'Valid positive amount is required.');
          overallValid = false;
        }
        break;

      case "Insurance":
        if (!validateLocation('insuranceDestination', travelLocations.insuranceDestination, 'destination')) { overallValid = false; }
        if (!isDateValid(travelDate, 'travelDate', minDate, maxDate)) { overallValid = false; }
        break;

      default:
        overallValid = false; // If no tab is active, or unknown tab, form is not valid
        break;
    }

    // Update the locationErrors state with all found errors
    setLocationErrors(currentFormErrors);

    // Return the overall validity of the form
    return overallValid;
  };

  useEffect(() => {
    // This useEffect will run validation whenever relevant state changes.
    // However, errors will only be SHOWN if fields are touched or submit attempted.
    const formIsValid = validateForm();
    // The button should be disabled if the form is NOT valid (regardless of touched state)
    setIsSearchButtonDisabled(!formIsValid);
  }, [
    activeTab,
    travelLocations.flightsFrom, travelLocations.flightsTo,
    travelLocations.hotelsDestination,
    travelLocations.cruiseFrom, travelLocations.cruiseTo,
    travelLocations.trainsFrom, travelLocations.trainsTo,
    travelLocations.busesFrom, travelLocations.busesTo,
    travelLocations.cabsFrom, travelLocations.cabsTo,
    travelLocations.visaDestination,
    travelLocations.insuranceDestination,
    travelLocations.currencyToBuy, travelLocations.amount,
    departureDate, returnDate, hotelCheckIn, hotelCheckOut, visaDate,
    travelerError, adults, numChildren, infants // No need for totalTravelers explicitly if its components are here
  ]);

  // Handler for currency search input
  const handleCurrencySearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrencySearchInput(value);
    setTravelLocations(prev => ({ ...prev, currencyToBuy: "" }));
    setLocationErrors(prev => ({ ...prev, currencyToBuy: "" }));
    setTouchedFields(prev => ({ ...prev, currencyToBuy: true })); // Mark as touched

    if (value.trim() === "") {
      setFilteredCurrencySuggestions(countryCurrencies.slice(0, 5));
    } else {
      const filtered = countryCurrencies.filter(c =>
        c.currency_name.toLowerCase().includes(value.toLowerCase()) ||
        c.currency_symbol.toLowerCase().includes(value.toLowerCase()) ||
        c.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredCurrencySuggestions(filtered);
    }
  };

  // Handler for currency selection from dropdown
  const handleCurrencySelect = (currency: CountryCurrency) => {
    const selectedCurrencyString = `${currency.currency_name} (${currency.currency_symbol})`;
    setTravelLocations(prev => ({
      ...prev,
      currencyToBuy: selectedCurrencyString
    }));
    setCurrencySearchInput(selectedCurrencyString);
    setFilteredCurrencySuggestions([]);
    setLocationErrors(prev => ({ ...prev, currencyToBuy: "" }));
    setTouchedFields(prev => ({ ...prev, currencyToBuy: true })); // Mark as touched

    // Re-validate the amount field if it has a value, to show error if invalid
    if (travelLocations.amount) {
        // You might want to call a specific validation for amount here or just let the main useEffect trigger it
        validateForm(); // This will re-run full validation
    }
  };

  const getSelectedCurrencySymbol = (): string => {
    const selectedCurrencyString = travelLocations.currencyToBuy;
    if (selectedCurrencyString) {
      const match = selectedCurrencyString.match(/\((.*?)\)/);
      return match ? match[1] : '';
    }
    return '';
  };


  // Function to determine if an error should be shown for a field
  const shouldShowError = (fieldName: string) => {
      return (touchedFields[fieldName] || isSubmitAttempted) && locationErrors[fieldName];
  };

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab && (
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
            {headerconp.map(
              (tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  // className={`px-2 py-2 rounded-full font-medium transition-all ${activeTab === tab.name ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  //   }`}
                    
                >
                  <div  className={`flex flex-col items-center px-2 py-1 rounded-lg transition ${
                        activeTab === tab.name ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      style={{ flex: 1, minWidth: 0 }}
                    >
                     <tab.icon className="w-6 h-6 mb-1" />
                      <span className="text-xs truncate">{tab.name}</span>
                 </div>
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
                      className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('flightsFrom') ? 'border-red-500' : ''}`}
                      placeholder="From (City or Airport)"
                      value={travelLocations.flightsFrom || (liveSearchInput?.key === 'flightsFrom' ? liveSearchInput.value : "")}
                      onClick={() => {
                        setTravelLocations(prev => ({ ...prev, flightsFrom: "" }));
                        setLiveSearchInput({ key: 'flightsFrom', value: "" });
                        setActiveDropdownKey('flightsFrom');
                        setFilteredSuggestions(airports.slice(0, 10));
                        setTouchedFields(prev => ({ ...prev, flightsFrom: true })); // Mark as touched on click
                      }}
                      onChange={(e) => handleLocationInputChange(e, 'flightsFrom', 'airport')}
                      onBlur={() => handleInputBlur('flightsFrom', 'airport')}
                      readOnly={!!travelLocations.flightsFrom && activeDropdownKey !== 'flightsFrom'}
                    />
                    {activeDropdownKey === 'flightsFrom' && filteredSuggestions.length > 0 && (
                      <div className="absolute z-10 bg-white border w-full max-h-72 overflow-auto shadow-lg rounded-lg mt-1">
                        <ul className="divide-y">
                          {filteredSuggestions.map((airport: Airport, idx) => (
                            <li
                              key={idx}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                              onMouseDown={() => handleSuggestionSelect(`${airport.city} - ${airport.airport} (${airport.iata})`, 'flightsFrom', 'airport')}
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
                    {shouldShowError('flightsFrom') && <p className="text-red-500 text-xs mt-1">{locationErrors.flightsFrom}</p>}
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
                      className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('flightsTo') ? 'border-red-500' : ''}`}
                      placeholder="To (City or Airport)"
                      value={travelLocations.flightsTo || (liveSearchInput?.key === 'flightsTo' ? liveSearchInput.value : "")}
                      onClick={() => {
                        setTravelLocations(prev => ({ ...prev, flightsTo: "" }));
                        setLiveSearchInput({ key: 'flightsTo', value: "" });
                        setActiveDropdownKey('flightsTo');
                        setFilteredSuggestions(airports.slice(0, 10));
                        setTouchedFields(prev => ({ ...prev, flightsTo: true })); // Mark as touched on click
                      }}
                      onChange={(e) => handleLocationInputChange(e, 'flightsTo', 'airport')}
                      onBlur={() => handleInputBlur('flightsTo', 'airport')}
                      readOnly={!!travelLocations.flightsTo && activeDropdownKey !== 'flightsTo'}
                    />
                    {activeDropdownKey === 'flightsTo' && filteredSuggestions.length > 0 && (
                      <div className="absolute z-10 bg-white border w-full max-h-72 overflow-auto shadow-lg rounded-lg mt-1">
                        <ul className="divide-y">
                          {filteredSuggestions.map((airport: Airport, idx) => (
                            <li
                              key={idx}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                              onMouseDown={() => handleSuggestionSelect(`${airport.city} - ${airport.airport} (${airport.iata})`, 'flightsTo', 'airport')}
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
                    {shouldShowError('flightsTo') && <p className="text-red-500 text-xs mt-1">{locationErrors.flightsTo}</p>}
                  </div>
                </div>

                {/* Departure Date */}
                <div className="flex-1 min-w-32">
                  <ValidatedDateInput
                    label="Departure Date"
                    value={departureDate}
                    onChange={(date) => {
                        setDepartureDate(date);
                        setTouchedFields(prev => ({ ...prev, departureDate: true }));
                    }}
                    min={minDate}
                    max={maxDate}
                    error={shouldShowError('departureDate') ? locationErrors.departureDate : ''}
                  />
                </div>

                {/* Return Date */}
                {tripType === "roundTrip" && (
                  <div className="flex-1 min-w-32">
                    <ValidatedDateInput
                      label="Return Date"
                      value={returnDate}
                      onChange={(date) => {
                          setReturnDate(date);
                          setTouchedFields(prev => ({ ...prev, returnDate: true }));
                      }}
                      min={departureDate}
                      max={maxDate}
                      error={shouldShowError('returnDate') ? locationErrors.returnDate : ''}
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
                        onClick={() => {
                            setShowTravelerDropdown(!showTravelerDropdown);
                            setTouchedFields(prev => ({ ...prev, travelers: true })); // Mark as touched on button click
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 ${shouldShowError('travelers') ? 'border-red-500' : ''}`}
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
                                onClick={() => incrementCounter('adults')}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
                              >
                                +
                              </button>
                              <input
                                type="number"
                                value={adults}
                                onChange={(e) => {
                                  const value = Math.max(1, parseInt(e.target.value) || 1);
                                  setAdults(value);
                                  validateTravelers(value, infants);
                                  setTouchedFields(prev => ({ ...prev, travelers: true }));
                                }}
                                onBlur={() => setTouchedFields(prev => ({ ...prev, travelers: true }))}
                                className="w-12 text-center font-medium border rounded px-1 py-1"
                                min="1"
                              />
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
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">Children</div>
                              <div className="text-sm text-gray-500">2-11 Years</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => incrementCounter('children')}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
                              >
                                +
                              </button>
                              <input
                                type="number"
                                value={numChildren}
                                onChange={(e) => {
                                  const value = Math.max(0, parseInt(e.target.value) || 0);
                                  setNumChildren(value);
                                  setTouchedFields(prev => ({ ...prev, travelers: true }));
                                }}
                                onBlur={() => setTouchedFields(prev => ({ ...prev, travelers: true }))}
                                className="w-12 text-center font-medium border rounded px-1 py-1"
                                min="0"
                              />
                              <button
                                onClick={() => decrementCounter('children')}
                                disabled={numChildren <= 0}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${numChildren <= 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                  }`}
                              >
                                −
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
                                onClick={() => incrementCounter('infants')}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
                              >
                                +
                              </button>
                              <input
                                type="number"
                                value={infants}
                                onChange={(e) => {
                                  const value = Math.max(0, parseInt(e.target.value) || 0);
                                  setInfants(value);
                                  validateTravelers(adults, value);
                                  setTouchedFields(prev => ({ ...prev, travelers: true }));
                                }}
                                onBlur={() => setTouchedFields(prev => ({ ...prev, travelers: true }))}
                                className="w-12 text-center font-medium border rounded px-1 py-1"
                                min="0"
                              />
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
                            </div>
                          </div>

                          {travelerError && (
                            <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                              {travelerError}
                            </div>
                          )}
                          {shouldShowError('travelers') && <p className="text-red-500 text-xs mt-1">{locationErrors.travelers}</p>}


                          <div className="pt-4 border-t">
                            <label className="block text-sm font-medium mb-2">Class</label>
                            <select
                              value={travelClass}
                              onChange={(e) => {
                                  setTravelClass(e.target.value);
                                  setTouchedFields(prev => ({ ...prev, travelClass: true }));
                              }}
                              onBlur={() => setTouchedFields(prev => ({ ...prev, travelClass: true }))}
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
                      <input type="radio" name="fareType" value={fare} checked={fareType === fare} onChange={(e) => {
                        setFareType(e.target.value);
                        setTouchedFields(prev => ({ ...prev, fareType: true }));
                      }} className="w-4 h-4 text-blue-600" />
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
                  setIsSubmitAttempted(true); // Mark submission attempted
                  if (validateForm()) {
                    const currentTabSearchData = {
                      flightsFrom: travelLocations.flightsFrom,
                      flightsTo: travelLocations.flightsTo,
                      departureDate,
                      returnDate: tripType === "roundTrip" ? returnDate : null,
                      adults,
                      numChildren,
                      infants,
                      travelClass,
                      tripType,
                      fareType
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    // Alert only if there are actual visible errors after validation
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
                    className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('hotelsDestination') ? 'border-red-500' : ''}`}
                    placeholder="City or Property"
                    value={travelLocations.hotelsDestination || (liveSearchInput?.key === 'hotelsDestination' ? liveSearchInput.value : "")}
                    onClick={() => {
                      setTravelLocations(prev => ({ ...prev, hotelsDestination: "" }));
                      setLiveSearchInput({ key: 'hotelsDestination', value: "" });
                      setActiveDropdownKey('hotelsDestination');
                      setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                      setTouchedFields(prev => ({ ...prev, hotelsDestination: true }));
                    }}
                    onChange={(e) => handleLocationInputChange(e, 'hotelsDestination', 'destination')}
                    onBlur={() => handleInputBlur('hotelsDestination', 'destination')}
                    readOnly={!!travelLocations.hotelsDestination && activeDropdownKey !== 'hotelsDestination'}
                  />
                  {activeDropdownKey === 'hotelsDestination' && filteredSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                      {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                        <li
                          key={i}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => handleSuggestionSelect(dest.city, 'hotelsDestination', 'destination')}
                        >
                          {dest.city}, {dest.country}
                        </li>
                      ))}
                    </ul>
                  )}
                  {shouldShowError('hotelsDestination') && <p className="text-red-500 text-xs mt-1">{locationErrors.hotelsDestination}</p>}
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
                      setTouchedFields(prev => ({ ...prev, hotelCheckIn: true }));
                    }}
                    min={minDate}
                    max={maxDate}
                    error={shouldShowError('hotelCheckIn') ? locationErrors.hotelCheckIn : ''}
                  />
                </div>
                <div>
                  <ValidatedDateInput
                    label="Check-out Date"
                    value={hotelCheckOut}
                    onChange={(date) => {
                      setHotelCheckOut(date);
                      setTouchedFields(prev => ({ ...prev, hotelCheckOut: true }));
                    }}
                    min={hotelCheckIn || minDate}
                    max={maxDate}
                    error={shouldShowError('hotelCheckOut') ? locationErrors.hotelCheckOut : ''}
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
                    value={Number(hotelPriceRange)}
                    onChange={(e) => {
                      setHotelPriceRange(e.target.value);
                      setTouchedFields(prev => ({ ...prev, hotelPriceRange: true }));
                    }}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, hotelPriceRange: true }))}
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
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      hotelsDestination: travelLocations.hotelsDestination,
                      hotelCheckIn,
                      hotelCheckOut,
                      hotelPriceRange
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('cruiseFrom') ? 'border-red-500' : ''}`}
                  placeholder="Boarding Port"
                  value={travelLocations.cruiseFrom || (liveSearchInput?.key === 'cruiseFrom' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, cruiseFrom: "" }));
                    setLiveSearchInput({ key: 'cruiseFrom', value: "" });
                    setActiveDropdownKey('cruiseFrom');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, cruiseFrom: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'cruiseFrom', 'destination')}
                  onBlur={() => handleInputBlur('cruiseFrom', 'destination')}
                  readOnly={!!travelLocations.cruiseFrom && activeDropdownKey !== 'cruiseFrom'}
                />
                {activeDropdownKey === 'cruiseFrom' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'cruiseFrom', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('cruiseFrom') && <p className="text-red-500 text-xs mt-1">{locationErrors.cruiseFrom}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">To port</label>
                <input
                  type="text"
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('cruiseTo') ? 'border-red-500' : ''}`}
                  placeholder="Boarding Port"
                  value={travelLocations.cruiseTo || (liveSearchInput?.key === 'cruiseTo' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, cruiseTo: "" }));
                    setLiveSearchInput({ key: 'cruiseTo', value: "" });
                    setActiveDropdownKey('cruiseTo');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, cruiseTo: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'cruiseTo', 'destination')}
                  onBlur={() => handleInputBlur('cruiseTo', 'destination')}
                  readOnly={!!travelLocations.cruiseTo && activeDropdownKey !== 'cruiseTo'}
                />
                {activeDropdownKey === 'cruiseTo' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'cruiseTo', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('cruiseTo') && <p className="text-red-500 text-xs mt-1">{locationErrors.cruiseTo}</p>}
              </div>
              <ValidatedDateInput
                label="Travel Date"
                value={travelDate}
                onChange={(date) => {
                    setTravelDate(date);
                    setTouchedFields(prev => ({ ...prev, travelDate: true }));
                }}
                min={minDate}
                max={maxDate}
                error={shouldShowError('travelDate') ? locationErrors.travelDate : ''}
              />
              <div className="relative">
                <RoomGuestSelector activeTab='Cruise' label="Passengers & Type of Cruise" onChange={(data) => console.log('Selected:', data)} />
              </div>
              <button id='search'
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                onClick={() => {
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      cruiseFrom: travelLocations.cruiseFrom,
                      cruiseTo: travelLocations.cruiseTo,
                      travelDate
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('trainsFrom') ? 'border-red-500' : ''}`}
                  placeholder="Boarding Station"
                  value={travelLocations.trainsFrom || (liveSearchInput?.key === 'trainsFrom' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, trainsFrom: "" }));
                    setLiveSearchInput({ key: 'trainsFrom', value: "" });
                    setActiveDropdownKey('trainsFrom');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, trainsFrom: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'trainsFrom', 'destination')}
                  onBlur={() => handleInputBlur('trainsFrom', 'destination')}
                  readOnly={!!travelLocations.trainsFrom && activeDropdownKey !== 'trainsFrom'}
                />
                {activeDropdownKey === 'trainsFrom' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'trainsFrom', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('trainsFrom') && <p className="text-red-500 text-xs mt-1">{locationErrors.trainsFrom}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">To Station</label>
                <input
                  type="text"
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('trainsTo') ? 'border-red-500' : ''}`}
                  placeholder="Boarding Station"
                  value={travelLocations.trainsTo || (liveSearchInput?.key === 'trainsTo' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, trainsTo: "" }));
                    setLiveSearchInput({ key: 'trainsTo', value: "" });
                    setActiveDropdownKey('trainsTo');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, trainsTo: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'trainsTo', 'destination')}
                  onBlur={() => handleInputBlur('trainsTo', 'destination')}
                  readOnly={!!travelLocations.trainsTo && activeDropdownKey !== 'trainsTo'}
                />
                {activeDropdownKey === 'trainsTo' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'trainsTo', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('trainsTo') && <p className="text-red-500 text-xs mt-1">{locationErrors.trainsTo}</p>}
              </div>
              <ValidatedDateInput
                label="Travel Date"
                value={travelDate}
                onChange={(date) => {
                    setTravelDate(date);
                    setTouchedFields(prev => ({ ...prev, travelDate: true }));
                }}
                min={minDate}
                max={maxDate}
                error={shouldShowError('travelDate') ? locationErrors.travelDate : ''}
              />
              <RoomGuestSelector activeTab='Trains' label='Passengers and Type of Coach' onChange={(data) => console.log('Selected:', data)} />
              <button id='search'
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                onClick={() => {
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      trainsFrom: travelLocations.trainsFrom,
                      trainsTo: travelLocations.trainsTo,
                      travelDate
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('busesFrom') ? 'border-red-500' : ''}`}
                  placeholder="Boarding Bus Depo"
                  value={travelLocations.busesFrom || (liveSearchInput?.key === 'busesFrom' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, busesFrom: "" }));
                    setLiveSearchInput({ key: 'busesFrom', value: "" });
                    setActiveDropdownKey('busesFrom');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, busesFrom: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'busesFrom', 'destination')}
                  onBlur={() => handleInputBlur('busesFrom', 'destination')}
                  readOnly={!!travelLocations.busesFrom && activeDropdownKey !== 'busesFrom'}
                />
                {activeDropdownKey === 'busesFrom' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'busesFrom', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('busesFrom') && <p className="text-red-500 text-xs mt-1">{locationErrors.busesFrom}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">Arrival Bus Depo</label>
                <input
                  type="text"
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('busesTo') ? 'border-red-500' : ''}`}
                  placeholder="Arrival Bus Depo"
                  value={travelLocations.busesTo || (liveSearchInput?.key === 'busesTo' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, busesTo: "" }));
                    setLiveSearchInput({ key: 'busesTo', value: "" });
                    setActiveDropdownKey('busesTo');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, busesTo: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'busesTo', 'destination')}
                  onBlur={() => handleInputBlur('busesTo', 'destination')}
                  readOnly={!!travelLocations.busesTo && activeDropdownKey !== 'busesTo'}
                />
                {activeDropdownKey === 'busesTo' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'busesTo', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('busesTo') && <p className="text-red-500 text-xs mt-1">{locationErrors.busesTo}</p>}
              </div>
              <ValidatedDateInput
                label="Travel Date"
                value={travelDate}
                onChange={(date) => {
                    setTravelDate(date);
                    setTouchedFields(prev => ({ ...prev, travelDate: true }));
                }}
                min={minDate}
                max={maxDate}
                error={shouldShowError('travelDate') ? locationErrors.travelDate : ''}
              />
              <RoomGuestSelector activeTab='Buses' label='Passengers and Type of Bus' onChange={(data) => console.log('Selected:', data)} />
              <button id='search'
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                onClick={() => {
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      busesFrom: travelLocations.busesFrom,
                      busesTo: travelLocations.busesTo,
                      travelDate
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('cabsFrom') ? 'border-red-500' : ''}`}
                  placeholder="Pickup Location"
                  value={travelLocations.cabsFrom || (liveSearchInput?.key === 'cabsFrom' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, cabsFrom: "" }));
                    setLiveSearchInput({ key: 'cabsFrom', value: "" });
                    setActiveDropdownKey('cabsFrom');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, cabsFrom: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'cabsFrom', 'destination')}
                  onBlur={() => handleInputBlur('cabsFrom', 'destination')}
                  readOnly={!!travelLocations.cabsFrom && activeDropdownKey !== 'cabsFrom'}
                />
                {activeDropdownKey === 'cabsFrom' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'cabsFrom', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('cabsFrom') && <p className="text-red-500 text-xs mt-1">{locationErrors.cabsFrom}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">Dropping Location</label>
                <input
                  type="text"
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('cabsTo') ? 'border-red-500' : ''}`}
                  placeholder="Dropping Location"
                  value={travelLocations.cabsTo || (liveSearchInput?.key === 'cabsTo' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, cabsTo: "" }));
                    setLiveSearchInput({ key: 'cabsTo', value: "" });
                    setActiveDropdownKey('cabsTo');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, cabsTo: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'cabsTo', 'destination')}
                  onBlur={() => handleInputBlur('cabsTo', 'destination')}
                  readOnly={!!travelLocations.cabsTo && activeDropdownKey !== 'cabsTo'}
                />
                {activeDropdownKey === 'cabsTo' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'cabsTo', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('cabsTo') && <p className="text-red-500 text-xs mt-1">{locationErrors.cabsTo}</p>}
              </div>
              <ValidatedDateInput
                label="Travel Date"
                value={travelDate}
                onChange={(date) => {
                    setTravelDate(date);
                    setTouchedFields(prev => ({ ...prev, travelDate: true }));
                }}
                min={minDate}
                max={maxDate}
                error={shouldShowError('travelDate') ? locationErrors.travelDate : ''}
              />
              <RoomGuestSelector activeTab='Cabs' label='Passengers and Type of Cab' onChange={(data) => console.log('Selected:', data)} />
              <button id='search'
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                onClick={() => {
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      cabsFrom: travelLocations.cabsFrom,
                      cabsTo: travelLocations.cabsTo,
                      travelDate
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('visaDestination') ? 'border-red-500' : ''}`}
                  placeholder="Destination Country"
                  value={travelLocations.visaDestination || (liveSearchInput?.key === 'visaDestination' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, visaDestination: "" }));
                    setLiveSearchInput({ key: 'visaDestination', value: "" });
                    setActiveDropdownKey('visaDestination');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, visaDestination: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'visaDestination', 'destination')}
                  onBlur={() => handleInputBlur('visaDestination', 'destination')}
                  readOnly={!!travelLocations.visaDestination && activeDropdownKey !== 'visaDestination'}
                />
                {activeDropdownKey === 'visaDestination' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'visaDestination', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('visaDestination') && <p className="text-red-500 text-xs mt-1">{locationErrors.visaDestination}</p>}
              </div>
              <div className="relative">
                <ValidatedDateInput
                  label="Visa Date"
                  value={visaDate}
                  onChange={(date) => {
                      setVisaDate(date);
                      setTouchedFields(prev => ({ ...prev, visaDate: true }));
                  }}
                  min={minDate}
                  max={maxDate}
                  error={shouldShowError('visaDate') ? locationErrors.visaDate : ''}
                />
              </div>
              <div className="relative">
                <ValidatedDateInput
                  label="Return Date"
                  value={returnDate}
                  onChange={(date) => {
                      setReturnDate(date);
                      setTouchedFields(prev => ({ ...prev, returnDate: true }));
                  }}
                  min={visaDate || minDate}
                  max={maxDate}
                  error={shouldShowError('returnDate') ? locationErrors.returnDate : ''}
                />
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">Visa Type</label>
                <select className="border p-3 rounded w-full"
                    onChange={() => setTouchedFields(prev => ({ ...prev, visaType: true }))}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, visaType: true }))}
                >
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
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      visaDestination: travelLocations.visaDestination,
                      visaDate,
                      returnDate
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
              <div className="relative" ref={currencyDropdownRef}>
                <label className="block text-sm text-gray-700 mb-1">Currency to Buy</label>
                <input
                    className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('currencyToBuy') ? 'border-red-500' : ''}`}
                    placeholder="Search Currency (e.g., USD, Dollar)"
                    value={currencySearchInput}
                    onChange={handleCurrencySearchInputChange}
                    onClick={() => {
                      setTouchedFields(prev => ({ ...prev, currencyToBuy: true }));
                      // On click, if input is empty, show initial suggestions
                      if (!currencySearchInput) {
                        setFilteredCurrencySuggestions(countryCurrencies.slice(0, 5));
                      }
                    }}
                    onFocus={() => {
                      if (!currencySearchInput) {
                        setFilteredCurrencySuggestions(countryCurrencies.slice(0, 5));
                      }
                    }}
                    onBlur={() => {
                      setTouchedFields(prev => ({ ...prev, currencyToBuy: true })); // Mark as touched on blur
                      // Allow a small delay to handle click on suggestion before blur
                      setTimeout(() => {
                        const selectedCurrencyString = travelLocations.currencyToBuy;
                        const isCurrentlySelected = selectedCurrencyString && selectedCurrencyString.includes(currencySearchInput);
                        if (!isCurrentlySelected && currencySearchInput.trim() !== "") {
                            setLocationErrors(prev => ({ ...prev, currencyToBuy: "Please select a valid currency from the dropdown." }));
                            setCurrencySearchInput("");
                            setTravelLocations(prev => ({ ...prev, currencyToBuy: "" }));
                        } else if (!travelLocations.currencyToBuy.trim()) {
                            setLocationErrors(prev => ({ ...prev, currencyToBuy: "Currency to Buy is required." }));
                        }
                        setFilteredCurrencySuggestions([]);
                      }, 100);
                    }}
                />
                {filteredCurrencySuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg rounded-lg mt-1">
                    {filteredCurrencySuggestions.map((currency: CountryCurrency, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onMouseDown={() => handleCurrencySelect(currency)}
                      >
                        <img src={currency.flag} alt={`${currency.name} flag`} className="w-5 h-auto" />
                        <span>{currency.currency_name} ({currency.currency_symbol})</span>
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('currencyToBuy') && <p className="text-red-500 text-xs mt-1">{locationErrors.currencyToBuy}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <input
                      type="number"
                      className={`border p-3 rounded w-full ${shouldShowError('amount') ? 'border-red-500' : ''}`}
                      placeholder="Enter amount"
                      value={travelLocations.amount}
                      onChange={(e) => {
                          const value = e.target.value;
                          setTouchedFields(prev => ({ ...prev, amount: true })); // Mark as touched
                          if (value === "" || (Number(value) > 0 && !isNaN(Number(value)))) {
                              setTravelLocations(prev => ({ ...prev, amount: value }));
                              setLocationErrors(prev => ({ ...prev, amount: '' }));
                          } else if (Number(value) <= 0 && value !== "") {
                              setLocationErrors(prev => ({ ...prev, amount: 'Amount must be a positive number.' }));
                          }
                      }}
                      onBlur={() => {
                          setTouchedFields(prev => ({ ...prev, amount: true })); // Mark as touched on blur
                          const amountNum = Number(travelLocations.amount);
                          if (!travelLocations.amount.trim()) {
                              setLocationErrors(prev => ({ ...prev, amount: 'Amount is required.' }));
                          } else if (isNaN(amountNum) || amountNum <= 0) {
                              setLocationErrors(prev => ({ ...prev, amount: 'Amount must be a positive number.' }));
                          } else {
                              setLocationErrors(prev => ({ ...prev, amount: '' }));
                          }
                      }}
                      disabled={!travelLocations.currencyToBuy}
                      min="1"
                  />
                  {getSelectedCurrencySymbol() && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          {getSelectedCurrencySymbol()}
                      </span>
                  )}
                </div>
                {shouldShowError('amount') && <p className="text-red-500 text-xs mt-1">{locationErrors.amount}</p>}
              </div>
              <button id='search' className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                onClick={() => {
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      currencyToBuy: travelLocations.currencyToBuy,
                      amount: travelLocations.amount
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
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
                  className={`border p-3 rounded w-full cursor-pointer bg-white ${shouldShowError('insuranceDestination') ? 'border-red-500' : ''}`}
                  placeholder="Destination (City or Country)"
                  value={travelLocations.insuranceDestination || (liveSearchInput?.key === 'insuranceDestination' ? liveSearchInput.value : "")}
                  onClick={() => {
                    setTravelLocations(prev => ({ ...prev, insuranceDestination: "" }));
                    setLiveSearchInput({ key: 'insuranceDestination', value: "" });
                    setActiveDropdownKey('insuranceDestination');
                    setFilteredSuggestions(destinationsData.slice(0, 10).map(d => ({ city: d.name, country: d.code })));
                    setTouchedFields(prev => ({ ...prev, insuranceDestination: true }));
                  }}
                  onChange={(e) => handleLocationInputChange(e, 'insuranceDestination', 'destination')}
                  onBlur={() => handleInputBlur('insuranceDestination', 'destination')}
                  readOnly={!!travelLocations.insuranceDestination && activeDropdownKey !== 'insuranceDestination'}
                />
                {activeDropdownKey === 'insuranceDestination' && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto shadow-lg">
                    {filteredSuggestions.map((dest: { city: string; country: string }, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(dest.city, 'insuranceDestination', 'destination')}
                      >
                        {dest.city}, {dest.country}
                      </li>
                    ))}
                  </ul>
                )}
                {shouldShowError('insuranceDestination') && <p className="text-red-500 text-xs mt-1">{locationErrors.insuranceDestination}</p>}
              </div>
              <div className='relative'>
                <ValidatedDateInput
                  label="Travel Date"
                  value={travelDate}
                  onChange={(date) => {
                      setTravelDate(date);
                      setTouchedFields(prev => ({ ...prev, travelDate: true }));
                  }}
                  min={minDate}
                  max={maxDate}
                  error={shouldShowError('travelDate') ? locationErrors.travelDate : ''}
                />
              </div>
              <button id='search'
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                onClick={() => {
                  setIsSubmitAttempted(true);
                  if (validateForm()) {
                    const currentTabSearchData = {
                      insuranceDestination: travelLocations.insuranceDestination,
                      travelDate
                    };
                    setSavedFormData(prev => ({ ...prev, [activeTab!]: currentTabSearchData }));
                    navigate('/contact', { state: { formData: currentTabSearchData, tab: activeTab } });
                    setActiveTab(null);
                  } else {
                    if (Object.values(locationErrors).some(error => error !== "") || travelerError) {
                      alert("Please fix the errors in the form before searching.");
                    }
                  }
                }}
                disabled={isSearchButtonDisabled}
              >
                Apply for Insurance
              </button>
            </div>
          )}

        </TabPopup>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/sales' element={<SalesPage />} />
        <Route path="/ProfilePage" element={<UserProfile />} />
        <Route path="/Dashboard" element={<MyBookings />} />
        <Route path="/edit-package/:packageId" element={<EditablePackage />} />
        <Route path='/Add' element={<AddPackage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <PackageProvider>
      <Router>
        <ChatBot />
        <AppContent />
      </Router>
    </PackageProvider>
  );
}

export default App;