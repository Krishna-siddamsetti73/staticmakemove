import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, Building } from 'lucide-react';
import { signIn, signUp } from './firebaseservices'; // Assuming these are correctly implemented

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

// Define the structure for country data
interface CountryCode {
  name: string;
  dial_code: string;
  flag: string; // URL to the flag image
}

// Removed the staticCountryData array as it will now be fetched from a local JSON file


const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // States for fetching as data is no longer static
  const [countryData, setCountryData] = useState<CountryCode[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countryError, setCountryError] = useState('');

  // Default flag and country code
  const defaultCountryCode = '+91';
  const defaultFlag = 'https://flagcdn.com/w20/in.png'; // Default flag for India

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: defaultCountryCode,
    flag: defaultFlag,
    userType: 'B2C' as 'B2C' | 'B2B',
    status: 'active' as 'active' | 'pending'
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  // Fetch country codes from the local JSON file on component mount
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        // Updated path to your local JSON file
        const response = await fetch('src/components/countryandflags.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CountryCode[] = await response.json();

        // Sort data alphabetically by country name
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setCountryData(sortedData);

        // Set initial country code and flag from fetched data if available
        const initialCountry = sortedData.find(c => c.dial_code === defaultCountryCode);
        if (initialCountry) {
          setFormData(prev => ({
            ...prev,
            countryCode: initialCountry.dial_code,
            flag: initialCountry.flag,
          }));
        }
      } catch (err: any) {
        setCountryError('Failed to load country codes. Please check the file path and content.');
        console.error('Failed to fetch country codes:', err);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountryCodes();
  }, []); // Empty dependency array means this runs once on mount

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email address is invalid';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateName = (name: string, required: boolean): string => {
    const trimmed = name.trim();
    const regex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;

    if (!trimmed && required) return "This field is required";
    if (!trimmed && !required) return ""; // Allow empty if not required
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    if (!regex.test(trimmed)) return "Only letters, spaces, hyphens, and apostrophes are allowed";
    return "";
  };

  const validatePhone = (phone: string): string => {
    const trimmed = phone.trim();
    if (!trimmed) return 'Phone number is required';
    // Basic validation: digits only, must be 10 digits
    if (!/^\d{10}$/.test(trimmed)) return 'Invalid phone number format (10 digits)';
    return '';
  };

  // Handle input changes for all form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle blur event for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'firstName':
        errorMessage = validateName(value, true); // First name is required
        break;
      case 'lastName':
        errorMessage = validateName(value, false); // Last name is optional
        break;
      case 'phone':
        errorMessage = validatePhone(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  // Function to check if the form is valid
  const isFormValid = () => {
    if (mode === 'login') {
      // For login, only email and password need to be valid
      return !validateEmail(formData.email) && !validatePassword(formData.password);
    } else { // signup mode
      // For signup, all required fields must be valid
      const firstNameValid = !validateName(formData.firstName, true);
      const phoneValid = !validatePhone(formData.phone);
      const emailValid = !validateEmail(formData.email);
      const passwordValid = !validatePassword(formData.password);

      return firstNameValid && phoneValid && emailValid && passwordValid;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Perform all validations before submission
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      firstName: mode === 'signup' ? validateName(formData.firstName, true) : '',
      lastName: mode === 'signup' ? validateName(formData.lastName, false) : '',
      phone: mode === 'signup' ? validatePhone(formData.phone) : '',
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(err => err !== '');

    if (hasErrors) {
      setLoading(false);
      return; // Prevent form submission if there are errors
    }

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
      } else {
        // Capitalize first letter of firstName and lastName
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        const firstName = capitalize(formData.firstName);
        const lastName = capitalize(formData.lastName);

        await signUp(
          formData.email,
          formData.password,
          `${firstName} ${lastName}`,
          `${formData.countryCode}${formData.phone}`,
          formData.userType
        );
      }
      onClose();
      // Reset form data after successful submission
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        flag: defaultFlag,
        countryCode: defaultCountryCode,
        userType: formData.userType,
        status: formData.userType === 'B2C' ? 'active' : 'pending'
      });
      setErrors({ // Clear errors as well
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filtered country codes for the dropdown search
  const filteredCodes = countryData.filter(item =>
    item.dial_code.includes(search) || item.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10); // Limit to 10 results for better performance and UI

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-1">
                {mode === 'login' ? 'Sign in to your account' : 'Join us today'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 ${
                          errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="John"
                        required
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 ${
                          errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-28">
                      <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-red-500"
                      >
                        <span className="flex items-center gap-1">
                           <img src={formData.flag} alt="Country Flag" className="h-4 w-auto" />
                           <span>{formData.countryCode}</span>
                        </span>
                        <span className="ml-1">▼</span>
                      </button>

                      {showDropdown && (
                        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
                          <input
                            type="text"
                            placeholder="Search country"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-2 py-1 border-b outline-none rounded-t-lg"
                          />
                          {loadingCountries ? (
                            <div className="px-2 py-2 text-gray-500 text-sm">Loading countries...</div>
                          ) : countryError ? (
                            <div className="px-2 py-2 text-red-500 text-sm">{countryError}</div>
                          ) : filteredCodes.length > 0 ? (
                            filteredCodes.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, flag: item.flag, countryCode: item.dial_code }));
                                  setShowDropdown(false);
                                  setSearch('');
                                }}
                                className="w-full text-left px-2 py-1 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <img src={item.flag} alt={`${item.name} Flag`} className="h-4 w-auto" />
                                <span>{item.dial_code} ({item.name})</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-2 py-2 text-gray-500 text-sm">No results</div>
                          )}
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Phone number"
                      className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="your@email.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-4 pr-12 py-2 border rounded-lg focus:ring-2 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid()} // Disable if loading or form is not valid
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow"
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  // You should implement signInWithGoogle in your firebaseservices
                  await import('./firebaseservices').then(mod => mod.signInWithGoogle());
                  onClose();
                } catch (err: any) {
                  setError(err.message || 'Google sign-in failed');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
