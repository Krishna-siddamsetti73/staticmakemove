import React, { useState, useEffect, useCallback } from 'react';
import { Send, Phone, Mail, MapPin, Calendar, Users, Clock, Shield, Award, CheckCircle } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { getDatabase, ref, push } from "firebase/database";
import { database } from '../firebase/firebase'; 
import ValidatedDateInput from '../components/validatedate';
import countriesData from '../components/countryandflags.json'; 
import { useLocation } from 'react-router-dom'; 
import { useAuth } from '../firebase/authcontext';
import SearchableCountrySelect from '../components/searchableCountry'; // Make sure this path is correct

interface Country {
  dial_code: string;
  flag: string;
  name: string; 
}

const CountrySelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  countries: Country[];
  readOnly?: boolean;
}> = ({ value, onChange, countries, readOnly = false }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedCountry = countries.find(c => c.dial_code === value);

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial_code.includes(search)
  ).slice(0, 10); 

  return (
    <div className="relative min-w-[90px] max-w-[120px]">
      <div
        onClick={() => !readOnly && setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-2 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer shadow-sm ${readOnly ? 'bg-gray-100 cursor-default' : ''}`}
      >
        {selectedCountry && (
          <img
            src={selectedCountry.flag}
            className="h-4 w-5 rounded-full object-cover border"
            alt={selectedCountry.name}
          />
        )}
        <span className="text-sm font-medium text-gray-700">
          {selectedCountry?.dial_code || value}
        </span>
        {!readOnly && (
          <svg
            className="w-4 h-4 ml-auto text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        )}
      </div>

      {showDropdown && !readOnly && (
        <div className="absolute top-full left-0 z-10 w-full bg-white border rounded-lg shadow-lg mt-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search country or code"
            className="w-full p-2 border-b text-sm outline-none rounded-t-lg"
          />
          <ul className="max-h-48 overflow-auto">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400">No matches</li>
            )}
            {filtered.map((country, idx) => (
              <li
                key={idx}
                onClick={() => {
                  onChange(country.dial_code);
                  setShowDropdown(false);
                  setSearch('');
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <img src={country.flag} alt={country.name} className="w-5 h-4 rounded" />
                <span>{country.name} ({country.dial_code})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const Contact = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const location = useLocation(); 
  const { currentUser, userProfile } = useAuth(); 

  const { selectedPackage, bookingData, packages } = usePackages();
  const allCountries = countriesData as { name: string }[];

  const validateField = useCallback((name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required.';
        } else if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) {
          error = 'Only letters, spaces, hyphens, and apostrophes are allowed.';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters long.';
        }
        break;
      case 'lastName':
        if (value && !/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) {
          error = 'Only letters, spaces, hyphens, and apostrophes are allowed.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required.';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Phone number must be exactly 10 digits.';
        }
        break;
      case 'destination':
        if (!value) {
          error = 'Preferred destination is required.';
        } else if (!allCountries.some(country => country.name === value)) {
          error = 'Please select a valid country from the list.';
        }
        break;
      case 'travelDate':
        if (!value) {
          error = 'Travel date is required.';
        } else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); 

          const oneYearFromToday = new Date();
          oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
          oneYearFromToday.setHours(23, 59, 59, 999); 

          if (selected < today) {
            error = 'Travel date cannot be in the past.';
          } else if (selected > oneYearFromToday) {
            error = 'Travel date cannot be more than one year from today.';
          }
        }
        break;
      case 'travelers':
        if (!value) {
          error = 'Number of travelers is required.';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error; 
  }, [allCountries]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    phone: '',
    countryCode: '+91',
    destination: '',
    travelDate: '',
    travelers: '',
    message: '',
    packageId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]); 
  const [prefilledFields, setPrefilledFields] = useState<Set<string>>(new Set()); 


  const checkFormValidity = useCallback(() => {
    const fieldsToValidate = ['firstName', 'email', 'phone', 'destination', 'travelDate', 'travelers'];
    const allCountries = countriesData as { name: string }[];

    for (const field of fieldsToValidate) {
        let error = '';
        const value = formData[field as keyof typeof formData]; 

        switch (field) {
            case 'firstName':
                if (!value.trim()) error = 'First name is required.';
                else if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) error = 'Only letters, spaces, hyphens, and apostrophes are allowed.';
                else if (value.trim().length < 2) error = 'First name must be at least 2 characters long.';
                break;
            case 'email':
                if (!value.trim()) error = 'Email is required.';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address.';
                break;
            case 'phone':
                if (!value.trim()) error = 'Phone number is required.';
                else if (!/^\d{10}$/.test(value)) error = 'Phone number must be exactly 10 digits.';
                break;
            case 'destination':
                if (!value) error = 'Preferred destination is required.';
                else if (!allCountries.some(country => country.name === value)) error = 'Please select a valid country from the list.';
                break;
            case 'travelDate':
                if (!value) {
                    error = 'Travel date is required.';
                } else {
                    const selected = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const oneYearFromToday = new Date();
                    oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
                    oneYearFromToday.setHours(23, 59, 59, 999);

                    if (selected < today) {
                        error = 'Travel date cannot be in the past.';
                    } else if (selected > oneYearFromToday) {
                        error = 'Travel date cannot be more than one year from today.';
                    }
                }
                break;
            case 'travelers':
                if (!value) error = 'Number of travelers is required.';
                break;
            default:
                break;
        }
        if (error) return false; 
    }
    return true; 
  }, [formData]); 

  useEffect(() => {
    const prioritizedDialCodes = ['+91', '+1', '+44', '+61', '+971']; 

    const prioritized = countriesData.filter(country => prioritizedDialCodes.includes(country.dial_code));
    const others = countriesData.filter(country => !prioritizedDialCodes.includes(country.dial_code));

    prioritized.sort((a, b) => a.name.localeCompare(b.name));
    others.sort((a, b) => a.name.localeCompare(b.name));

    setCountries([...prioritized, ...others]);
  }, []);

  useEffect(() => {
    let combinedPrefillData: any = {};
    const tempPrefilledFields = new Set<string>();
    let finalMessage = '';

    const setAndMark = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== '') {
            combinedPrefillData[key] = value;
            tempPrefilledFields.add(key);
        }
    };

    if (location.state && location.state.formData) {
        const passedFormData = location.state.formData;
        const tab = location.state.tab;

        if (tab === 'Flights') {
            setAndMark('destination', passedFormData.flightsTo);
            setAndMark('travelDate', passedFormData.departureDate);
            setAndMark('travelers', (passedFormData.adults + passedFormData.numChildren + passedFormData.infants).toString());
            
            finalMessage = `I'm interested in a ${passedFormData.tripType} flight from ${passedFormData.flightsFrom} to ${passedFormData.flightsTo} departing on ${passedFormData.departureDate}.`;
            if (passedFormData.returnDate) finalMessage += ` Return date: ${passedFormData.returnDate}.`;
            finalMessage += ` Travelers: ${combinedPrefillData.travelers} (${passedFormData.adults} adults, ${passedFormData.numChildren} children, ${passedFormData.infants} infants). Class: ${passedFormData.travelClass}. Fare Type: ${passedFormData.fareType}.`;

        } else if (tab === 'Hotels') {
            setAndMark('destination', passedFormData.hotelsDestination);
            setAndMark('travelDate', passedFormData.hotelCheckIn);
            finalMessage = `I'm interested in hotels in ${passedFormData.hotelsDestination} checking in on ${passedFormData.hotelCheckIn} and checking out on ${passedFormData.hotelCheckOut}. Price range: ${passedFormData.hotelPriceRange || 'Any'}.`;
        } else if (tab === 'Cruise') {
            setAndMark('destination', passedFormData.cruiseTo);
            setAndMark('travelDate', passedFormData.travelDate);
            finalMessage = `I'm interested in a cruise from ${passedFormData.cruiseFrom} to ${passedFormData.cruiseTo} on ${passedFormData.travelDate}.`;
        } else if (tab === 'Trains') {
            setAndMark('destination', passedFormData.trainsTo);
            setAndMark('travelDate', passedFormData.travelDate);
            finalMessage = `I'm interested in a train from ${passedFormData.trainsFrom} to ${passedFormData.trainsTo} on ${passedFormData.travelDate}.`;
        } else if (tab === 'Buses') {
            setAndMark('destination', passedFormData.busesTo);
            setAndMark('travelDate', passedFormData.travelDate);
            finalMessage = `I'm interested in a bus from ${passedFormData.busesFrom} to ${passedFormData.busesTo} on ${passedFormData.travelDate}.`;
        } else if (tab === 'Cabs') {
            setAndMark('destination', passedFormData.cabsTo);
            setAndMark('travelDate', passedFormData.travelDate);
            finalMessage = `I'm interested in a cab from ${passedFormData.cabsFrom} to ${passedFormData.cabsTo} on ${passedFormData.travelDate}.`;
        } else if (tab === 'Visa') {
            setAndMark('destination', passedFormData.visaDestination);
            setAndMark('travelDate', passedFormData.visaDate); 
            finalMessage = `I'm interested in a visa for ${passedFormData.visaDestination} for travel from ${passedFormData.visaDate} to ${passedFormData.returnDate}.`;
        } else if (tab === 'ForexCard') {
            finalMessage = `I'm interested in buying ${passedFormData.amount} of ${passedFormData.currencyToBuy}.`;
        } else if (tab === 'Insurance') {
            setAndMark('destination', passedFormData.insuranceDestination);
            setAndMark('travelDate', passedFormData.travelDate);
            finalMessage = `I'm interested in travel insurance for ${passedFormData.insuranceDestination} for travel date ${passedFormData.travelDate}.`;
        }
    }
    
    if (!location.state?.formData && selectedPackage && bookingData) {
      if (!combinedPrefillData.destination) setAndMark('destination', selectedPackage.location);
      if (!combinedPrefillData.travelers) setAndMark('travelers', bookingData.travelers?.toString());
      if (!combinedPrefillData.travelDate) setAndMark('travelDate', bookingData.selectedDate);
      if (!combinedPrefillData.packageId) setAndMark('packageId', selectedPackage.id.toString());
      if (!finalMessage) finalMessage = `I'm interested in booking the ${selectedPackage.title} package for ${bookingData.travelers} travelers.`;
    }

    if (currentUser && userProfile) {
      if (!combinedPrefillData.firstName) setAndMark('firstName', userProfile.name?.split(' ')[0]);
      if (!combinedPrefillData.lastName) setAndMark('lastName', userProfile.name?.split(' ').slice(1).join(' '));
      if (!combinedPrefillData.email) setAndMark('email', currentUser.email);
      if (userProfile.phone) {
        const matchedCountry = countriesData.find(country => userProfile.phone.startsWith(country.dial_code));
        if (matchedCountry) {
          if (!combinedPrefillData.countryCode) setAndMark('countryCode', matchedCountry.dial_code);
          if (!combinedPrefillData.phone) setAndMark('phone', userProfile.phone.substring(matchedCountry.dial_code.length));
        } else {
          if (!combinedPrefillData.countryCode) setAndMark('countryCode', '+91');
          if (!combinedPrefillData.phone) setAndMark('phone', userProfile.phone);
        }
      }
    }
    
    setFormData(prev => {
      const newFormData = { ...prev, ...combinedPrefillData };
      if (finalMessage) {
        newFormData.message = finalMessage;
        tempPrefilledFields.add('message'); 
      }
      return newFormData;
    });
    setPrefilledFields(tempPrefilledFields);
  }, [location.state, selectedPackage, bookingData, validateField, currentUser, userProfile, countriesData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Do not allow changes if field is prefilled from search/package data
    if (prefilledFields.has(name)) {
        return; 
    }
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value); 
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (prefilledFields.has('phone')) { // Prevent changes if phone is prefilled
        return;
    }
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    validateField('phone', value); 
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let formIsValidOnSubmit = true;
    const newErrorsOnSubmit: { [key: string]: string } = {};

    const fieldsToValidateOnSubmit = ['firstName', 'lastName', 'email', 'phone', 'destination', 'travelDate', 'travelers'];
    fieldsToValidateOnSubmit.forEach(field => {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value); 
      if (error) {
        newErrorsOnSubmit[field] = error;
        formIsValidOnSubmit = false;
      }
    });

    setErrors(newErrorsOnSubmit); 

    if (!formIsValidOnSubmit) {
        console.error("Please fill in all required fields correctly.");
        const firstErrorField = Object.keys(newErrorsOnSubmit).find(key => newErrorsOnSubmit[key]);
        if (firstErrorField) {
            document.getElementsByName(firstErrorField)?.[0]?.focus();
        }
        return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting booking with data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); 

      const fmpck = formData.destination;
      const fmpckid = packages.find(pkg => String(pkg.location) === fmpck);

      const booking = {
        name: `${formData.firstName} ${formData.lastName.trim()}`, 
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`, 
        destination: selectedPackage?.location || formData.destination,
        travelDate: bookingData?.selectedDate || formData.travelDate,
        travelers: bookingData?.travelers?.toString() || formData.travelers,
        message: selectedPackage?.title
          ? `I'm interested in booking the ${selectedPackage.title} package for ${bookingData.travelers} travelers.`
          : formData.message,
        packageId:
          (selectedPackage?.id && selectedPackage?.id.toString()) ||
          (fmpckid?.id && fmpckid.id.toString()) ||
          "unknown",
        timestamp: new Date().toISOString(), 
      };
      console.log("Booking data:", booking);
      const db = getDatabase();
      console.log("Saving booking to Firebase Realtime Database...");
      await push(ref(db, "bookings"), booking);
      console.log("Booking saved successfully");
      setIsSubmitting(false);
      setSubmitted(true);
      console.log("Booking submitted successfully");
      
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          countryCode: '+91',
          destination: '',
          travelDate: '',
          travelers: '',
          message: '',
          packageId: ''
        });
        setErrors({}); 
        setSubmitted(false); 
      }, 5000); 
    } catch (error) {
      console.error("Error saving booking:", error);
      setIsSubmitting(false);
      setSubmitted(false); 

      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          countryCode: '+91',
          destination: '',
          travelDate: '',
          travelers: '',
          message: '',
          packageId: ''
        });
        setErrors({}); 
      }, 5000); 
    }
  };


  const emergencyContacts = [
    {
      region: "India",
      phone: "+91 9542226777",
      hours: "24/7"
    },
  ];

  const whyChooseUs = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Best Price Guarantee",
      description: "We guarantee the best prices with no hidden fees"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support worldwide"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Award Winning",
      description: "Recognized for excellence in travel services"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Secure Booking",
      description: "Safe and secure payment processing"
    }
  ];

  const isProfileApproved = userProfile?false:true; 


  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {selectedPackage ? 'Complete Your Booking' : 'Contact & Booking'}
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              {selectedPackage
                ? `You're one step away from your ${selectedPackage.title} adventure!`
                : 'Ready to make your move? Get in touch and let\'s create your perfect travel experience'
              }
            </p>
          </div>
        </div>
      </section>

      {selectedPackage && bookingData && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedPackage.image}
                    alt={selectedPackage.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{selectedPackage.title}</div>
                    <div className="text-gray-600">{selectedPackage.location}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">{bookingData.travelers} Travelers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">{bookingData.selectedDate || 'Date TBD'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">${bookingData.totalPrice}</div>
                  <div className="text-gray-600">Total Price</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-600 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">+91 9542226777</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@makeamove.co.in</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Office</div>
                    <div className="text-gray-600">3rd Floor, BRK Building, 8-2-626/2, Block - B, Rd Number 11, Banjara Hills, Hyderabad, Telangana 500034</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-600 text-white rounded-2xl p-8">
              <h4 className="text-xl font-bold mb-4">24/7 Emergency Support</h4>
              <p className="mb-6">Need immediate assistance while traveling? Our emergency support team is available around the clock.</p>

              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="border-t border-red-500 pt-4 first:border-t-0 first:pt-0">
                    <div className="font-semibold">{contact.region}</div>
                    <div className="text-red-100">{contact.phone}</div>
                    <div className="text-sm text-red-200">{contact.hours}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Why Choose Make A Move?</h4>
              <div className="space-y-4">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white p-2 rounded-full">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-gray-600 text-sm">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedPackage ? 'Complete Your Booking' : 'Book Your Adventure'}
              </h3>

              {currentUser && !isProfileApproved && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                  <p className="font-bold">Profile Not Yet Approved</p>
                  <p>Currently your profile is not yet approved, so we apologize for the inconvenience. Until your account is approved, please book through this contact form, and our salesman will contact you within 2 hours.</p>
                </div>
              )}

              {submitted ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-green-600 mb-4">Booking Request Submitted!</h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for choosing Make A Move! We've received your booking request and will contact you within 2 hours to confirm your adventure.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 text-left">
                    <h5 className="font-semibold text-green-800 mb-2">What happens next?</h5>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• Our travel expert will call you within 2 hours</li>
                      <li>• We'll finalize your itinerary and preferences</li>
                      <li>• Secure payment and confirmation</li>
                      <li>• Detailed travel documents sent to your email</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        readOnly={prefilledFields.has('firstName')} 
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        } ${prefilledFields.has('firstName') ? 'bg-gray-100' : ''}`} 
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        readOnly={prefilledFields.has('lastName')} 
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        } ${prefilledFields.has('lastName') ? 'bg-gray-100' : ''}`} 
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        readOnly={prefilledFields.has('email')} 
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        } ${prefilledFields.has('email') ? 'bg-gray-100' : ''}`} 
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="flex gap-2 items-start">
                        <CountrySelect
                          value={formData.countryCode}
                          onChange={(code) => {
                            setFormData(prev => ({ ...prev, countryCode: code }));
                          }}
                          countries={countries}
                          readOnly={prefilledFields.has('countryCode')} 
                        />

                        <div className="flex-1">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                            readOnly={prefilledFields.has('phone')} 
                            className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                            } ${prefilledFields.has('phone') ? 'bg-gray-100' : ''}`} 
                            placeholder="9876543210"
                            maxLength={10}
                          />
                          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <SearchableCountrySelect
                        value={formData.destination}
                        onChange={(value: any) => setFormData(prev => ({ ...prev, destination: value }))}
                        onBlur={() => validateField('destination', formData.destination)}
                        disabled={prefilledFields.has('destination')}
                        error={errors.destination}
                      />
                    </div>
                    <div>
                      <ValidatedDateInput
                        label ="Travel Date *"
                        value={formData.travelDate}
                        onChange={(value) => {
                          setFormData(prev => ({ ...prev, travelDate: value }));
                          validateField('travelDate', value);
                        }}
                        // readOnly={prefilledFields.has('travelDate')} 
                        // className={`${prefilledFields.has('travelDate') ? 'bg-gray-100' : ''}`} 
                        min={new Date().toISOString().split('T')[0]} 
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]} 
                      />
                      {errors.travelDate && <p className="mt-1 text-sm text-red-600">{errors.travelDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Travelers *
                    </label>
                    <select
                      id="travelers"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleChange}
                      onBlur={(e) => validateField(e.target.name, e.target.value)}
                      disabled={prefilledFields.has('travelers')} 
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                        errors.travelers ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                      } ${prefilledFields.has('travelers') ? 'bg-gray-100' : ''}`} 
                    >
                      <option value="" disabled>Select travelers</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5+">5+ People</option>
                    </select>
                    {errors.travelers && <p className="mt-1 text-sm text-red-600">{errors.travelers}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your dream trip, special requirements, dietary restrictions, or any questions..."
                    ></textarea>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Booking Process</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Submit this form to start your booking</li>
                      <li>• Our expert will call you within 2 hours</li>
                      <li>• Customize your itinerary and confirm details</li>
                      <li>• Secure payment and receive confirmation</li>
                      <li>• Detailed travel documents sent to your email</li>
                    </ul>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !checkFormValidity()} 
                    className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>{selectedPackage ? 'Complete Booking' : 'Submit Request'}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    No payment required at this stage.
                  </div>
                </form>
              )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};


export default Contact;