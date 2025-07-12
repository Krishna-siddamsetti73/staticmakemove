import React, { useState } from 'react';
const HotelsSearch = () => {
  const minDate = new Date().toISOString().split("T")[0];

  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Traveller variables
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold">Search Hotels</h2>

      <input
        className="border p-3 rounded w-full"
        placeholder="City, Property Name, or Location"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border p-3 rounded w-full"
          type="date"
          placeholder="Check-in"
          min={minDate}
          value={hotelCheckIn}
          onChange={(e) => {
            setHotelCheckIn(e.target.value);
            if (hotelCheckOut && e.target.value >= hotelCheckOut) {
              setHotelCheckOut("");
            }
          }}
        />
        <input
          className="border p-3 rounded w-full"
          type="date"
          placeholder="Check-out"
          min={hotelCheckIn || minDate}
          value={hotelCheckOut}
          onChange={(e) => setHotelCheckOut(e.target.value)}
          disabled={!hotelCheckIn}
        />
      </div>

      {/* Rooms & Guests Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="border px-4 py-3 rounded w-full text-left bg-white"
        >
          {rooms} Room{rooms > 1 && "s"}, {adults} Adult{adults > 1 && "s"},{" "}
          {children} Child{children > 1 && "ren"}, {infants} Infant
        </button>

        {showDropdown && (
          <div className="absolute bg-white border rounded shadow-md w-full mt-2 z-10 p-4 space-y-4">

            {/* Rooms */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Rooms</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >-</button>
                <span>{rooms}</span>
                <button
                  onClick={() => setRooms(rooms + 1)}
                  className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >+</button>
              </div>
            </div>

            {/* Adults */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Adult</p>
                <p className="text-xs text-gray-500">12+ Years</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >-</button>
                <span>{adults}</span>
                <button
                  onClick={() => setAdults(adults + 1)}
                  className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >+</button>
              </div>
            </div>

            {/* Children */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Children</p>
                <p className="text-xs text-gray-500">2-11 Years</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >-</button>
                <span>{children}</span>
                <button
                  onClick={() => setChildren(children + 1)}
                  className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >+</button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Infant</p>
                <p className="text-xs text-gray-500">Under 2 Years</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setInfants(Math.max(0, infants - 1))}
                  className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >-</button>
                <span>{infants}</span>
                <button
                  onClick={() => setInfants(infants + 1)}
                  className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >+</button>
              </div>
            </div>

            {/* Class Dropdown */}
            <div>
              <p className="font-medium mb-1">Class</p>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>

            <button
              onClick={() => setShowDropdown(false)}
              className="bg-blue-600 text-white w-full py-2 rounded font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold w-full">
        Search Hotels
      </button>
    </div>
  );
}
export default HotelsSearch;
