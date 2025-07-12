import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Pencil, Plus, Save, Trash } from 'lucide-react';
import { usePackages } from '../context/PackageContext';


const EditablePackage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { packages } = usePackages();
  const [packageData, setPackageData] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);

 
useEffect(() => {
  if (!packageId) return;

  const fetchData = async () => {
    const docRef = doc(db, 'packages', packageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPackageData({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log('No such document!');
    }
  };
  fetchData();
}, [packageId]);

  

  useEffect(() => {
  if (!packageId) return;

  const fetchData = async () => {
    const docRef = doc(db, 'packages', packageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPackageData({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log('No such document!');
    }
  };
  fetchData();
}, [packageId]);


  useEffect(() => {
    if (!packageId) return;

    const pkgFromContext = packages.find(pkg => String(pkg.id) === String(packageId));
    if (pkgFromContext) {
      setPackageData(pkgFromContext);
    } else {
      const fetchData = async () => {
        const q = query(collection(db, 'packages'), where('id', '==', packageId));
        const querySnapshot = await (await import('firebase/firestore')).getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setPackageData({ id: docSnap.id, ...docSnap.data() });
        }
      };
      fetchData();
    }
  }, [packageId, packages]);

  const handleChange = (key: string, value: any) => {
    setPackageData((prev: any) => ({ ...prev, [key]: value }));
  };

  const addNewField = () => {
    const key = prompt('Enter new key');
    if (key && packageData && !packageData.hasOwnProperty(key)) {
      setPackageData((prev: any) => ({ ...prev, [key]: '' }));
    }
  };

  const saveChanges = async () => {
    if (!packageData || !packageId) return;

    const updatedData = { ...packageData };
    delete updatedData.id;

    try {
      await updateDoc(doc(db, 'packages', packageData.id), updatedData);
      alert('Package updated');
      setEditMode(false);
      await updateDoc(doc(db, 'packages', packageId), updatedData);

    } catch (err) {
      console.error(err);
      alert('Error saving package');
    }
  };

  const deleteItemFromArray = (key: string, index: number) => {
    const updated = [...packageData[key]];
    updated.splice(index, 1);
    handleChange(key, updated);
  };

  const deleteItineraryDay = (index: number) => {
    const updated = [...packageData.itinerary];
    updated.splice(index, 1);
    handleChange('itinerary', updated);
  };

  const deleteActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...packageData.itinerary];
    updated[dayIndex].activities.splice(activityIndex, 1);
    handleChange('itinerary', updated);
  };

  if (!packageData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div style={{ height: 80 }} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Package Details</h2>
        <div className="space-x-2">
          {editMode ? (
            <>
              <button onClick={saveChanges} className="bg-green-600 text-white px-4 py-2 rounded flex items-center space-x-2">
                <Save size={16} /> <span>Save</span>
              </button>
              <button onClick={addNewField} className="bg-yellow-500 text-white px-3 py-2 rounded flex items-center space-x-2">
                <Plus size={16} /> <span>Add Field</span>
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2">
              <Pencil size={16} /> <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(packageData).map(([key, value]) => (
          <div key={key} className="border p-4 rounded space-y-2 bg-white shadow-sm">
            <label className="font-medium capitalize">{key}</label>
            {editMode ? (
              key === 'itinerary' && Array.isArray(value) ? (
                <div className="space-y-4">
                  {value.map((item, idx) => (
                    <div key={idx} className="border p-4 rounded space-y-2 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Day {item.day}</h4>
                        <button onClick={() => deleteItineraryDay(idx)} className="text-red-600 flex items-center">
                          <Trash size={16} /> Delete Day
                        </button>
                      </div>
                      <input
                        className="border p-2 w-full"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...value];
                          updated[idx].title = e.target.value;
                          handleChange('itinerary', updated);
                        }}
                      />
                      <textarea
                        className="border p-2 w-full"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...value];
                          updated[idx].description = e.target.value;
                          handleChange('itinerary', updated);
                        }}
                      />
                      <div>
                        <p className="mt-2 font-medium">Activities:</p>
                        {item.activities.map((act: string, actIdx: number) => (
                          <div key={actIdx} className="flex space-x-2 items-center">
                            <input
                              className="border p-2 w-full my-1"
                              value={act}
                              placeholder="Activity"
                              onChange={(e) => {
                                const updated = [...value];
                                updated[idx].activities[actIdx] = e.target.value;
                                handleChange('itinerary', updated);
                              }}
                            />
                            <button
                              onClick={() => deleteActivity(idx, actIdx)}
                              className="text-red-600"
                              title="Delete Activity"
                              aria-label="Delete Activity"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updated = [...value];
                            updated[idx].activities.push('');
                            handleChange('itinerary', updated);
                          }}
                          className="text-blue-600 mt-2 text-sm"
                        >
                          + Add Activity
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleChange('itinerary', [...value, { title: '', description: '', day: value.length + 1, activities: [] }])}
                    className="text-green-600 mt-4 flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Itinerary Day
                  </button>
                </div>
              ) : Array.isArray(value) ? (
                <div className="space-y-2">
                  {value.map((item: any, idx: number) => (
                    <div key={idx} className="flex space-x-2 items-center">
                      <input
                        className="border p-2 w-full"
                        value={item}
                        onChange={(e) => {
                          const updated = [...value];
                          updated[idx] = e.target.value;
                          handleChange(key, updated);
                        }}
                        placeholder={`Enter ${key} item`}
                      />
                      <button
                        onClick={() => deleteItemFromArray(key, idx)}
                        className="text-red-600"
                        title="Delete Item"
                        aria-label="Delete Item"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => handleChange(key, [...value, ''])} className="text-blue-600 mt-2 flex items-center">
                    <Plus size={16} /> Add Item
                  </button>
                </div>
              ) : typeof value === 'object' && value !== null ? (
                <textarea
                  className="border p-2 w-full"
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => handleChange(key, JSON.parse(e.target.value))}
                  placeholder={`Enter ${key} as JSON`}
                />
              ) : (
                <input
                  className="border p-2 w-full"
                  value={value !== undefined && value !== null ? String(value) : ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Enter ${key}`}
                />
              )
            ) : (
              <div className="text-gray-700">
                {Array.isArray(value) ? (
                  <ul className="list-disc pl-4 space-y-1">{value.map((item: any, idx: number) => <li key={idx}>{String(item)}</li>)}</ul>
                ) : typeof value === 'object' && value !== null ? (
                  <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
                ) : (
                  <p>{String(value)}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditablePackage;