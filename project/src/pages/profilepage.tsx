// import React, { useState } from 'react';
// import { useAuth } from '../firebase/authcontext';
// import { useNavigate } from 'react-router-dom';
// import { User, Mail, Phone, Save, Edit, LogOut } from 'lucide-react';
// import { db } from '../firebase/firebase';
// import { doc, updateDoc } from 'firebase/firestore';
// import { getDoc } from 'firebase/firestore';
// import { getUserProfile } from '../firebase/firebaseservices';

// const UserProfile = () => {
//   const { currentUser, logout, userProfile } = useAuth();
//   const [userProfileState, setUserProfile] = useState(userProfile);
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     const fetchProfile = async () => {
//       if (currentUser?.uid) {
//         const profile = await getUserProfile(currentUser.uid);
//         setUserProfile(profile);
//       }
//     };
//     fetchProfile();
//   }, [currentUser]);
//   const [editMode, setEditMode] = useState(false);
//   const [name, setName] = useState(userProfile?.name || '');
//   const [phone, setPhone] = useState(userProfile?.phone || '');

//   // React.useEffect(() => {
//   //   const userDaata = async () => {
//   //     if (!currentUser) return;
//   //     const userRef = doc(db, 'users', currentUser.uid);
//   //     const docSnap = await getDoc(userRef);
//   //     if (docSnap.exists()) {
//   //       const userData = docSnap.data();
//   //       // Convert userData object to a list of [key, value] pairs
//   //       const userDataListArr = Object.entries(userData);
//   //       setUserDataList(userDataListArr);
//   //       console.log(userDataListArr);
//   //     } else {
//   //       console.log('No such document!');
//   //     }
//   //   };
//   //   userDaata();
//   // }, [currentUser]);

//   const [userDataList, setUserDataList] = useState<[string, any][]>([]);

//   const updateUserProfile = async (updates: Record<string, any>) => {
//     if (!currentUser) return;
//     try {
//       const userRef = doc(db, 'users', currentUser.uid);
//       await updateDoc(userRef, updates);
//       setUserProfile((prev: any) => ({ ...prev, ...updates }));
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   const handleSave = async () => {
//     try {
//       await updateUserProfile({ name, phone });
//       setEditMode(false);
//       alert('Profile updated');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update profile');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-200 to-pink-200 flex items-center justify-center py-10 px-4">
//       <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full hover:scale-[1.02] transition-transform duration-300">
//         <div className="flex flex-col items-center mb-8">
//           <div className="bg-blue-100 text-blue-600 rounded-full p-5 mb-4 shadow-md">
//             <User size={48} />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-800 mb-1">Hi, {userProfile?.name}</h2>
//           <p className="text-gray-500"> {userProfile?.email}</p>
//         </div>

//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <span className="font-semibold">Name:</span>
//             {editMode ? (
//               <input
//                 className="border px-3 py-1 rounded w-1/2 shadow-sm focus:ring focus:ring-blue-200"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             ) : (
//               <span className="text-gray-700 font-medium">
//                 {(userProfileState?.name || 'N/A')
//                   .split(' ')
//                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                   .join(' ')}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <span className="font-semibold">Phone:</span>
//             {editMode ? (
//               <input
//                 className="border px-3 py-1 rounded w-1/2 shadow-sm focus:ring focus:ring-blue-200"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//             ) : (
//               <span className="text-gray-700 font-medium">
//                 {userProfileState?.phone
//                   ? userProfileState.phone.length > 10
//                     ? userProfileState.phone
//                     : `+91${userProfileState.phone}`
//                   : 'N/A'}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <span className="font-semibold">Email:</span>
//             <span className="flex items-center text-gray-700">
//               <div className="mr-2" /> {currentUser?.email || 'N/A'}
//             </span>
//           </div>

//            <div className="flex items-center justify-between">
//             <span className="font-semibold">TotalBookings:</span>
//             <span className="flex items-center text-gray-700">
//               <div className="mr-2" /> {userProfile?.totalbookings}
//             </span>
//           </div>

// {/* <div className="flex items-center justify-between">
//             <span className="font-semibold">TotalSpent:</span>
//             <span className="flex items-center text-gray-700">
//               <div className="mr-2" /> {userProfile?.totalspent}
//             </span>
//           </div> */}

//         </div>

//         <div className="mt-8 flex justify-between">
//           {editMode ? (
//             <button
//               onClick={handleSave}
//               className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center shadow-md"
//             >
//               <Save size={16} className="mr-2" /> Save
//             </button>
//           ) : (
//             <button
//               onClick={() => setEditMode(true)}
//               className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg flex items-center shadow-md"
//             >
//               <Edit size={16} className="mr-2" /> Edit
//             </button>
//           )}

//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center shadow-md"
//           >
//             <LogOut size={16} className="mr-2" /> Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/authcontext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getUserProfile } from '../firebase/firebaseservices';

const ProfilePage = () => {
  const { currentUser, logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const [userProfileState, setUserProfile] = useState(userProfile);
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);

  // Profile images
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');
  const [bgImage, setBgImage] = useState('https://via.placeholder.com/600x150');

  // Form fields
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [tempName, setTempName] = useState(name);
  const [tempPhone, setTempPhone] = useState(phone);

  interface ProfileImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleProfileImageChange = (e: ProfileImageChangeEvent): void => {
    if (e.target.files?.[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  interface BgImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleBgImageChange = (e: BgImageChangeEvent): void => {
    if (e.target.files?.[0]) {
      setBgImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fetchProfile = async () => {
    if (currentUser?.uid) {
      const profile = await getUserProfile(currentUser.uid);
      setUserProfile(profile);
      setName(profile?.name || '');
      setPhone(profile?.phone || '');
      setTempName(profile?.name || '');
      setTempPhone(profile?.phone || '');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

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
    try {
      await updateUserProfile({ name: tempName, phone: tempPhone });
      setName(tempName);
      setPhone(tempPhone);
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

  const renderTabContent = () => {
    if (activeTab === 'Personal Info') {
      return (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-300"
              />
            ) : (
              <p className="text-gray-800">{name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            {isEditing ? (
              <input
                type="text"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring focus:border-blue-300"
              />
            ) : (
              <p className="text-gray-800">{phone ? (phone.length > 10 ? phone : `+91${phone}`) : 'N/A'}</p>
            )}
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
        <img src={bgImage} alt="Background" className="w-full h-48 object-cover" />
        <label className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded cursor-pointer text-sm">
          Change BG
          <input type="file" accept="image/*" onChange={handleBgImageChange} className="hidden" />
        </label>

        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer text-xs hover:bg-blue-700">
              <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
              📷
            </label>
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
            { icon: '🔔', label: 'Notifications' },
            { icon: '💳', label: 'Payment Methods' },
            { icon: '🛡', label: 'Privacy Shortcuts' },
            { icon: '🌐', label: 'Languages' },
            { icon: '🚪', label: 'Log Out', color: 'text-red-500', action: handleLogout },
          ].map((item) => (
            <div
              key={item.label}
              onClick={item.action}
              className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 ${item.color || ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              <span>→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
