import React, { useState } from 'react';
import destinationsData from '../destinations.json';

const HotelSearch = () => {
  const today = new Date().toISOString().split("T")[0];

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

    if (value) {
        const mappedDestinations: Destination[] = (destinationsData as { name: string; code: string }[]).map(dest => ({
            city: dest.name,
            country: dest.code
        }));
        const filtered = mappedDestinations.filter(dest =>
            dest.city.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDestinations(filtered.slice(0, 5));
    } else {
        setFilteredDestinations([]);
    }
};

interface HandleChildAgeChange {
    (index: number, value: string): void;
}

const handleChildAgeChange: HandleChildAgeChange = (index, value) => {
    setHotelChildAges((prev) => ({ ...prev, [index]: value }));
};

  const handleSearch = () => {
    console.log({
      destination,
      hotelCheckIn,
      hotelCheckOut,
      hotelRooms,
      hotelAdults,
      hotelChildren,
      hotelChildAges,
      hotelPriceRange,
    });
    // Add navigation or fetch logic
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Search Hotels</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Destination */}
        <div className="relative">
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
        </div>

        {/* Check-in / Check-out */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Check-in</label>
          <input
            type="date"
            className="border p-3 rounded w-full"
            min={today}
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
            min={hotelCheckIn || today}
            value={hotelCheckOut}
            onChange={(e) => setHotelCheckOut(e.target.value)}
            disabled={!hotelCheckIn}
          />
        </div>

        {/* Room, Adults, Children */}
        <div>
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
        </div>

        {/* Age of each child */}
        {Array.from({ length: hotelChildren }, (_, index) => (
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
        ))}

        {/* Price Filter */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Price Range</label>
          <select className="border p-3 rounded w-full" value={hotelPriceRange} onChange={(e) => setHotelPriceRange(e.target.value)}>
            <option value="">Any</option>
            <option value="0-1500">₹0 - ₹1500</option>
            <option value="1500-2500">₹1500 - ₹2500</option>
            <option value="2500+">₹2500+</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
      >
        Search Hotels
      </button>
    </div>
  );
};

export default HotelSearch;