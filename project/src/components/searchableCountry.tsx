import React, { useState, useEffect, useCallback, useRef } from 'react';
import countriesData from './countryandflags.json';
import { MapPin } from 'lucide-react';

interface Country {
  name: string;
  dial_code: string;
  flag: string;
  currency_name: string;
  currency_symbol: string;
}

interface SearchableCountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  error?: string;
}

const SearchableCountrySelect: React.FC<SearchableCountrySelectProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const countries = countriesData as Country[];

  // Sync internal search term with parent value
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);

  const filteredCountries = countries
    .filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  const handleSelect = useCallback((countryName: string) => {
    onChange(countryName);
    setSearchTerm(countryName); // Update local state immediately
    setIsOpen(false);
    inputRef.current?.focus(); // Keep focus on the input after selection for a seamless experience
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    // A small delay to allow for a click on a list item to register
    setTimeout(() => {
      setIsOpen(false);
      const isCountryValid = countries.some(country => country.name.toLowerCase() === searchTerm.toLowerCase());
      if (!isCountryValid && searchTerm !== '') {
        setSearchTerm('');
        onChange('');
      } else if (isCountryValid && searchTerm.toLowerCase() !== value.toLowerCase()) {
        const selectedCountry = countries.find(c => c.name.toLowerCase() === searchTerm.toLowerCase());
        if (selectedCountry) {
          onChange(selectedCountry.name);
          setSearchTerm(selectedCountry.name);
        }
      }
      onBlur();
    }, 100);
  }, [searchTerm, countries, onBlur, value, onChange]);

  const handleInputFocus = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      // Set the search term to the current value on focus, allowing the user to search again
      if (value) {
        setSearchTerm(value);
      }
    }
  }, [disabled, value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent the input from blurring when the dropdown list is clicked
    e.preventDefault();
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label htmlFor="destination-search" className="block text-sm font-medium text-gray-700 mb-2">
        Preferred Destination *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="destination-search"
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder="Search for a country..."
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
          } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
          autoComplete="off"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      {isOpen && !disabled && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <li
                key={country.name}
                onMouseDown={handleMouseDown}
                onClick={() => handleSelect(country.name)}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              >
                <img
                  src={country.flag}
                  alt={`${country.name} flag`}
                  className="h-4 w-6 rounded border border-gray-200"
                />
                <span>{country.name}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 text-sm">
              No matching countries found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableCountrySelect;