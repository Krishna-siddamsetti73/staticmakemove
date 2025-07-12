import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../src/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const countries = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Maldives', flag: '🇲🇻' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Japan', flag: '🇯🇵' },
];

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
    image: '',
    images: [] as string[],
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
  const [imageUrl, setImageUrl] = useState('');
  const [includedItem, setIncludedItem] = useState('');
  const [excludedItem, setExcludedItem] = useState('');
  const [highlightItem, setHighlightItem] = useState('');

  const navigate = useNavigate();

  const handleChange = (key: string, value: any) => {
    setPackageData((prev) => ({ ...prev, [key]: value }));
  };

  const addItemToArray = (key: PackageArrayKeys, value: string, clear: Function) => {
    if (value.trim() !== '') {
      setPackageData((prev) => ({ ...prev, [key]: [...prev[key], value] }));
      clear('');
    }
  };

  const addActivity = () => {
    if (activity.trim() !== '') {
      setItineraryItem((prev) => ({ ...prev, activities: [...prev.activities, activity] }));
      setActivity('');
    }
  };

  const addItineraryItem = () => {
    if (itineraryItem.title && itineraryItem.description) {
      setPackageData((prev) => ({ ...prev, itinerary: [...prev.itinerary, itineraryItem] }));
      setItineraryItem({ day: itineraryItem.day + 1, title: '', description: '', activities: [] });
    } else {
      alert('Fill title and description for itinerary');
    }
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'packages'), packageData);
      alert('Package Added Successfully');
      navigate('/packages');
    } catch (err) {
      console.error(err);
      alert('Error adding package');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Package</h2>
      <div className="grid grid-cols-2 gap-4">

        <input className="border p-2" placeholder="Title" value={packageData.title} onChange={(e) => handleChange('title', e.target.value)} />

        {/* Category Dropdown */}
        <select
          className="border p-2"
          value={packageData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          aria-label="Category"
          title="Category"
        >
          <option value="">Select Category</option>
          {categories.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
        </select>
        {packageData.category === 'Other' && (
          <input className="border p-2" placeholder="Enter Category" value={otherInputs.category}
            onChange={(e) => { setOtherInputs({ ...otherInputs, category: e.target.value }); handleChange('category', e.target.value); }} />
        )}

        <textarea className="border p-2 col-span-2" placeholder="Description" value={packageData.description}
          onChange={(e) => handleChange('description', e.target.value)} />

        <input className="border p-2" placeholder="Image URL" value={packageData.image}
          onChange={(e) => handleChange('image', e.target.value)} />

        <select
          className="border p-2"
          value={packageData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          aria-label="Location"
          title="Location"
        >
          <option value="">Select Location</option>
          {countries.map((c, idx) => <option key={idx} value={c.name}>{c.flag} {c.name}</option>)}
        </select>

        <select
          className="border p-2"
          value={packageData.rating}
          onChange={(e) => handleChange('rating', e.target.value)}
          aria-label="Rating"
          title="Rating"
        >
          <option value="">Select Rating</option>
          {ratings.map((r, idx) => <option key={idx} value={r}>{r}</option>)}
        </select>

        <select
          className="border p-2"
          value={packageData.bestTime}
          onChange={(e) => handleChange('bestTime', e.target.value)}
          aria-label="Best Time"
          title="Best Time"
        >
          <option value="">Select Best Time</option>
          {monthRanges.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
        </select>
        {packageData.bestTime === 'Other' && (
          <input className="border p-2" placeholder="Enter Best Time" value={otherInputs.bestTime}
            onChange={(e) => { setOtherInputs({ ...otherInputs, bestTime: e.target.value }); handleChange('bestTime', e.target.value); }} />
        )}

        {/* Difficulty Dropdown */}
        <select
          className="border p-2"
          value={packageData.difficulty}
          onChange={(e) => handleChange('difficulty', e.target.value)}
          aria-label="Difficulty"
          title="Difficulty"
        >
          <option value="">Select Difficulty</option>
          {difficulties.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
        </select>
        {packageData.difficulty === 'Other' && (
          <input className="border p-2" placeholder="Enter Difficulty" value={otherInputs.difficulty}
            onChange={(e) => { setOtherInputs({ ...otherInputs, difficulty: e.target.value }); handleChange('difficulty', e.target.value); }} />
        )}

        {/* Group Size Dropdown */}
        <select
          className="border p-2"
          value={packageData.groupSize}
          onChange={(e) => handleChange('groupSize', e.target.value)}
          aria-label="Group Size"
          title="Group Size"
        >
          <option value="">Select Group Size</option>
          {groupSizes.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
        </select>
        {packageData.groupSize === 'Other' && (
          <input className="border p-2" placeholder="Enter Group Size" value={otherInputs.groupSize}
            onChange={(e) => { setOtherInputs({ ...otherInputs, groupSize: e.target.value }); handleChange('groupSize', e.target.value); }} />
        )}

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
          <input className="border p-2 w-full" placeholder="Image URL" value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)} />
          <button type="button" onClick={() => addItemToArray('images', imageUrl, setImageUrl)}
            className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        <ul className="list-disc pl-5">{packageData.images.map((img, idx) => <li key={idx}>{img}</li>)}</ul>
      </div>

      {/* Included Items */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Included</h3>
        <div className="flex space-x-2 mb-2">
          <input className="border p-2 w-full" placeholder="Included Item" value={includedItem}
            onChange={(e) => setIncludedItem(e.target.value)} />
          <button type="button" onClick={() => addItemToArray('included', includedItem, setIncludedItem)}
            className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        <ul className="list-disc pl-5">{packageData.included.map((inc, idx) => <li key={idx}>{inc}</li>)}</ul>
      </div>

      {/* Excluded Items */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Excluded</h3>
        <div className="flex space-x-2 mb-2">
          <input className="border p-2 w-full" placeholder="Excluded Item" value={excludedItem}
            onChange={(e) => setExcludedItem(e.target.value)} />
          <button type="button" onClick={() => addItemToArray('excluded', excludedItem, setExcludedItem)}
            className="bg-red-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        <ul className="list-disc pl-5">{packageData.excluded.map((exc, idx) => <li key={idx}>{exc}</li>)}</ul>
      </div>
      {/* Itinerary */}
      <div className="mt-4 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Add Itinerary</h3>
        <div className="flex space-x-2 mb-2">
          <input className="border p-2 w-16" type="number" placeholder="Day" value={itineraryItem.day} onChange={(e) => setItineraryItem({ ...itineraryItem, day: Number(e.target.value) })} />
          <input className="border p-2 w-1/4" placeholder="Title" value={itineraryItem.title} onChange={(e) => setItineraryItem({ ...itineraryItem, title: e.target.value })} />
          <input className="border p-2 w-1/2" placeholder="Description" value={itineraryItem.description} onChange={(e) => setItineraryItem({ ...itineraryItem, description: e.target.value })} />
        </div>

        {/* Activities for itinerary */}
        <div className="flex space-x-2 mb-2">
          <input className="border p-2 w-full" placeholder="Activity" value={activity} onChange={(e) => setActivity(e.target.value)} />
          <button type="button" onClick={addActivity} className="bg-blue-600 text-white px-4 py-2 rounded">Add Activity</button>
        </div>
        <ul className="list-disc pl-5">
          {itineraryItem.activities.map((act, idx) => <li key={idx}>{act}</li>)}
        </ul>

        <button type="button" onClick={addItineraryItem} className="bg-green-600 text-white px-4 py-2 rounded mt-2">Add Itinerary Item</button>

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
      <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded mt-6">Add Package</button>
    </div>
  );
};

export default AddPackage;