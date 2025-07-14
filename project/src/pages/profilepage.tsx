import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../firebase/authcontext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getUserProfile } from '../firebase/firebaseservices';
import countriesData from '../components/countryandflags.json'; // Import the JSON data
import { User } from 'lucide-react'; // Assuming lucide-react is installed for the User icon

const ProfilePage = () => {
  const { currentUser, logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const [userProfileState, setUserProfile] = useState(userProfile);
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);

  // Profile images
  const staticBgImage = 'src/components/Black and Red Futuristic Tech Review Youtube Banner.png'; // Static default background image

  // Form fields
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [tempName, setTempName] = useState(name);
  const [tempPhone, setTempPhone] = useState(phone);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91'); // Default to +91 (India)

  // Validation states
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Country dropdown states
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null); // Ref for clicking outside

  const fetchProfile = async () => {
    if (currentUser?.uid) {
      const profile = await getUserProfile(currentUser.uid);
      setUserProfile(profile);
      setName(profile?.name || '');

      // Parse phone to extract country code and number
      const fullPhoneNumber = profile?.phone || '';
      // Try to find a matching country code from the start of the phone number
      let foundCountryCode = false;
      for (const country of countriesData) {
        if (fullPhoneNumber.startsWith(country.dial_code)) {
          setSelectedCountryCode(country.dial_code);
          setPhone(fullPhoneNumber.substring(country.dial_code.length));
          setTempPhone(fullPhoneNumber.substring(country.dial_code.length));
          foundCountryCode = true;
          break;
        }
      }

      if (!foundCountryCode) {
        // If no country code matches or phone is empty, default to +91 and full phone as number
        setSelectedCountryCode('+91'); // Default to India
        setPhone(fullPhoneNumber);
        setTempPhone(fullPhoneNumber);
      }

      setTempName(profile?.name || '');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  // Handle clicks outside the country dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
        setCountrySearchTerm(''); // Clear search when closing
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Validate inputs
  const validateInputs = (
    currentName: string,
    currentPhone: string
  ): { isValid: boolean; nameErrMsg: string; phoneErrMsg: string } => {
    let isValid = true;
    let nameErrMsg = '';
    let phoneErrMsg = '';

    // Name validation: Not empty, at least 2 characters, only letters and spaces
    if (!currentName.trim()) {
      nameErrMsg = 'Name cannot be empty.';
      isValid = false;
    } else if (currentName.trim().length < 2) {
      nameErrMsg = 'Name must be at least 2 characters long.';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(currentName)) {
      nameErrMsg = 'Name can only contain letters and spaces.';
      isValid = false;
    }


    if (!currentPhone.trim()) {
      phoneErrMsg = 'Phone number cannot be empty.';
      isValid = false;
    } else if (!/^\d{10}$/.test(currentPhone.trim())) { // Assuming 10 digits for phone number excluding country code
      phoneErrMsg = 'Phone number must be 10 digits.';
      isValid = false;
    }

    setNameError(nameErrMsg);
    setPhoneError(phoneErrMsg);
    return { isValid, nameErrMsg, phoneErrMsg };
  };

  // Effect to re-validate when tempName or tempPhone changes
  useEffect(() => {
    if (isEditing) {
      validateInputs(tempName, tempPhone);
    }
  }, [tempName, tempPhone, isEditing]);


  interface UserProfileUpdates {
    name?: string;
    phone?: string;
    [key: string]: any;
  }

  const updateUserProfile = async (updates: UserProfileUpdates): Promise<void> => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updates);
      setUserProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...updates,
          name: updates.name !== undefined ? updates.name : prev.name,
          phone: updates.phone !== undefined ? updates.phone : prev.phone,
        };
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSave = async () => {
    const { isValid } = validateInputs(tempName, tempPhone);
    if (!isValid) {
      alert('Please correct the errors before saving.');
      return;
    }
    // Combine country code and phone number for saving
    const fullPhoneNumberToSave = `${selectedCountryCode}${tempPhone}`;

    try {
      await updateUserProfile({ name: tempName, phone: fullPhoneNumberToSave });
      setName(tempName);
      setPhone(tempPhone); // Store just the number part in local state after saving
      setIsEditing(false);
      alert('Profile updated');
    } catch {
      alert('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs = ['Personal Info', 'Favourite', 'My Reviews', 'Settings', 'Supports', 'Invite Friends'];

  // Filtered countries for the dropdown search, limited to 5 results
  const filteredCountries = countriesData.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.dial_code.includes(countrySearchTerm)
  ).slice(0, 5); // Limit to top 5 relevant results

  const renderTabContent = () => {
    if (activeTab === 'Personal Info') {
      const currentCountry = countriesData.find(country => country.dial_code === selectedCountryCode);

      return (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={() => validateInputs(tempName, tempPhone)}
                  className={`w-full border rounded px-3 py-2 focus:ring focus:border-blue-300 ${
                    nameError ? 'border-red-500' : ''
                  }`}
                />
                {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
              </>
            ) : (
              <p className="text-gray-800">{name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            {isEditing ? (
              <div className="flex relative" ref={countryDropdownRef}>
                <div
                  className={`flex items-center border border-gray-300 rounded-l-md px-3 py-2 cursor-pointer
                    ${showCountryDropdown ? 'rounded-b-none' : ''} ${phoneError ? 'border-red-500' : ''}`}
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  {currentCountry?.flag && (
                    <img src={currentCountry.flag} alt={currentCountry.name} className="w-5 h-4 mr-2" />
                  )}
                  <span className="text-gray-700">{selectedCountryCode}</span>
                  <svg
                    className="w-4 h-4 ml-2 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  onBlur={() => validateInputs(tempName, tempPhone)}
                  className={`flex-grow border border-l-0 rounded-r-md px-3 py-2 focus:ring focus:border-blue-300 ${
                    phoneError ? 'border-red-500' : ''
                  }`}
                  placeholder="Phone number"
                />

                {showCountryDropdown && (
                  <div className="absolute z-10 w-full md:w-80 bg-white border border-gray-300 rounded-md shadow-lg mt-12 left-0 max-h-60 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search country..."
                      className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:border-blue-300"
                      value={countrySearchTerm}
                      onChange={(e) => setCountrySearchTerm(e.target.value)}
                    />
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <div
                          key={country.dial_code}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedCountryCode(country.dial_code);
                            setShowCountryDropdown(false);
                            setCountrySearchTerm(''); // Clear search on selection
                          }}
                        >
                          {country.flag && (
                            <img src={country.flag} alt={country.name} className="w-5 h-4 mr-2" />
                          )}
                          <span className="text-gray-800 mr-2">{country.dial_code}</span>
                          <span className="text-gray-600 truncate">{country.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No matching countries found.</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-800">{userProfileState?.phone || 'N/A'}</p>
            )}
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <p className="text-gray-800">{currentUser?.email || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Total Bookings</label>
            <p className="text-gray-800">{userProfileState?.totalbookings || 0}</p>
          </div>

          <div className="text-right">
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={!!nameError || !!phoneError} // Disable if any error exists
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                  (!!nameError || !!phoneError) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      );
    }

    return <div className="mt-6 text-center text-gray-500">This section is coming soon.</div>;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        {/* Using staticBgImage directly */}
        <img src={staticBgImage} alt="Background" className="w-full h-48 object-cover" />
        {/* Removed the 'Change BG' label and input */}

        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {/* User SVG icon on a round background */}
            <div className="w-24 h-24 rounded-full border-4 border-white object-cover shadow flex items-center justify-center bg-blue-100 text-blue-600">
              <User size={48} /> {/* Lucide-react User icon */}
            </div>
            {/* Removed the label for profile image upload */}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
      </div>

      <div className="flex flex-wrap justify-center mt-6 gap-3 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === tab ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6">{renderTabContent()}</div>

      {activeTab === 'Settings' && (
        <div className="p-4 space-y-3">
          {[
            { icon: '&#128276;', label: 'Notifications' }, // Bell emoji
            { icon: '&#128179;', label: 'Payment Methods' }, // Credit card emoji
            { icon: '&#128272;', label: 'Privacy Shortcuts' }, // Lock emoji
            { icon: '&#127760;', label: 'Languages' }, // Globe emoji
            { icon: '&#128682;', label: 'Log Out', color: 'text-red-500', action: handleLogout }, // Door emoji
          ].map((item) => (
            <div
              key={item.label}
              onClick={item.action}
              className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 ${item.color || ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span className="font-medium">{item.label}</span>
              </div>
              <span>&#10095;</span> {/* Right arrow unicode */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;