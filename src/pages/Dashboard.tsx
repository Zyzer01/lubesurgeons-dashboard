import { useState, useEffect } from 'react';
import DashboardBooking from '../components/DashboardBooking';
import Vehicle from '../components/Vehicle';
import { supabase } from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import Roller from '../components/Roller';
import Popup from '../components/Popup';

const Dashboard = () => {
  const [visibleVehicles, setVisibleVehicles] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [vehicles, setVehicles] = useState<
    { id: number; carBrand: string; vin: string }[]
  >([]);

  const openPopup = (message) => {
    setPopupMessage(message);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    // Fetch data from Supabase and update the vehicles state
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('userId', user.id);
        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
          setVehicles(data);
        }
      } catch (error) {
        console.error('Error fetching data:', (error as Error).message);
      }
      setIsLoading(false);
    };
    fetchVehicles();
  }, []);

  return (
    <>
      <Popup isOpen={isPopupOpen} onClose={closePopup} message={popupMessage} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        {isLoading ? (
          <p className="text-gray-900 font-bold item-center text-center col-span-12">
            <Roller />
          </p>
        ) : vehicles.length === 0 ? (
          <p className="text-gray-500 text-center col-span-12 mt-5">
            No vehicles added.{' '}
            <span className="text-warning">
              <Link to={'/vehicles'}> Add Vehicle</Link>
            </span>
          </p>
        ) : (
          vehicles.slice(0, visibleVehicles).map((vehicle, index) => (
            <Vehicle
              key={index}
              id={vehicle.id}
              carBrand={vehicle.carBrand}
              vin={vehicle.vin}
              // onDelete={() => handleDelete(vehicle.id)}
            />
          ))
        )}
      </div>
      {vehicles.length > visibleVehicles && (
        <div className="flex justify-center mt-4">
          <span className=" text-warning hover:text-gray-700 cursor-pointer">
            <Link to={'/vehicles'}> See all</Link>
          </span>
        </div>
      )}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <DashboardBooking openPopup={openPopup} />
      </div>
    </>
  );
};

export default Dashboard;
