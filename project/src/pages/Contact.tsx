import React, { useState, useEffect, useCallback } from 'react';
import { Send, Phone, Mail, MapPin, Calendar, Users, Clock, Shield, Award, CheckCircle } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { getDatabase, ref, push } from "firebase/database";
import { database } from '../firebase/firebase'; // Ensure this import is correct if database is used directly
import ValidatedDateInput from '../components/validatedate';
import countriesData from '../components/countryandflags.json'; // Import the JSON data


interface Country {
  dial_code: string;
  flag: string;
  name: string; // Added name for sorting
}

const CountrySelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  countries: Country[];
}> = ({ value, onChange, countries }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedCountry = countries.find(c => c.dial_code === value);

  // Filter and sort for display
  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial_code.includes(search)
  ).slice(0, 10); // Show more results for better usability

  return (
    <div className="relative min-w-[90px] max-w-[120px]">
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-2 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer shadow-sm"
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
      </div>

      {showDropdown && (
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

  const { selectedPackage, bookingData, packages } = usePackages();

  // validateField is now solely for setting errors on individual field interactions
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
        }
        break;
      case 'travelDate':
        if (!value) {
          error = 'Travel date is required.';
        } else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize today's date

          const oneYearFromToday = new Date();
          oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
          oneYearFromToday.setHours(23, 59, 59, 999); // Normalize one year from today

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
    return error; // Return the error string
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', // Optional
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
  const [countries, setCountries] = useState<Country[]>([]); // State to store country data

  // This function is for internal checks (like button disabled state)
  // It does NOT modify the errors state directly.
  const checkFormValidity = useCallback(() => {
    const fieldsToValidate = ['firstName', 'email', 'phone', 'destination', 'travelDate', 'travelers'];
    for (const field of fieldsToValidate) {
        let error = '';
        const value = formData[field as keyof typeof formData]; // Get current value

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
        if (error) return false; // If any field has an error, the form is invalid
    }
    return true; // All validated fields are valid
  }, [formData]); // Re-evaluate when formData changes

  // Load and sort country data on component mount
  useEffect(() => {
    const prioritizedDialCodes = ['+91', '+1', '+44', '+61', '+971']; // Example prioritized countries

    const prioritized = countriesData.filter(country => prioritizedDialCodes.includes(country.dial_code));
    const others = countriesData.filter(country => !prioritizedDialCodes.includes(country.dial_code));

    // Sort prioritized countries alphabetically by name
    prioritized.sort((a, b) => a.name.localeCompare(b.name));
    // Sort other countries alphabetically by name
    others.sort((a, b) => a.name.localeCompare(b.name));

    setCountries([...prioritized, ...others]);
  }, []);

  // Prefill if data from selectedPackage and bookingData is present
  useEffect(() => {
    if (selectedPackage && bookingData) {
      setFormData(prev => ({
        ...prev,
        destination: selectedPackage.location,
        travelers: bookingData.travelers?.toString() || '',
        travelDate: bookingData.selectedDate || '',
        packageId: selectedPackage.id.toString(),
        message: `I'm interested in booking the ${selectedPackage.title} package for ${bookingData.travelers} travelers.`
      }));
      // Also validate these pre-filled fields to show initial errors if any
      validateField('destination', selectedPackage.location);
      validateField('travelers', bookingData.travelers?.toString() || '');
      validateField('travelDate', bookingData.selectedDate || '');
    }
  }, [selectedPackage, bookingData, validateField]); // Add validateField to dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value); // Validate immediately on change
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    validateField('phone', value); // Validate phone on change
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // On submission, we want to run validateField for all fields to ensure errors are displayed
    let formIsValidOnSubmit = true;
    const newErrorsOnSubmit: { [key: string]: string } = {};

    const fieldsToValidateOnSubmit = ['firstName', 'lastName', 'email', 'phone', 'destination', 'travelDate', 'travelers'];
    fieldsToValidateOnSubmit.forEach(field => {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value); // This will set errors in state
      if (error) {
        newErrorsOnSubmit[field] = error;
        formIsValidOnSubmit = false;
      }
    });

    setErrors(newErrorsOnSubmit); // Ensure all errors are displayed

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
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay

      const fmpck = formData.destination;
      // Find package by location if packageId is not already set
      const fmpckid = packages.find(pkg => String(pkg.location) === fmpck);

      const booking = {
        name: `${formData.firstName} ${formData.lastName.trim()}`, // Combine first and last name
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`, // Combine country code and phone number
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
        timestamp: new Date().toISOString(), // Add timestamp for tracking
      };
      console.log("Booking data:", booking);
      const db = getDatabase();
      console.log("Saving booking to Firebase Realtime Database...");
      await push(ref(db, "bookings"), booking);
      console.log("Booking saved successfully");
      setIsSubmitting(false);
      setSubmitted(true);
      console.log("Booking submitted successfully");
      // Reset form after a successful submission and short delay
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
        setErrors({}); // Clear errors on successful submission
        setSubmitted(false); // Hide success message after a delay
      }, 5000); // Show success message for 5 seconds
    } catch (error) {
      console.error("Error saving booking:", error);
      setIsSubmitting(false);
      setSubmitted(false); // Ensure submitted is false on error

      // Optionally, reset form or keep data to allow user to correct
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
        setErrors({}); // Clear errors if resetting form
      }, 5000); // Clear form after 5 seconds even on error
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

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Selected Package Summary */}
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
          {/* Contact Information */}
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

            {/* Emergency Support */}
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

            {/* Why Choose Us */}
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

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedPackage ? 'Complete Your Booking' : 'Book Your Adventure'}
              </h3>

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
                      <li>• Secure payment processing and confirmation</li>
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        }`}
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        }`}
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        }`}
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
                            // No direct validation needed for country code change itself
                          }}
                          countries={countries}
                        />

                        <div className="flex-1">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                            className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                            }`}
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
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Destination *
                      </label>
                      <select
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          errors.destination ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        }`}
                      >
                        <option value="" disabled>Select destination</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Swiss Alps">Swiss Alps</option>
                        <option value="Japan">Japan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Greek Islands">Greek Islands</option>
                        <option value="Iceland">Iceland</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination}</p>}
                    </div>
                    <div>
                      <ValidatedDateInput
                        label ="Travel Date *"
                        value={formData.travelDate}
                        onChange={(value) => {
                          setFormData(prev => ({ ...prev, travelDate: value }));
                          validateField('travelDate', value);
                        }}
                      
                        // onBlur={(value) => validateField('travelDate', value)}
                        min={new Date().toISOString().split('T')[0]} // Today's date
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]} // One year from today
                        // error={errors.travelDate} // Pass error prop to ValidatedDateInput
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                        errors.travelers ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                      }`}
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
                    {/* No specific validation error for message, but can add if needed */}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Booking Process</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Submit this form to start your booking</li>
                      <li>• Our expert will call you within 2 hours</li>
                      <li>• Customize your itinerary and confirm details</li>
                      <li>• Secure payment and receive confirmation</li>
                    </ul>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !checkFormValidity()} // Using checkFormValidity here
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