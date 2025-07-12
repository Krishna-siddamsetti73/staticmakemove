import React, { useState } from 'react';
import { usePackages } from '../context/PackageContext';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom';

interface Package {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
}

const SalesDashboard: React.FC = () => {
  const { packages } = usePackages();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [showModal, setShowModal] = useState(false);

  const confirmDelete = (pkg: Package) => {
    setSelectedPkg(pkg);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedPkg) return;

    try {
      const q = query(collection(db, 'packages'), where('location', '==', selectedPkg.location));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        querySnapshot.forEach(docSnap => {
          batch.update(docSnap.ref, { status: 'deleted' });
        });
        await batch.commit();
        alert('Package deleted successfully.');
      } else {
        alert('Package not found.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete package.');
    } finally {
      setShowModal(false);
      setSelectedPkg(null);
    }
  };

  const visiblePackages = packages.filter(pkg => pkg.status !== 'deleted');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Dashboard</h2>

      <div className="grid gap-4">
        {visiblePackages.length === 0 && <p>No active packages available.</p>}

        {visiblePackages.map(pkg => (
          <div key={pkg.id} className="border rounded p-4 shadow-md">
            <h3 className="text-lg font-semibold">{pkg.title}</h3>
            <p className="text-sm text-gray-600">{pkg.location} • ₹{pkg.price}</p>

            <div className="mt-2 space-x-2">
              <Link to={`/edit-package/${pkg.id}`}>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Edit
                </button>
              </Link>

              <button
                onClick={() => confirmDelete(pkg)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link to="/Add">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            + Add Package
          </button>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && selectedPkg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{selectedPkg.title}</strong>?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;