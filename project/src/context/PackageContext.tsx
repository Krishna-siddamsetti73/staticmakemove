import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../firebase/firebase';

export interface Package {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: string;
  bestTime: string;
  featured?: boolean;
  status: string; // Added status field
}

interface PackageContextType {
  packages: Package[];
  selectedPackage: Package | null;
  setSelectedPackage: (pkg: Package | null) => void;
  bookingData: any;
  setBookingData: (data: any) => void;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackageProvider');
  }
  return context;
};
export const fetchPackages = async (): Promise<Package[]> => {
  const snapshot = await getDocs(collection(db, "packages"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Package));
};

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [bookingData, setBookingData] = useState({});
  const [packages, setPackages] = useState<Package[]>([]);
    useEffect(() => {
    const loadPackages = async () => {
      const data = await fetchPackages(); // fetch from Firestore
      setPackages(data); // store in state
    };
    loadPackages();
  }, []);
  return (
    <PackageContext.Provider value={{
      packages,
      selectedPackage,
      setSelectedPackage,
      bookingData,
      setBookingData
    }}>
      {children}
    </PackageContext.Provider>
  );
};


