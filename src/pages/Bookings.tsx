import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import BookingTable from '../components/BookingTable';
import { Link } from 'react-router-dom';
import Popup from '../components/Popup';

const Bookings = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const openPopup = (message) => {
    setPopupMessage(message);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <Popup isOpen={isPopupOpen} onClose={closePopup} message={popupMessage} />
      <Breadcrumb pageName="Bookings" />
      <div className="flex justify-end py-4">
        <Link
          to="/book"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-black py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-plus-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          Book an appointment
        </Link>
      </div>
      <div className="flex flex-col gap-10">
        <BookingTable openPopup={openPopup} />
      </div>
    </>
  );
};

export default Bookings;
