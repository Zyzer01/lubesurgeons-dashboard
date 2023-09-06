import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import BookingRow from './BookingRow';
import TableHead from './TableHead';

interface Booking {
  id: number;
  carBrand: string;
  carModel: string;
  carYear: number;
  lga: string;
  completeStatus: string;
  date: string;
  service: string;
  servicePrice: number;
  // ... other properties
}

const DashboardBooking = ({ openPopup }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('created_at');
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [visibleBookings, setVisibleBookings] = useState(5);

  useEffect(() => {
    const fetchBookingData = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('userId', user.id)
          .order(orderBy, { ascending: false });
        if (error) {
          console.error('Error fetching data:', error.message);
          // Handle the error
        } else {
          setBookingData(data);
        }
      } catch (error) {
        console.error('Error inserting data:', (error as Error).message);
        // Handle the error
      }
      setIsLoading(false);
    };
    fetchBookingData();
  }, [orderBy]);

  const handleDelete = (id: number) => {
    setBookingData((prevData) =>
      prevData.filter((booking) => booking.id !== id),
    );
    openPopup('Appointment canceled successfully');
  };

  const handleUpdate = (id: number) => {
    setBookingData((prevData) =>
      prevData.map((prevBooking) =>
        prevBooking.id === id
          ? { ...prevBooking, paymentStatus: 'successful' }
          : prevBooking,
      ),
    );
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4">
          <h1>Upcoming Appointment</h1>
        </div>
        <table className="w-full table-auto">
          <TableHead />
          {/* <tbody> */}
          {isLoading ? (
            <thead className="text-gray-900 font-bold text-center flex justify-center">
              <tr>
                <th className="text-center flex justify-center">Loading...</th>
              </tr>
            </thead>
          ) : bookingData.length === 0 ? (
            <tbody className="text-gray-500 text-lg mt-5 flex justify-center">
              No Appointments
            </tbody>
          ) : (
            bookingData
              .slice(0, visibleBookings)
              .map((booking) => (
                <BookingRow
                  booking={booking}
                  key={booking.id}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))
          )}
          {/* </tbody> */}
        </table>
        <div className="text-center py-5 text-primary">
          <Link to={'/bookings'}>See All</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardBooking;
