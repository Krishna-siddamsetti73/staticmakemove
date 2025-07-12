import React, { useEffect, useState } from 'react';
import SalesDashboard from '../pages/salesdashboard';
import { BookingData,listenToAllBookings } from '../firebase/firebaseservices';
// import { BookingData } from '..'; // Make sure this interface is available
import { getDatabase, ref, update } from 'firebase/database';

const SalesPage = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedBooking, setEditedBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const unsubscribe = listenToAllBookings((data) => {
      setBookings(data);
    });
    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedBooking({ ...bookings[index] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedBooking) {
      setEditedBooking({
        ...editedBooking,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = async () => {
    if (editedBooking) {
      const db = getDatabase();
      const bookingRef = ref(db, `bookings/${editedBooking.id}`);
      await update(bookingRef, editedBooking);
      setEditIndex(null);
      setEditedBooking(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Sales Dashboard</h2>
      <SalesDashboard />

      <h2 className="text-2xl font-bold mt-10 mb-4">Manage Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Travel Date</th>
              <th className="p-2 border">Travelers</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Package ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.id}>
                {editIndex === index ? (
                  <>
                    <td className="p-2 border"><input name="name" value={editedBooking?.name} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border"><input name="email" value={editedBooking?.email} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border"><input name="phone" value={editedBooking?.phone} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border"><input name="destination" value={editedBooking?.destination} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border"><input name="travelDate" value={editedBooking?.travelDate} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border"><input name="travelers" value={editedBooking?.travelers} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border"><input name="message" value={editedBooking?.message} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border"><input name="packageId" value={editedBooking?.packageId} onChange={handleChange} className="border p-1" /></td>
                    <td className="p-2 border">
                      <select name="status" value={editedBooking?.status} onChange={handleChange} className="border p-1">
                        <option value="booked">Booked</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{booking.name}</td>
                    <td className="p-2 border">{booking.email}</td>
                    <td className="p-2 border">{booking.phone}</td>
                    <td className="p-2 border">{booking.destination}</td>
                    <td className="p-2 border">{booking.travelDate}</td>
                    <td className="p-2 border">{booking.travelers}</td>
                    <td className="p-2 border">{booking.message}</td>
                    <td className="p-2 border">{booking.packageId}</td>
                    <td className="p-2 border">{booking.status}</td>
                    <td className="p-2 border">
                      <button onClick={() => handleEdit(index)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;
