import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import MyModal from './Modal';

interface Booking {
  id: number;
  carBrand: string;
  carModel: string;
  carYear: number;
  lga: string;
  completeStatus: string;
  paymentStatus: string;
  service: string;
  servicePrice: number;
  date: string;
  // ... other properties
}

interface BookingRowProps {
  booking: Booking; // Specify the type of the booking prop
  onDelete: (id: number) => void;
  onUpdate: any;
  openPopupWithMessage: any;
}

const BookingRow: React.FC<BookingRowProps> = ({
  booking,
  onDelete,
  onUpdate,
}) => {
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );

  // Function to handle bookings deletion
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) {
        console.error('Error deleting booking:', error.message);
        // Handle the error
      } else {
        console.log('Booking deleted successfully');
        onDelete(booking.id);
      }
    } catch (error) {
      console.error('Error deleting booking:', (error as Error).message);
      // Handle the error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const metadata = user.user_metadata;

      setFullName(metadata.full_name);
      setPhoneNumber(metadata.phone);
      setEmail(user.email);
    }
    getProfile();
  }, []);

  //PAYMENT STARTS
  const config = {
    public_key: import.meta.env.VITE_PUBLIC_FLUTTERWAVE_KEY,
    tx_ref: Date.now(),
    amount: booking.servicePrice,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      phone_number: phoneNumber,
      name: fullName,
    },
    customizations: {
      title: `Payment for ${booking.service}`,
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    handleFlutterPayment({
      callback: async (response) => {
        setIsLoading(true);
        try {
          await supabase
            .from('bookings')
            .update({ paymentStatus: response.status })
            .eq('id', booking.id);
          onUpdate(booking.id);
        } catch (error) {
          console.error(
            'Error updating payment status:',
            (error as Error).message,
          );
        } finally {
          setIsLoading(false);
        }
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {},
    });
  };

  //PAYMENT ENDS

  const formatDateTime = (dateTimeString: string | number | Date) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <MyModal
        isOpen={cancelModalOpen}
        closeModal={() => setCancelModalOpen(false)}
        actionText="Cancel Booking"
        actionSub="This action is irreversible. Are you sure you want to cancel this appointment?"
        onActionClick={() => {
          if (selectedBookingId !== null) {
            handleDelete(selectedBookingId);
          }
          setCancelModalOpen(false);
          setSelectedBookingId(null);
        }}
        buttonColor="bg-danger"
      />
      <tbody>
        <tr key={booking.id}>
          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
            <h5 className="font-medium text-black dark:text-white">
              {booking.carBrand}
            </h5>
            <p className="text-sm">
              {booking.carModel}, ({booking.carYear})
            </p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <p className="text-black dark:text-white">{booking.service}</p>
            <p className="text-success text-sm font-medium">
              {Number(booking.servicePrice).toLocaleString('en-US', {
                style: 'currency',
                currency: 'NGN',
              })}
            </p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <p className="text-black dark:text-white">{booking.lga}</p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {booking.completeStatus === 'Completed' ? (
              <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                Completed
              </p>
            ) : (
              <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                Pending
              </p>
            )}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <p className="text-black dark:text-white">
              {formatDateTime(booking.date)}
            </p>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <button
              className="text-danger rounded-md text-sm font-medium hover:text-meta-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
              onClick={() => {
                setSelectedBookingId(booking.id);
                setCancelModalOpen(true);
              }}
            >
              Cancel
            </button>
          </td>
          <td>
            {booking.paymentStatus === 'successful' ? (
              <button
                type="button"
                className="rounded-md cursor-auto border border-success px-4 py-2 text-sm font-medium text-white bg-success focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
              >
                Paid
              </button>
            ) : (
              <button
                type="button"
                className="bg:meta-3 text-meta-3 rounded-md border border-success px-4 py-2 text-sm font-medium hover:text-white hover:bg-success focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 relative"
                onClick={handlePayment}
              >
                Pay now
              </button>
            )}
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default BookingRow;
