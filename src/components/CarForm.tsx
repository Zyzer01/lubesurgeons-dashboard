import { useState, useEffect, Fragment, ChangeEvent, FormEvent } from 'react';
import carData from '../data/carData.json';
import carYear from '../data/carYear.json';
import statesData from '../data/statesData.json';
import { Dialog, Transition } from '@headlessui/react';
import DateAndTimePicker from './DateAndTimePicker';
import Radio from './Radio';
import { setHours, setMinutes } from 'date-fns';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ERROR_MESSAGE = {
  name: 'Name is required',
  email: 'Email address is required',
  phoneNumber: 'Phone number is required',
  ngState: 'State is required',
  lga: 'Local government is required',
  date: 'Date is required',
  vehicleType: 'Vehicle Type is required',
  carBrand: 'Car brand is required',
  carModel: 'Car model is required',
  carYear: 'Car year is required',
  service: 'Service is required',
};

interface BookingFormData {
  name: string;
  email: string;
  phoneNumber: string;
  ngState: string;
  lga: string;
  date: Date;
  vehicleType: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  service: string;
  servicePrice?: number;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  ngState?: string;
  lga?: string;
  date?: string;
  vehicleType?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  service?: string;
}

function CarForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(''); //Brand and model
  const [selectedModel, setSelectedModel] = useState(''); //Brand and model
  const [years, setYears] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState(''); //State and LGA
  const [selectedLga, setSelectedLga] = useState(''); //State and LGA
  const [bookingFormData, setBookingFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    ngState: '',
    lga: '',
    date: setHours(setMinutes(new Date(), 30), 16),
    vehicleType: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    service: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

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

  const servicePrices: Record<string, number> = {
    'Vehicle Maintenance': 2000,
    'Oil Change': 5000,
    'Tyre Service': 4000,
    'Cooling System': 10000,
    'Brake System': 5000,
    'Additional Service': 0,
  };

  const handleBookingChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...bookingFormData, [name]: value };

    if (name === 'service') {
      updatedFormData.servicePrice = servicePrices[value]; // Include the service price in the updated data
    }

    setBookingFormData(updatedFormData);
  };

  //Remove Error when cursor is removed
  const handleBlur = (e: { target: { name: any } }) => {
    const { name } = e.target;
    if (!bookingFormData[name]) {
      setErrors((prev) => ({ ...prev, [name]: ERROR_MESSAGE[name] }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  //Remove Error when cursor is removed

  // Error Handler Starts
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors: ValidationErrors = {};

    if (!bookingFormData.name) {
      validationErrors.name = 'Name is required';
    }

    if (!bookingFormData.email) {
      validationErrors.email = 'Email address is required';
    } else if (!isValidEmail(bookingFormData.email)) {
      validationErrors.email = 'Invalid email address';
    }

    if (!bookingFormData.phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    }

    if (!bookingFormData.ngState) {
      validationErrors.ngState = 'State is required';
    }

    if (!bookingFormData.lga) {
      validationErrors.lga = 'Local government is required';
    }

    if (!bookingFormData.date) {
      validationErrors.date = 'Date is required';
    }

    if (!bookingFormData.vehicleType) {
      validationErrors.vehicleType = 'Vehicle Type is required';
    }

    if (!bookingFormData.carBrand) {
      validationErrors.carBrand = 'Car brand is required';
    }

    if (!bookingFormData.carModel) {
      validationErrors.carModel = 'Car model is required';
    }
    if (!bookingFormData.carYear) {
      validationErrors.carYear = 'Car year is required';
    }
    if (!bookingFormData.service) {
      validationErrors.service = 'Service is required';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Handle form submission here
      setIsLoading(true);
      try {
        axios
          .post('https://lubesurgeons.com/server/send-booking', bookingFormData)
          .then((response) => {
            console.log(response.data.message);
          })
          .catch((error) => {
            // setMessage('An error occurred while sending the email');
            console.error('Error:', error);
          });
        const servicePrice = servicePrices[bookingFormData.service];
        const { data, error } = await supabase
          .from('bookings')
          .insert([{ ...bookingFormData, userId: userId, servicePrice }]);

        if (error) {
          console.error('Error inserting data:', error.message);
          // Handle the error
        } else {
          console.log('Data inserted successfully:', data);
          navigate('/');
        }
      } catch (error) {
        console.error('Error inserting data:', error.message);
        // Handle the error
      } finally {
        setIsLoading(false);
      }

      console.log('Form submitted:', bookingFormData);
    }
  };

  // Error Handler Stops

  const availableTimes = [];
  for (let hour = 7; hour <= 20; hour++) {
    availableTimes.push(setHours(setMinutes(new Date(), 0), hour));
    availableTimes.push(setHours(setMinutes(new Date(), 30), hour));
  }
  //Date ends

  //Car Year Option starts
  useEffect(() => {
    setYears(carYear.years);
  }, []);
  //Car Year Option end

  //  Car and brand select starts
  const selectedBrandData = carData.find((brand) => brand.brand === selectedBrand);
  const modelOptions = selectedBrandData ? selectedBrandData.models : [];

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedModel('');
    handleBookingChange(event);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const model = event.target.value;
    setSelectedModel(model);
    handleBookingChange(event);
  };
  //  Car and brand select stops

  //  State and LGA select starts
  const selectedStateData = statesData.find(
    (state: { state: string }) => state.state === selectedState
  );
  const lgaOptions = selectedStateData ? selectedStateData.lgas : [];

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedState(brand);
    setSelectedLga('');
    handleBookingChange(event);
  };

  const handleLgaChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const lgas = event.target.value;
    setSelectedLga(lgas);
    handleBookingChange(event);
  };
  //  State and LGA select stops

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Appointment Booked
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your appointment has been succcessfully booked. We’ve sent you an email with
                      all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}>
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="mx-auto px-4 px-md:px-8 lg:px-24 xl:px-30 bg-white h-full py-15">
        <div>
          <h1 className="sm:text-4xl text-2xl font-bold title-font py-4 text-bulaba">
            Start your booking
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <h2 className="sm:text-2xl text-xl font-medium title-font mb-2 mt-4 text-form-strokedark">
            What service do you require?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-6">
            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#212C47"
                  className="bi bi-gear-fill mr-2"
                  viewBox="0 0 16 16">
                  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                </svg>
                <select
                  name="service"
                  id="service"
                  className="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-primary focus:bg-transparent focus:ring-amber-400 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onBlur={handleBlur}
                  onChange={handleBookingChange}>
                  <option value="">Enter a service</option>
                  <option value="Vehicle Maintenance">Comprehensive Vehicle Maintenance</option>
                  <option value="Oil Change">Engine Oil Change</option>
                  <option value="Tyre Service">Tyre Care Service</option>
                  <option value="Cooling System">Cooling System Maintenance</option>
                  <option value="Brake System">Brake System Checkup</option>
                  <option value="Additional Service">Additional Vehicle Services</option>
                </select>
              </div>
              {errors.service && (
                <p className="text-danger text-xs italic ml-6 mt-1">{errors.service}</p>
              )}
            </div>
          </div>
          <h2 className="sm:text-2xl text-xl font-medium title-font mb-4 mt-4 text-form-strokedark">
            Provide your details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 transition-all">
            <div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#212C47"
                  className="bi bi-person-fill mr-2"
                  viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
                <input
                  name="name"
                  onBlur={handleBlur}
                  type="text"
                  id="name"
                  placeholder="Name"
                  onChange={handleBookingChange}
                  className="w-full placeholder:text-slate-400 placeholder:text-sm bg-white rounded-lg border border-gray-300 focus:border-primary focus:ring-amber-300 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              {errors.name && <p className="text-danger text-xs italic ml-6 mt-1">{errors.name}</p>}
            </div>
            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#212C47"
                  className="bi bi-envelope-fill mr-2"
                  viewBox="0 0 16 16">
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                </svg>
                <input
                  onBlur={handleBlur}
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  onChange={handleBookingChange}
                  className="w-full placeholder:text-slate-400 placeholder:text-sm bg-white rounded-lg border border-gray-300 focus:border-primary focus:ring-amber-300 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              {errors.email && (
                <p className="text-danger text-xs italic ml-6 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#212C47"
                  className="bi bi-telephone-fill mr-2"
                  viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                  />
                </svg>
                <input
                  name="phoneNumber"
                  type="tel"
                  onBlur={handleBlur}
                  placeholder="Enter phone number"
                  onChange={handleBookingChange}
                  className="w-full placeholder:text-slate-400 placeholder:text-sm bg-white rounded-lg border border-gray-300 focus:border-primary focus:ring-amber-300 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-danger text-xs italic ml-6 mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#212C47"
                  className="bi bi-geo-alt-fill mr-2"
                  viewBox="0 0 16 16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
                <select
                  name="ngState"
                  id="ngState"
                  className="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-primary focus:bg-transparent focus:ring-amber-400 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onBlur={handleBlur}
                  onChange={handleStateChange}
                  value={selectedState}>
                  <option value="">Enter a state</option>
                  {statesData.map((state) => (
                    <option key={state.state} value={state.state}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>
              {errors.ngState && (
                <p className="text-danger text-xs italic ml-6 mt-1">{errors.ngState}</p>
              )}
            </div>
            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#212C47"
                  className="bi bi-geo-fill mr-2"
                  viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"
                  />
                </svg>
                <select
                  name="lga"
                  id="lga"
                  className="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-primary focus:bg-transparent focus:ring-amber-400 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onBlur={handleBlur}
                  onChange={handleLgaChange}
                  value={selectedLga}>
                  <option value="">Select local government</option>
                  {lgaOptions.map((lgas) => (
                    <option key={lgas} value={lgas}>
                      {lgas}
                    </option>
                  ))}
                </select>
              </div>
              {errors.lga && <p className="text-danger text-xs italic ml-6 mt-1">{errors.lga}</p>}
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="#212C47"
                className="bi bi-calendar-check-fill mr-2"
                viewBox="0 0 16 16">
                <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
              </svg>
              <DateAndTimePicker
                handleDateChange={handleBookingChange}
                selectedDate={bookingFormData.date}
                name="date"
              />
            </div>
          </div>
          <h2 className="sm:text-2xl text-xl font-medium title-font mb-4 mt-8 text-form-strokedark">
            What kind of car do you drive?
          </h2>
          <Radio
            handleBlur={() => {
              return handleBlur({ target: { name: 'vehicleType' } }); // Pass the field name explicitly
            }}
            name="vehicleType"
            handleTypeChange={handleBookingChange}
            selectedType={bookingFormData.vehicleType}
          />
          {errors.vehicleType && (
            <p className="text-danger text-xs italic ml-6 mt-1">{errors.vehicleType}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-8">
            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#212C47"
                  className="bi bi-car-front-fill mr-3"
                  viewBox="0 0 16 16">
                  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
                </svg>
                <select
                  name="carBrand"
                  id="carBrand"
                  className="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-primary focus:bg-transparent focus:ring-amber-400 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onBlur={handleBlur}
                  onChange={handleBrandChange}
                  value={selectedBrand}>
                  <option value="">Select a brand</option>
                  {carData.map((brand) => (
                    <option key={brand.brand} value={brand.brand}>
                      {brand.brand}
                    </option>
                  ))}
                </select>
              </div>
              {errors.carBrand && (
                <p className="text-danger text-xs italic ml-6 mt-1">{errors.carBrand}</p>
              )}
            </div>
            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#212C47"
                  className="bi bi-box-fill mr-3"
                  viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"
                  />
                </svg>
                <select
                  name="carModel"
                  id="carModel"
                  className="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-primary focus:bg-transparent focus:ring-amber-400 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onBlur={handleBlur}
                  onChange={handleModelChange}
                  value={selectedModel}>
                  <option value="">Select a model</option>
                  {modelOptions.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
              {errors.carModel && (
                <p className="text-danger text-xs italic ml-6 mt-1">{errors.carModel}</p>
              )}
            </div>
            <div>
              <div className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#212C47"
                  className="bi bi-clock-fill mr-3"
                  viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                </svg>
                <select
                  onBlur={handleBlur}
                  onChange={handleBookingChange}
                  name="carYear"
                  id="carYear"
                  className="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-primary focus:bg-transparent focus:ring-amber-400 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out">
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {errors.carYear && (
                <p className="text-danger text-xs italic ml-6 mt-1">{errors.carYear}</p>
              )}
            </div>
          </div>
          <div className="flex justify-start mt-4">
            <button
              className="inline-flex items-center bg-bulaba border-2 border-bulaba py-2 px-12 focus:outline-none hover:bg-white hover:text-boxdark-2 hover:border-2 hover:border-bulaba transition-all rounded-lg text-white mt-4 md:mt-0"
              type="submit"
              disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Book now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CarForm;
