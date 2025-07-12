import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/authcontext";
import { getDatabase, ref, onValue } from "firebase/database";
import { Loader2 } from "lucide-react";

const MyBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const db = getDatabase();
    const bookingsRef = ref(db, "bookings");

    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      const userBookings = [];
      for (let key in data) {
        if (data[key].email === currentUser.email) {
          userBookings.push({ id: key, ...data[key] });
        }
      }
      setBookings(userBookings);
      setLoading(false);
    });
  }, [currentUser]);

  if (!currentUser) {
    return <p className="text-center mt-10">Please login to view your bookings.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div style={{ height: 80 }} />
      <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{booking.destination}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {booking.travelDate}
                </span>
              </div>
              <p><span className="font-medium">Travelers:</span> {booking.travelers}</p>
              <p><span className="font-medium">Phone:</span> {booking.phone}</p>
              <p><span className="font-medium">Message:</span> {booking.message}</p>
              <p className="text-sm text-gray-500 mt-2">Booking ID: {booking.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
