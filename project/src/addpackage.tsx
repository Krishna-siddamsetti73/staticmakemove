import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../src/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Import the JSON file directly
import countriesData from '../src/components/countryandflags.json';

// Define the type for a country from the JSON
type Country = {
  name: string;
  dial_code: string;
  flag: string;
};

const countries: Country[] = countriesData; // Use the imported data for countries

const monthRanges = [
  'January - February', 'February - March', 'March - April', 'April - May',
  'May - June', 'June - July', 'July - August', 'August - September',
  'September - October', 'October - November', 'November - December', 'December - January',
  'Other',
];

const difficulties = ['Easy', 'Medium', 'Hard', 'Extreme', 'Other'];

const categories = ['Adventure', 'Beach', 'Family', 'Romantic', 'Wildlife', 'Heritage', 'Pilgrimage', 'Hill Station', 'Other'];

const ratings = Array.from({ length: 20 }, (_, i) => (3.1 + i * 0.1).toFixed(1));

const groupSizes = ['1-2 people', '2-5 people', '5-10 people', '10-20 people', 'Other'];

type PackageArrayKeys = 'images' | 'included' | 'excluded' | 'highlights';

const AddPackage = () => {
  const [packageData, setPackageData] = useState({
    title: '',
    description: '',
    image: '', // Main image URL
    images: [] as string[], // Array of additional image URLs
    location: '',
    duration: '',
    price: '',
    rating: '',
    category: '',
    bestTime: '',
    difficulty: '',
    groupSize: '',
    featured: false,
    included: [] as string[],
    excluded: [] as string[],
    highlights: [] as string[],
    itinerary: [] as { day: number; title: string; description: string; activities: string[] }[],
  });

  const [otherInputs, setOtherInputs] = useState({ category: '', bestTime: '', difficulty: '', groupSize: '' });
  const [itineraryItem, setItineraryItem] = useState({ day: 1, title: '', description: '', activities: [] as string[] });
  const [activity, setActivity] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // For adding individual images to the 'images' array
  const [includedItem, setIncludedItem] = useState('');
  const [excludedItem, setExcludedItem] = useState('');
  const [highlightItem, setHighlightItem] = useState('');

  // State for country search dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // State to track if a field has been touched (to show errors only after interaction)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // Helper functions for validation
  const containsNumeric = (val: string) => /\d/.test(val);
  const containsSpecialChars = (val: string) => !/^[a-zA-Z0-9\s.,'"&()!@#$%^*-]+$/.test(val); // Allows common punctuation + some symbols
  const isOnlyNumeric = (val: string) => /^\d+$/.test(val.trim());
  const isOnlySpecialChars = (val: string) => !/^[a-zA-Z0-9\s]+$/.test(val.trim()) && val.trim() !== ''; // Checks if it's only special chars, or empty after trim


  // Validate a single field
  const validateField = (
    name: string,
    value: any,
    currentPackageData: typeof packageData,
    currentOtherInputs: typeof otherInputs,
    currentItinerary: typeof itineraryItem,
    currentImageUrl: string,
    currentHighlightItem: string, // Add this parameter
    currentIncludedItem: string, // Add this parameter
    currentExcludedItem: string, // Add this parameter
    currentActivity: string // Add this parameter
  ) => {
    let error = '';

    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title cannot be empty.';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Title can only contain alphabets and spaces.';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Description cannot be empty.';
        } else if (containsNumeric(value)) {
          error = 'Description cannot contain numbers.';
        } else if (containsSpecialChars(value)) {
          error = 'Description contains invalid special characters.';
        }
        break;
      case 'image': // Main image validation
        if (!value.trim()) {
          error = 'Main image URL cannot be empty.';
        } else if (!/^https?:\/\/\S+\.(png|jpe?g|gif|svg)$/i.test(value)) {
          error = 'Please enter a valid image URL (png, jpg, jpeg, gif, svg).';
        }
        break;
      case 'location':
        if (!value) {
          error = 'Please select a location.';
        }
        break;
      case 'duration':
        if (!value.trim()) {
          error = 'Duration cannot be empty.';
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = 'Duration must be a positive number.';
        }
        break;
      case 'price':
        if (!value.trim()) {
          error = 'Price cannot be empty.';
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = 'Price must be a positive number.';
        }
        break;
      case 'rating':
        if (!value) {
          error = 'Please select a rating.';
        }
        break;
      case 'category':
        if (!value || (value === 'Other' && !currentOtherInputs.category.trim())) {
          error = 'Please select a category or enter a custom one.';
        }
        break;
      case 'bestTime':
        if (!value) {
          error = 'Please select a best time or enter a custom one.';
        } else if (value === 'Other' && !currentOtherInputs.bestTime.trim()) {
          error = 'Please enter a custom best time.';
        } else if (value === 'Other' && !/^[A-Za-z]+ - [A-Za-z]+$/.test(currentOtherInputs.bestTime.trim())) {
          error = 'Best time must be in "Month - Month" format (e.g., "January - March").';
        }
        break;
      case 'difficulty':
        if (!value || (value === 'Other' && !currentOtherInputs.difficulty.trim())) {
          error = 'Please select a difficulty or enter a custom one.';
        }
        break;
      case 'groupSize':
        if (!value) {
          error = 'Please select a group size or enter a custom one.';
        } else if (value === 'Other' && !currentOtherInputs.groupSize.trim()) {
          error = 'Please enter a custom group size.';
        } else if (value === 'Other' && !/^\d+-\d+$/.test(currentOtherInputs.groupSize.trim())) {
          error = 'Group size must be in "number-number" format (e.g., "10-20").';
        }
        break;
      case 'images': // Additional images validation
        if (currentPackageData.images.length === 0 && !currentImageUrl.trim()) {
          error = 'At least one additional image URL is required.';
        } else if (currentImageUrl.trim() && !/^https?:\/\/\S+\.(png|jpe?g|gif|svg)$/i.test(currentImageUrl)) {
          error = 'Please enter a valid image URL (png, jpg, jpeg, gif, svg).';
        }
        break;
      case 'included':
        if (currentPackageData.included.length === 0) {
          error = 'At least one included item is required.';
        } else if (currentIncludedItem && containsNumeric(currentIncludedItem)) {
            error = 'Included item cannot contain numbers.';
        } else if (currentIncludedItem && containsSpecialChars(currentIncludedItem)) {
            error = 'Included item contains invalid special characters.';
        }
        break;
      case 'excluded':
        if (currentPackageData.excluded.length === 0) {
          error = 'At least one excluded item is required.';
        } else if (currentExcludedItem && containsNumeric(currentExcludedItem)) {
            error = 'Excluded item cannot contain numbers.';
        } else if (currentExcludedItem && containsSpecialChars(currentExcludedItem)) {
            error = 'Excluded item contains invalid special characters.';
        }
        break;
      case 'highlights':
        if (currentPackageData.highlights.length === 0) {
            error = 'At least one highlight is required.';
        } else if (currentHighlightItem) { // Only validate the highlightItem input if it's not empty
            if (isOnlyNumeric(currentHighlightItem)) {
                error = 'Highlight cannot be only numbers.';
            } else if (isOnlySpecialChars(currentHighlightItem)) {
                error = 'Highlight cannot be only special characters.';
            } else if (containsSpecialChars(currentHighlightItem)) {
                error = 'Highlight contains invalid special characters.';
            }
        }
        break;
      case 'activity':
        if (currentActivity && containsNumeric(currentActivity)) {
          error = 'Activity cannot contain numbers.';
        } else if (currentActivity && containsSpecialChars(currentActivity)) {
          error = 'Activity contains invalid special characters.';
        }
        break;
      case 'itinerary':
        if (currentPackageData.itinerary.length === 0) {
          error = 'At least one itinerary item is required.';
        }
        break;
      case 'itineraryTitle': // For validation of itinerary item's title
        if (!value.trim()) {
          error = 'Itinerary title cannot be empty.';
        } else if (containsNumeric(value)) {
          error = 'Itinerary title cannot contain numbers.';
        } else if (containsSpecialChars(value)) {
          error = 'Itinerary title contains invalid special characters.';
        }
        break;
      case 'itineraryDescription': // For validation of itinerary item's description
        if (!value.trim()) {
          error = 'Itinerary description cannot be empty.';
        } else if (containsNumeric(value)) {
          error = 'Itinerary description cannot contain numbers.';
        } else if (containsSpecialChars(value)) {
          error = 'Itinerary description contains invalid special characters.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Handle all input changes
  const handleChange = (key: string, value: any) => {
    setPackageData((prev) => ({ ...prev, [key]: value }));
    // If the field has been touched, re-validate immediately
    if (touched[key]) {
      const error = validateField(key, value, { ...packageData, [key]: value }, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
      setErrors((prev) => ({ ...prev, [key]: error }));
    }

    // If 'Other' is selected for a dropdown, clear the custom input for that field
    if (key === 'category' && value !== 'Other') setOtherInputs(prev => ({ ...prev, category: '' }));
    if (key === 'bestTime' && value !== 'Other') setOtherInputs(prev => ({ ...prev, bestTime: '' }));
    if (key === 'difficulty' && value !== 'Other') setOtherInputs(prev => ({ ...prev, difficulty: '' }));
    if (key === 'groupSize' && value !== 'Other') setOtherInputs(prev => ({ ...prev, groupSize: '' }));
  };

  // Handle blur event to mark a field as touched and trigger validation
  const handleBlur = (key: string, value?: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const error = validateField(key, value !== undefined ? value : packageData[key as keyof typeof packageData], packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  // Handle "Other" input changes
  const handleOtherInputChange = (key: string, value: string) => {
    setOtherInputs((prev) => ({ ...prev, [key]: value }));
    // If the custom 'Other' input is touched, re-validate the parent dropdown
    if (touched[key]) {
      const parentKey = key as 'category' | 'bestTime' | 'difficulty' | 'groupSize'; // Ensure type safety
      const error = validateField(parentKey, 'Other', packageData, { ...otherInputs, [key]: value }, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
      setErrors((prev) => ({ ...prev, [parentKey]: error }));
    }
  };

  // Validate and add item to array fields (images, included, excluded, highlights)
  const addItemToArray = (key: PackageArrayKeys, value: string, clear: Function) => {
    let error = '';

    if (value.trim() === '') {
      error = `Please enter a value for ${key.slice(0, -1)}.`;
    } else if (key === 'images' && !/^https?:\/\/\S+\.(png|jpe?g|gif|svg)$/i.test(value)) {
      error = 'Please enter a valid image URL (png, jpg, jpeg, gif, svg).';
    } else if ((key === 'included' || key === 'excluded') && containsNumeric(value)) {
        error = `${key.slice(0, -1)} item cannot contain numbers.`
    } else if ((key === 'included' || key === 'excluded') && containsSpecialChars(value)) {
        error = `${key.slice(0, -1)} item contains invalid special characters.`
    } else if (key === 'highlights') {
        if (isOnlyNumeric(value)) {
            error = 'Highlight cannot be only numbers.';
        } else if (isOnlySpecialChars(value)) {
            error = 'Highlight cannot be only special characters.';
        } else if (containsSpecialChars(value)) {
            error = 'Highlight contains invalid special characters.';
        }
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }));
      return;
    }

    setPackageData((prev) => ({ ...prev, [key]: [...prev[key], value] }));
    clear('');
    setErrors((prev) => ({ ...prev, [key]: '' })); // Clear error once an item is added
  };

  const addActivity = () => {
    let error = '';
    if (activity.trim() === '') {
        error = 'Activity cannot be empty.';
    } else if (containsNumeric(activity)) {
        error = 'Activity cannot contain numbers.';
    } else if (containsSpecialChars(activity)) {
        error = 'Activity contains invalid special characters.';
    }

    if (error) {
        setErrors(prev => ({...prev, activity: error}));
        return;
    }

    setItineraryItem((prev) => ({ ...prev, activities: [...prev.activities, activity] }));
    setActivity('');
    setErrors(prev => ({...prev, activity: ''})); // Clear activity error
  };

  const addItineraryItem = () => {
    let hasError = false;
    let newErrors = { ...errors };

    // Validate itinerary title
    const itineraryTitleError = validateField('itineraryTitle', itineraryItem.title, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
    if (itineraryTitleError) {
        newErrors.itineraryTitle = itineraryTitleError;
        hasError = true;
    } else {
        delete newErrors.itineraryTitle;
    }

    // Validate itinerary description
    const itineraryDescriptionError = validateField('itineraryDescription', itineraryItem.description, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
    if (itineraryDescriptionError) {
        newErrors.itineraryDescription = itineraryDescriptionError;
        hasError = true;
    } else {
        delete newErrors.itineraryDescription;
    }

    setErrors(newErrors);

    if (hasError) {
      alert('Please fill itinerary title and description correctly (no numbers or invalid special characters).');
      return;
    }

    setPackageData((prev) => ({ ...prev, itinerary: [...prev.itinerary, itineraryItem] }));
    setItineraryItem({ day: itineraryItem.day + 1, title: '', description: '', activities: [] });
    setErrors((prev) => ({ ...prev, itinerary: '' })); // Clear overall itinerary error
  };

  // Effect to update form validity whenever packageData, otherInputs, or errors change
  useEffect(() => {
    const allFields = [
      'title', 'description', 'image', 'location', 'duration', 'price', 'rating',
      'category', 'bestTime', 'difficulty', 'groupSize', 'images', 'included',
      'excluded', 'highlights', 'itinerary'
    ];

    let currentFormValid = true;
    const currentErrors: { [key: string]: string } = {};

    allFields.forEach(field => {
      let valueForValidation;
      if (field === 'images') {
        valueForValidation = imageUrl; // For initial images validation, check the input field
      } else if (field === 'included') {
          valueForValidation = includedItem;
      } else if (field === 'excluded') {
          valueForValidation = excludedItem;
      } else if (field === 'highlights') {
          valueForValidation = highlightItem;
      } else if (['itinerary'].includes(field)) {
        valueForValidation = (packageData[field as PackageArrayKeys] as any).length > 0;
        if (!valueForValidation) {
            currentErrors[field] = validateField(field, valueForValidation, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
            currentFormValid = false;
        }
      } else {
        valueForValidation = packageData[field as keyof typeof packageData];
      }

      const error = validateField(field, valueForValidation, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
      if (error) {
        currentErrors[field] = error;
        currentFormValid = false;
      }
    });

    // Specific checks for 'Other' inputs if they are selected in dropdowns
    if (packageData.category === 'Other' && !otherInputs.category.trim()) {
      currentErrors.category = 'Please enter a custom category.';
      currentFormValid = false;
    }
    if (packageData.bestTime === 'Other') {
        if (!otherInputs.bestTime.trim()) {
            currentErrors.bestTime = 'Please enter a custom best time.';
            currentFormValid = false;
        } else if (!/^[A-Za-z]+ - [A-Za-z]+$/.test(otherInputs.bestTime.trim())) {
            currentErrors.bestTime = 'Best time must be in "Month - Month" format (e.g., "January - March").';
            currentFormValid = false;
        }
    }
    if (packageData.difficulty === 'Other' && !otherInputs.difficulty.trim()) {
      currentErrors.difficulty = 'Please enter a custom difficulty.';
      currentFormValid = false;
    }
    if (packageData.groupSize === 'Other') {
        if (!otherInputs.groupSize.trim()) {
            currentErrors.groupSize = 'Please enter a custom group size.';
            currentFormValid = false;
        } else if (!/^\d+-\d+$/.test(otherInputs.groupSize.trim())) {
            currentErrors.groupSize = 'Group size must be in "number-number" format (e.g., "10-20").';
            currentFormValid = false;
        }
    }

    setIsFormValid(currentFormValid && Object.values(currentErrors).every(err => !err)); // Only valid if all fields are valid and no existing errors
  }, [packageData, otherInputs, imageUrl, includedItem, excludedItem, highlightItem, itineraryItem, errors, activity]);


  const handleSubmit = async () => {
    // Perform a full validation on submit
    const allFields = [
      'title', 'description', 'image', 'location', 'duration', 'price', 'rating',
      'category', 'bestTime', 'difficulty', 'groupSize', 'images', 'included',
      'excluded', 'highlights', 'itinerary'
    ];

    let formHasErrors = false;
    const newErrors: { [key: string]: string } = {};

    // First, validate all individual fields and populate `newErrors`
    allFields.forEach(field => {
      let valueForValidation;
      if (field === 'images') {
        valueForValidation = imageUrl;
      } else if (field === 'included') {
          valueForValidation = includedItem;
      } else if (field === 'excluded') {
          valueForValidation = excludedItem;
      } else if (field === 'highlights') {
          valueForValidation = highlightItem;
      } else if (field === 'activity') {
          valueForValidation = activity;
      } else if (['itinerary'].includes(field)) {
        valueForValidation = (packageData[field as PackageArrayKeys] as any).length > 0;
      } else {
        valueForValidation = packageData[field as keyof typeof packageData];
      }

      const error = validateField(field, valueForValidation, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
      if (error) {
        newErrors[field] = error;
        formHasErrors = true;
      }
      setTouched((prev) => ({ ...prev, [field]: true })); // Mark all fields as touched on submit
    });

    // Also validate 'Other' custom inputs
    if (packageData.category === 'Other' && !otherInputs.category.trim()) {
        newErrors.category = 'Please enter a custom category.';
        formHasErrors = true;
        setTouched(prev => ({ ...prev, category: true }));
    }
    if (packageData.bestTime === 'Other') {
        if (!otherInputs.bestTime.trim()) {
            newErrors.bestTime = 'Please enter a custom best time.';
            formHasErrors = true;
            setTouched(prev => ({ ...prev, bestTime: true }));
        } else if (!/^[A-Za-z]+ - [A-Za-z]+$/.test(otherInputs.bestTime.trim())) {
            newErrors.bestTime = 'Best time must be in "Month - Month" format (e.g., "January - March").';
            formHasErrors = true;
            setTouched(prev => ({ ...prev, bestTime: true }));
        }
    }
    if (packageData.difficulty === 'Other' && !otherInputs.difficulty.trim()) {
        newErrors.difficulty = 'Please enter a custom difficulty.';
        formHasErrors = true;
        setTouched(prev => ({ ...prev, difficulty: true }));
    }
    if (packageData.groupSize === 'Other') {
        if (!otherInputs.groupSize.trim()) {
            newErrors.groupSize = 'Please enter a custom group size.';
            formHasErrors = true;
            setTouched(prev => ({ ...prev, groupSize: true }));
        } else if (!/^\d+-\d+$/.test(otherInputs.groupSize.trim())) {
            newErrors.groupSize = 'Group size must be in "number-number" format (e.g., "10-20").';
            formHasErrors = true;
            setTouched(prev => ({ ...prev, groupSize: true }));
        }
    }

    // Validate the current itinerary item's title and description if not yet added to main itinerary
    if (itineraryItem.title.trim() || itineraryItem.description.trim()) {
        const itineraryTitleError = validateField('itineraryTitle', itineraryItem.title, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
        if (itineraryTitleError) {
            newErrors.itineraryTitle = itineraryTitleError;
            formHasErrors = true;
            setTouched(prev => ({ ...prev, itineraryTitle: true }));
        }
        const itineraryDescriptionError = validateField('itineraryDescription', itineraryItem.description, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
        if (itineraryDescriptionError) {
            newErrors.itineraryDescription = itineraryDescriptionError;
            formHasErrors = true;
            setTouched(prev => ({ ...prev, itineraryDescription: true }));
        }
    }


    setErrors(newErrors); // Update the errors state for display

    // Check overall form validity again
    const finalFormValidity = Object.values(newErrors).every(err => !err) && !formHasErrors;

    if (!finalFormValidity) {
      alert('Please fill all required fields and correct any errors before submitting.');
      return;
    }

    try {
      // Create a temporary packageData object, substituting 'Other' values if they exist
      const finalPackageData = {
        ...packageData,
        category: packageData.category === 'Other' ? otherInputs.category : packageData.category,
        bestTime: packageData.bestTime === 'Other' ? otherInputs.bestTime : packageData.bestTime,
        difficulty: packageData.difficulty === 'Other' ? otherInputs.difficulty : packageData.difficulty,
        groupSize: packageData.groupSize === 'Other' ? otherInputs.groupSize : packageData.groupSize,
      };

      await addDoc(collection(db, 'packages'), finalPackageData);
      alert('Package Added Successfully');
      navigate('/packages');
    } catch (err) {
      console.error(err);
      alert('Error adding package');
    }
  };

  // Filtered countries for the dropdown search
  const filteredCountries = countries
    .filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5); // Limit to max 5 results

  // Handle clicks outside the country dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Package</h2>
      <div className="grid grid-cols-2 gap-4">

        <div>
          <input
            className={`border p-2 w-full ${touched.title && errors.title ? 'border-red-500' : ''}`}
            placeholder="Title"
            value={packageData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
          />
          {touched.title && errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            className={`border p-2 w-full ${touched.category && errors.category ? 'border-red-500' : ''}`}
            value={packageData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            aria-label="Category"
            title="Category"
          >
            <option value="">Select Category</option>
            {categories.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
          </select>
          {touched.category && errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          {packageData.category === 'Other' && (
            <input
              className={`border p-2 w-full mt-2 ${touched.category && errors.category ? 'border-red-500' : ''}`}
              placeholder="Enter Category"
              value={otherInputs.category}
              onChange={(e) => handleOtherInputChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
            />
          )}
        </div>

        <div className="col-span-2">
          <textarea
            className={`border p-2 w-full ${touched.description && errors.description ? 'border-red-500' : ''}`}
            placeholder="Description"
            value={packageData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
          />
          {touched.description && errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <input
            className={`border p-2 w-full ${touched.image && errors.image ? 'border-red-500' : ''}`}
            placeholder="Main Image URL"
            value={packageData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            onBlur={() => handleBlur('image')}
          />
          {touched.image && errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Country Searchable Dropdown */}
        <div className="relative" ref={countryDropdownRef}>
          <input
            type="text"
            className={`border p-2 w-full ${touched.location && errors.location ? 'border-red-500' : ''}`}
            placeholder="Search Location"
            value={packageData.location || searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleChange('location', ''); // Clear selected location when searching
              setShowCountryDropdown(true);
            }}
            onFocus={() => setShowCountryDropdown(true)}
            onBlur={() => handleBlur('location', packageData.location)} // Validate on blur
          />
          {packageData.location && !searchTerm && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <img src={countries.find(c => c.name === packageData.location)?.flag} alt="flag" className="w-5 h-5 mr-2" />
              <span className="text-gray-700">{packageData.location}</span>
            </div>
          )}

          {showCountryDropdown && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto shadow-lg">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleChange('location', country.name);
                      setSearchTerm(country.name); // Set search term to selected country name
                      setShowCountryDropdown(false);
                      setTouched(prev => ({ ...prev, location: true })); // Mark as touched on selection
                      setErrors(prev => ({ ...prev, location: '' })); // Clear error
                    }}
                  >
                    <img src={country.flag} alt={country.name} className="w-5 h-5 mr-2" />
                    <span>{country.name}</span>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No countries found</div>
              )}
            </div>
          )}
          {touched.location && errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>


        <div>
          <input
            className={`border p-2 w-full ${touched.duration && errors.duration ? 'border-red-500' : ''}`}
            placeholder="Duration (in days)"
            value={packageData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            onBlur={() => handleBlur('duration')}
          />
          {touched.duration && errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
        </div>

        <div>
          <input
            className={`border p-2 w-full ${touched.price && errors.price ? 'border-red-500' : ''}`}
            placeholder="Price"
            value={packageData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            onBlur={() => handleBlur('price')}
          />
          {touched.price && errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <select
            className={`border p-2 w-full ${touched.rating && errors.rating ? 'border-red-500' : ''}`}
            value={packageData.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            onBlur={() => handleBlur('rating')}
            aria-label="Rating"
            title="Rating"
          >
            <option value="">Select Rating</option>
            {ratings.map((r, idx) => <option key={idx} value={r}>{r}</option>)}
          </select>
          {touched.rating && errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
        </div>

        <div>
          <select
            className={`border p-2 w-full ${touched.bestTime && errors.bestTime ? 'border-red-500' : ''}`}
            value={packageData.bestTime}
            onChange={(e) => handleChange('bestTime', e.target.value)}
            onBlur={() => handleBlur('bestTime')}
            aria-label="Best Time"
            title="Best Time"
          >
            <option value="">Select Best Time</option>
            {monthRanges.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
          </select>
          {touched.bestTime && errors.bestTime && <p className="text-red-500 text-sm mt-1">{errors.bestTime}</p>}
          {packageData.bestTime === 'Other' && (
            <input
              className={`border p-2 w-full mt-2 ${touched.bestTime && errors.bestTime ? 'border-red-500' : ''}`}
              placeholder="Enter Best Time (e.g., January - March)"
              value={otherInputs.bestTime}
              onChange={(e) => handleOtherInputChange('bestTime', e.target.value)}
              onBlur={() => handleBlur('bestTime')}
            />
          )}
        </div>

        {/* Difficulty Dropdown */}
        <div>
          <select
            className={`border p-2 w-full ${touched.difficulty && errors.difficulty ? 'border-red-500' : ''}`}
            value={packageData.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            onBlur={() => handleBlur('difficulty')}
            aria-label="Difficulty"
            title="Difficulty"
          >
            <option value="">Select Difficulty</option>
            {difficulties.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
          </select>
          {touched.difficulty && errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
          {packageData.difficulty === 'Other' && (
            <input
              className={`border p-2 w-full mt-2 ${touched.difficulty && errors.difficulty ? 'border-red-500' : ''}`}
              placeholder="Enter Difficulty"
              value={otherInputs.difficulty}
              onChange={(e) => handleOtherInputChange('difficulty', e.target.value)}
              onBlur={() => handleBlur('difficulty')}
            />
          )}
        </div>

        {/* Group Size Dropdown */}
        <div>
          <select
            className={`border p-2 w-full ${touched.groupSize && errors.groupSize ? 'border-red-500' : ''}`}
            value={packageData.groupSize}
            onChange={(e) => handleChange('groupSize', e.target.value)}
            onBlur={() => handleBlur('groupSize')}
            aria-label="Group Size"
            title="Group Size"
          >
            <option value="">Select Group Size</option>
            {groupSizes.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
          </select>
          {touched.groupSize && errors.groupSize && <p className="text-red-500 text-sm mt-1">{errors.groupSize}</p>}
          {packageData.groupSize === 'Other' && (
            <input
              className={`border p-2 w-full mt-2 ${touched.groupSize && errors.groupSize ? 'border-red-500' : ''}`}
              placeholder="Enter Group Size (e.g., 10-20)"
              value={otherInputs.groupSize}
              onChange={(e) => handleOtherInputChange('groupSize', e.target.value)}
              onBlur={() => handleBlur('groupSize')}
            />
          )}
        </div>

        <label className="flex items-center space-x-2 col-span-2">
          <input type="checkbox" checked={packageData.featured}
            onChange={(e) => handleChange('featured', e.target.checked)} />
          <span>Featured</span>
        </label>
      </div>

      {/* Images Array */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Add Images</h3>
        <div className="flex space-x-2 mb-2">
          <input
            className={`border p-2 w-full ${touched.images && errors.images ? 'border-red-500' : ''}`}
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              if (touched.images) {
                const error = validateField('images', e.target.value, packageData, otherInputs, itineraryItem, e.target.value, highlightItem, includedItem, excludedItem, activity);
                setErrors((prev) => ({ ...prev, images: error }));
              }
            }}
            onBlur={() => handleBlur('images', imageUrl)}
          />
          <button type="button" onClick={() => addItemToArray('images', imageUrl, setImageUrl)}
            className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        {touched.images && errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
        <ul className="list-disc pl-5">{packageData.images.map((img, idx) => <li key={idx}>{img}</li>)}</ul>
      </div>

      {/* Included Items */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Included</h3>
        <div className="flex space-x-2 mb-2">
          <input
            className={`border p-2 w-full ${touched.included && errors.included ? 'border-red-500' : ''}`}
            placeholder="Included Item"
            value={includedItem}
            onChange={(e) => {
              setIncludedItem(e.target.value);
              if (touched.included) {
                const error = validateField('included', e.target.value, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, e.target.value, excludedItem, activity);
                setErrors((prev) => ({ ...prev, included: error }));
              }
            }}
            onBlur={() => handleBlur('included', includedItem)}
          />
          <button type="button" onClick={() => addItemToArray('included', includedItem, setIncludedItem)}
            className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        {touched.included && errors.included && <p className="text-red-500 text-sm mt-1">{errors.included}</p>}
        <ul className="list-disc pl-5">{packageData.included.map((inc, idx) => <li key={idx}>{inc}</li>)}</ul>
      </div>

      {/* Excluded Items */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Excluded</h3>
        <div className="flex space-x-2 mb-2">
          <input
            className={`border p-2 w-full ${touched.excluded && errors.excluded ? 'border-red-500' : ''}`}
            placeholder="Excluded Item"
            value={excludedItem}
            onChange={(e) => {
              setExcludedItem(e.target.value);
              if (touched.excluded) {
                const error = validateField('excluded', e.target.value, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, e.target.value, activity);
                setErrors((prev) => ({ ...prev, excluded: error }));
              }
            }}
            onBlur={() => handleBlur('excluded', excludedItem)}
          />
          <button type="button" onClick={() => addItemToArray('excluded', excludedItem, setExcludedItem)}
            className="bg-red-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        {touched.excluded && errors.excluded && <p className="text-red-500 text-sm mt-1">{errors.excluded}</p>}
        <ul className="list-disc pl-5">{packageData.excluded.map((exc, idx) => <li key={idx}>{exc}</li>)}</ul>
      </div>

      {/* Highlights */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Highlights</h3>
        <div className="flex space-x-2 mb-2">
          <input
            className={`border p-2 w-full ${touched.highlights && errors.highlights ? 'border-red-500' : ''}`}
            placeholder="Highlight Item (Alphanumeric, no only numbers/special chars)"
            value={highlightItem}
            onChange={(e) => {
              setHighlightItem(e.target.value);
              if (touched.highlights) {
                const error = validateField('highlights', e.target.value, packageData, otherInputs, itineraryItem, imageUrl, e.target.value, includedItem, excludedItem, activity);
                setErrors((prev) => ({ ...prev, highlights: error }));
              }
            }}
            onBlur={() => handleBlur('highlights', highlightItem)}
          />
          <button type="button" onClick={() => addItemToArray('highlights', highlightItem, setHighlightItem)}
            className="bg-purple-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        {touched.highlights && errors.highlights && <p className="text-red-500 text-sm mt-1">{errors.highlights}</p>}
        <ul className="list-disc pl-5">{packageData.highlights.map((h, idx) => <li key={idx}>{h}</li>)}</ul>
      </div>

      {/* Itinerary */}
      <div className="mt-4 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Add Itinerary</h3>
        <div className="flex space-x-2 mb-2">
          <input className="border p-2 w-16" type="number" placeholder="Day" value={itineraryItem.day} onChange={(e) => setItineraryItem({ ...itineraryItem, day: Number(e.target.value) })} />
          <input
            className={`border p-2 w-1/4 ${(touched.itineraryTitle && errors.itineraryTitle) ? 'border-red-500' : ''}`}
            placeholder="Title"
            value={itineraryItem.title}
            onChange={(e) => {
              setItineraryItem({ ...itineraryItem, title: e.target.value });
              if (touched.itineraryTitle) {
                const error = validateField('itineraryTitle', e.target.value, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
                setErrors(prev => ({ ...prev, itineraryTitle: error }));
              }
            }}
            onBlur={() => setTouched(prev => ({ ...prev, itineraryTitle: true }))}
          />
          <input
            className={`border p-2 w-1/2 ${(touched.itineraryDescription && errors.itineraryDescription) ? 'border-red-500' : ''}`}
            placeholder="Description"
            value={itineraryItem.description}
            onChange={(e) => {
              setItineraryItem({ ...itineraryItem, description: e.target.value });
              if (touched.itineraryDescription) {
                const error = validateField('itineraryDescription', e.target.value, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, activity);
                setErrors(prev => ({ ...prev, itineraryDescription: error }));
              }
            }}
            onBlur={() => setTouched(prev => ({ ...prev, itineraryDescription: true }))}
          />
        </div>

        {/* Activities for itinerary */}
        <div className="flex space-x-2 mb-2">
          <input
            className={`border p-2 w-full ${touched.activity && errors.activity ? 'border-red-500' : ''}`}
            placeholder="Activity"
            value={activity}
            onChange={(e) => {
                setActivity(e.target.value);
                if (touched.activity) {
                    const error = validateField('activity', e.target.value, packageData, otherInputs, itineraryItem, imageUrl, highlightItem, includedItem, excludedItem, e.target.value);
                    setErrors(prev => ({ ...prev, activity: error }));
                }
            }}
            onBlur={() => handleBlur('activity', activity)}
          />
          <button type="button" onClick={addActivity} className="bg-blue-600 text-white px-4 py-2 rounded">Add Activity</button>
        </div>
        {touched.activity && errors.activity && <p className="text-red-500 text-sm mt-1">{errors.activity}</p>}
        <ul className="list-disc pl-5">
          {itineraryItem.activities.map((act, idx) => <li key={idx}>{act}</li>)}
        </ul>

        <button type="button" onClick={addItineraryItem} className="bg-green-600 text-white px-4 py-2 rounded mt-2">Add Itinerary Item</button>
        {touched.itinerary && errors.itinerary && <p className="text-red-500 text-sm mt-1">{errors.itinerary}</p>}

        <div className="space-y-2 mt-4">
          {packageData.itinerary.map((item, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded">
              <strong>Day {item.day}:</strong> {item.title} - {item.description}
              <ul className="list-disc pl-5">
                {item.activities.map((act, idx) => <li key={idx}>{act}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} className={`bg-indigo-600 text-white px-4 py-2 rounded mt-6 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isFormValid}>Add Package</button>
    </div>
  );
};
export default AddPackage;