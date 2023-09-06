import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Vehicle from '../components/Vehicle';
import carData from '../data/carData.json';
import { supabase } from '../config/supabaseClient';
import { User } from '@supabase/supabase-js';
import Roller from '../components/Roller';
import Popup from '../components/Popup';

interface VehicleFormData {
  carBrand: string;
  vin: string;
}

const Vehicles = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
    carBrand: '',
    vin: '',
  });
  const [vehicles, setVehicles] = useState<
    { id: number; carBrand: string; vin: string }[]
  >([]);

  const [userId, setUserId] = useState(null);

  //Fetch Current user
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }

    fetchUser();
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openPopup = (message) => {
    setPopupMessage(message);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVehicleFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous form errors
    setFormError('');

    // Form validation checks
    if (!vehicleFormData.carBrand || !vehicleFormData.vin) {
      setFormError('Please fill in all the fields correctly.');
      return;
    }

    if (vehicleFormData.vin.length !== 17) {
      setFormError('Incorrect VIN');
      return;
    }

    const vinExists = vehicles.some(
      (vehicle) => vehicle.vin === vehicleFormData.vin,
    );
    if (vinExists) {
      setFormError('Vehicle with this VIN already exists.');
      return;
    }

    setIsLoading(true);

    try {
      const newVehicle = {
        carBrand: vehicleFormData.carBrand,
        vin: vehicleFormData.vin,
      };

      setVehicles((prevVehicles) => [
        ...prevVehicles,
        {
          id: prevVehicles.length + 1,
          carBrand: vehicleFormData.carBrand,
          vin: vehicleFormData.vin,
        },
      ]);

      // Insert the new vehicle data into the database
      const vehicleData = {
        ...newVehicle,
        userId: userId,
      };

      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData]);

      if (error) {
        closeModal();
        openPopup('Error Inserting Vehicle');
        setVehicles(vehicles);
      } else {
        closeModal();
        openPopup('Vehicle added successfully');
      }
    } catch (error) {
      openPopup('Error Inserting Vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle vehicle deletion
  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) {
        openPopup('Error deleting vehicle');
        console.error('Error deleting vehicle:', error.message);
      } else {
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.id !== id),
        );
        openPopup('Vehicle deleted successfully');
      }
    } catch (error) {
      openPopup('Error deleting vehicle');
    } finally {
      setIsLoading(false);
    }
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const carBrands = carData.map((item) => item.brand);

  return (
    <>
      <Popup isOpen={isPopupOpen} onClose={closePopup} message={popupMessage} />
      <div
        className={`fixed inset-0 flex items-center justify-center z-12  ${
          isOpen ? 'visible' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-10">
          <div className="flex justify-center items-center h-screen">
            <div className="bg-white rounded-lg z-20 relative px-8 py-6 shadow-2xl dark:bg-boxdark">
              <form onSubmit={handleSubmit}>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
                    onClick={closeModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mx-auto"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="max-w-sm mx-auto px-2 text-center">
                  <h3 className="text-xl text-start font-medium mb-4 text-black dark:text-white">
                    Add Vehicle
                  </h3>
                  <div className="relative flex mb-4 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-car-front w-7 h-7 text-gray-400 absolute left-3 top-2 inset-y-0 my-auto"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z" />
                      <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.807.807 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155 1.806 0 4.037-.084 5.592-.155A1.479 1.479 0 0 0 15 9.611v-.413c0-.099-.01-.197-.03-.294l-.335-1.68a.807.807 0 0 0-.43-.563 1.807 1.807 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3H4.82Z" />
                    </svg>
                    <select
                      // onBlur={handleBlur}
                      onChange={handleChange}
                      name="carBrand"
                      id="carBrand"
                      className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-amber-500 shadow-sm rounded-lg"
                    >
                      <option value="">Select Car Brand</option>
                      {carBrands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-file-earmark-ruled w-7 h-7 text-gray-400 absolute left-3 top-2 inset-y-0 my-auto"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h7v1a1 1 0 0 1-1 1H6zm7-3H6v-2h7v2z" />
                    </svg>
                    <input
                      name="vin"
                      type="text"
                      placeholder="Enter VIN/Chasis No"
                      className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-amber-500 shadow-sm rounded-lg"
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    // onClick={openModal}
                    className="inline-flex items-center w-full justify-center gap-2.5 rounded-md bg-black py-3 mt-6 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
                    {isLoading ? 'Adding...' : 'Add Vehicle'}
                  </button>
                  {formError && <p className="text-danger mt-2">{formError}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Breadcrumb pageName="My Vehicles" />
      <div className="flex justify-end py-4">
        <button
          onClick={openModal}
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
          Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols md:grid-cols-3 gap-x-8 gap-y-8">
        {isLoading ? (
          <p className="text-gray-900 font-bold item-center text-center col-span-12">
            <Roller />
          </p>
        ) : vehicles.length === 0 ? (
          <p className="text-gray-500 text-center col-span-12 mt-5">
            No vehicles added
          </p>
        ) : (
          vehicles.map((vehicle, index) => (
            <Vehicle
              key={index}
              id={vehicle.id}
              carBrand={vehicle.carBrand}
              vin={vehicle.vin}
              onDelete={() => handleDelete(vehicle.id)}
              showDeleteButton
            />
          ))
        )}
      </div>
    </>
  );
};

export default Vehicles;
