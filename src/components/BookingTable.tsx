import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import BookingRow from './BookingRow';
import TableHead from './TableHead';

interface Booking {
  id: number;
  carBrand: string;
  carModel: string;
  carYear: number;
  lga: string;
  completeStatus: string;
  service: string;
  servicePrice: number;
  date: string;
  // ... other properties
}

const BookingTable = ({ openPopup }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [orderBy, setOrderBy] = useState('created_at');
  const [visibleBookings, setVisibleBookings] = useState(5);
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setVisibleBookings(bookingData.length); // Show all vehicles
    setShowAll(true);
  };

  const handleHide = () => {
    setVisibleBookings(2); // Hide additional vehicles
    setShowAll(false);
  };

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
        console.error('Error fetching data:', (error as Error).message);
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
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <TableHead />
          {isLoading ? (
            <tr className="text-gray-900 font-bold text-center flex justify-center">
              <td>Loading...</td>
            </tr>
          ) : bookingData.length === 0 ? (
            <tr className="text-gray-500 text-lg mt-5 flex justify-center">
              <td>No bookings</td>
            </tr>
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
        </table>
        {bookingData.length > visibleBookings && (
          <div className="text-center py-5 text-primary">
            {showAll ? (
              <button onClick={handleHide}>Hide</button>
            ) : (
              <button onClick={handleShowMore}>See more</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTable;
