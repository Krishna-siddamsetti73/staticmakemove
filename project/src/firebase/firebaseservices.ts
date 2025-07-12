import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { auth, db,database } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

export interface UserProfile {
  name : string;
  userId: string;
  userType: 'B2C'| 'B2B' | 'Admin'| 'sales' ; 
  totalbookings: number; 
  totalspent: string// Added userType to track user source
  email: string;
  phone: string;
    createdAt: any; // Use Firestore Timestamp type


}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export interface BookingData {
 id: string;
destination: string;
packageId: string;
phone: string;
email: string;
travelers: string;
travelDate: string;
message: string;
status: 'booked'|'cancelled'|'completed'|'ongoing';
name: string;
}

// Authentication Services
export const signUp = async (
  email: string, 
  password: string, 
  name: string,
  cphone: string, 
  userType: 'B2C' | 'B2B' | 'Admin' | 'sales' = 'B2C',
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Capitalize first letter of each word in name
    const capitalizeName = (input: string) =>
      input
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    const displayName = capitalizeName(name);

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      userId: user.uid,
      email: user.email!,
      name: displayName,
      phone: cphone,
      userType: userType as 'B2C' | 'B2B' | 'Admin' | 'sales',
      createdAt: serverTimestamp(),
      totalbookings: 0,
      totalspent: "0",
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return { user, profile: userProfile };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user profile exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            // Create user profile if it doesn't exist
            const [firstName, ...lastNameArr] = (user.displayName || '').split(' ');
            const lastName = lastNameArr.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
            const displayName = [firstName, ...lastNameArr]
              .filter(Boolean)
              .map(capitalize)
              .join(' ');

            const userProfile: UserProfile = {
              userId: user.uid,
              email: user.email || '',
              name: displayName,
              phone: user.phoneNumber || '',
              userType: 'B2C',
              createdAt: serverTimestamp(),
              totalbookings: 0,
              totalspent: "0",
            };
            await setDoc(doc(db, 'users', user.uid), userProfile);
            return { user, profile: userProfile };
        } else {
            return { user, profile: userDoc.data() as UserProfile };
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const initializeDemoData = async () => {
  try {
    // Check if demo users already exist
    const demoUsers = [
      {
        email: 'b2cuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+91-9876543210',
        userType: 'B2C' as const
      },
      {
        email: 'b2buser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+91-9876543211',
        userType: 'B2B' as const
      },
      {
        email: 'admin@example.com',
        password: 'adminpass',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+91-9876543212',
        userType: 'Admin' as const,
      
      }
      
    ];

    for (const demoUser of demoUsers) {
      try {
        await signUp(
          demoUser.email,
          demoUser.password,
          `${demoUser.firstName} ${demoUser.lastName}`,
          demoUser.phone,
          demoUser.userType
        );
        console.log(`Demo user created: ${demoUser.email}`);
      } catch (error: any) {
        if (error.message.includes('email-already-in-use')) {
          console.log(`Demo user already exists: ${demoUser.email}`);
        } else {
          console.error(`Error creating demo user ${demoUser.email}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};
// Fetch all bookings in realtime (Firestore) from the 'bookings' collection
export const listenToAllBookings = (callback: (bookings: BookingData[]) => void) => {
    const bookingsRef = ref(database, 'bookings');
    return onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val();
        const bookings: BookingData[] = data
            ? Object.entries(data).map(([id, value]) => ({
                id,
                ...(value as Omit<BookingData, 'id'>)
            }))
            : [];
        callback(bookings);
    });
};
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};


export { auth };
