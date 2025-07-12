import React, { act, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

type GuestData = {
  rooms: number;
  adults: number;
  children: number;
  childrenAges: number[];
};

type RoomGuestSelectorProps = {
  label?: string;
   activeTab: string;
  onChange: (data: GuestData) => void;
};

const RoomGuestSelector: React.FC<RoomGuestSelectorProps> = ({
  label,
  activeTab,
 
  onChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
   const [trainClass, setTrainClass] = useState('AC 3 Tier (3A)');
  const [cabType, setCabType] = useState('Sedan');
  const [busType, setBusType] = useState('Sleeper');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange({ rooms, adults, children, childrenAges });
  }, [rooms, adults, children, childrenAges, onChange]);

  useEffect(() => {
    // Adjust childrenAges array based on children count
    setChildrenAges((prev) => {
      const newAges = [...prev];
      if (children > prev.length) {
        for (let i = prev.length; i < children; i++) {
          newAges.push(5); // default age
        }
      } else {
        newAges.length = children;
      }
      return newAges;
    });
  }, [children]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Counter = ({
    label,
    value,
    setValue,
    min = 0,
  }: {
    label: string;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    min?: number;
  }) => (
    <div className="flex items-center justify-between mb-3">
      <span>{label}</span>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setValue((prev) => Math.max(min, prev - 1))}
          className="p-1 border rounded disabled:opacity-30"
          disabled={value === min}
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) =>
            setValue(Math.max(min, parseInt(e.target.value) || min))
          }
          className="w-12 text-center border rounded"
        />
        <button
          type="button"
          onClick={() => setValue((prev) => prev + 1)}
          className="p-1 border rounded"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <div
        className="border p-3 rounded w-full cursor-pointer flex justify-between items-center"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
          <span>
          {activeTab === 'Trains'
            ?  `${trainClass} Class ,${adults} Adult${adults > 1 ? 's' : ''}${
                children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''
              }`
            : activeTab === 'Cabs'
            ? `${cabType} Cab,${adults} Adult${adults > 1 ? 's' : ''}${
                children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''
              }`
            : activeTab === 'Buses'
            ? `${busType} Bus,${adults} Adult${adults > 1 ? 's' : ''}${
                children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''
              }`
            : `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}${
                children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''
              }`}
        </span>
        {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-md p-4">
          {activeTab === 'Trains' ? ( <div> <label className="block text-sm text-gray-700 mb-1">Train Class</label>
              <select
                className="border p-2 rounded w-full"
                value={trainClass}
                onChange={(e) => setTrainClass(e.target.value)}
              >
                <option>AC First Class (1A)</option>
                <option>AC 2 Tier (2A)</option>
                <option>AC 3 Tier (3A)</option>
                <option>Sleeper (SL)</option>
                <option>Second Sitting (2S)</option>
              </select>
            </div>):activeTab === 'Cabs' ? (<div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Cab Type</label>
              <select
                className="border p-2 rounded w-full"
                value={cabType}
                onChange={(e) => setCabType(e.target.value)}
              >
                <option>Mini</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Luxury</option>
              </select>
            </div>): activeTab === 'Buses' ? (<div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Bus Type</label>
              <select
                className="border p-2 rounded w-full"
                value={busType}
                onChange={(e) => setBusType(e.target.value)}
              >
                <option>Sleeper</option>
                <option>Seater</option>
                <option>Luxury</option>
              </select></div>) : 
          <Counter label="Rooms" value={rooms} setValue={setRooms} min={1} />}
          <Counter label="Adults" value={adults} setValue={setAdults} min={1} />
          <Counter label="Children" value={children} setValue={setChildren} min={0} />

          {children > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 mb-1">Children's Ages:</p>
              {childrenAges.map((age, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Child {idx + 1}</label>
                  <input
                    type="number"
                    min={0}
                    max={17}
                    value={age}
                    onChange={(e) => {
                      const newAges = [...childrenAges];
                      newAges[idx] = parseInt(e.target.value) || 0;
                      setChildrenAges(newAges);
                    }}
                    className="border p-2 rounded w-20"
                    placeholder="Age"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomGuestSelector;

{/* import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

type GuestData = {
  rooms: number;
  adults: number;
  children: number;
  childrenAges: number[];
  trainClass?: string;
  cabType?: string;
};

type RoomGuestSelectorProps = {
  activeTab: string;
  onChange: (data: GuestData) => void;
};

const RoomGuestSelector: React.FC<RoomGuestSelectorProps> = ({ activeTab, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [trainClass, setTrainClass] = useState('AC 3 Tier (3A)');
  const [cabType, setCabType] = useState('Sedan');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateParent = () => {
    onChange({
      rooms,
      adults,
      children,
      childrenAges,
      ...(activeTab === 'Trains' && { trainClass }),
      ...(activeTab === 'Cabs' && { cabType }),
    });
  };

  useEffect(() => {
    updateParent();
  }, [rooms, adults, children, childrenAges, trainClass, cabType]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setChildrenAges((prev) => {
      const updated = [...prev];
      if (children > updated.length) {
        for (let i = updated.length; i < children; i++) updated.push(5);
      } else {
        updated.length = children;
      }
      return updated;
    });
  }, [children]);

  const Counter = ({
    label,
    value,
    setValue,
    min = 0,
  }: {
    label: string;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    min?: number;
  }) => (
    <div className="flex items-center justify-between mb-3">
      <span>{label}</span>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setValue((prev) => Math.max(min, prev - 1))}
          className="p-1 border rounded disabled:opacity-30"
          disabled={value === min}
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) =>
            setValue(Math.max(min, parseInt(e.target.value) || min))
          }
          className="w-12 text-center border rounded"
        />
        <button
          type="button"
          onClick={() => setValue((prev) => prev + 1)}
          className="p-1 border rounded"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm text-gray-700 mb-1">Guests & Rooms</label>
      <div
        className="border p-3 rounded w-full cursor-pointer flex justify-between items-center"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <span>
          {activeTab === 'Trains'
            ? trainClass
            : activeTab === 'Cabs'
            ? cabType
            : `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}${
                children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''
              }`}
        </span>
        {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-md p-4 min-w-[300px]">
          {activeTab === 'Trains' ? (
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Train Class</label>
              <select
                className="border p-2 rounded w-full"
                value={trainClass}
                onChange={(e) => setTrainClass(e.target.value)}
              >
                <option>AC First Class (1A)</option>
                <option>AC 2 Tier (2A)</option>
                <option>AC 3 Tier (3A)</option>
                <option>Sleeper (SL)</option>
                <option>Second Sitting (2S)</option>
              </select>
            </div>
          ) : activeTab === 'Cabs' ? (
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Cab Type</label>
              <select
                className="border p-2 rounded w-full"
                value={cabType}
                onChange={(e) => setCabType(e.target.value)}
              >
                <option>Mini</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Luxury</option>
              </select>
            </div>
          ) : (
            <>
              <Counter label="Rooms" value={rooms} setValue={setRooms} min={1} />
              <Counter label="Adults" value={adults} setValue={setAdults} min={1} />
              <Counter label="Children" value={children} setValue={setChildren} min={0} />

              {children > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Children's Ages:</p>
                  {childrenAges.map((age, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <label className="text-sm text-gray-700">Child {idx + 1}</label>
                      <input
                        type="number"
                        min={0}
                        max={17}
                        value={age}
                        onChange={(e) => {
                          const updated = [...childrenAges];
                          updated[idx] = parseInt(e.target.value) || 0;
                          setChildrenAges(updated);
                        }}
                        className="border p-2 rounded w-20"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomGuestSelector;
*/}