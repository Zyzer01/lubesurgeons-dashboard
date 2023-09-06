import { ChangeEvent, FormEvent, SetStateAction, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import axios from 'axios';
import Popup from '../components/Popup';

interface contactFormData {
  fName: string;
  lName: string;
  email: string;
  subject: string;
  message: string;
}

interface ValidationErrors {
  fName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ERROR_MESSAGE = {
  fName: 'Name is required',
  email: 'Email address is required',
  subject: 'Subject is required',
  message: 'Message is required',
};

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<ValidationErrors>({});
  const [contactFormData, setContactFormData] = useState<contactFormData>({
    fName: '',
    lName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const openPopup = (message: SetStateAction<string>) => {
    setPopupMessage(message);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleBookingChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...contactFormData, [name]: value };

    setContactFormData(updatedFormData);
  };

  //Remove Error when cursor is removed
  const handleBlur = (e: { target: { name: any } }) => {
    const { name } = e.target;
    if (!contactFormData[name]) {
      setFormError((prev) => ({ ...prev, [name]: ERROR_MESSAGE[name] }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: '' }));
    }
  };
  //Remove Error when cursor is removed

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors: ValidationErrors = {};
    if (!contactFormData.fName) {
      validationErrors.fName = 'First name is required';
    }
    if (!contactFormData.email) {
      validationErrors.email = 'Email is required';
    } else if (!isValidEmail) {
      validationErrors.email = 'Invalid email address';
    }
    if (!contactFormData.subject) {
      validationErrors.subject = 'Subject is required';
    }
    if (!contactFormData.message) {
      validationErrors.message = 'Message is required';
    }
    setFormError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        axios
          .post('http://localhost:3000/send-message', contactFormData)
          .then((response) => {
            console.log(response.data.message);
            setIsLoading(false);
            openPopup('Message Sent Successfully');
          })
          .catch((error) => {
            openPopup('An Error Occured');
            console.error('Error:', error);
          });
      } catch (error) {
        console.error('Error inserting data:', error.message);
        // Handle the error
      }
      // } finally {
      // }
    }
    console.log(contactFormData);
  };

  return (
    <>
      <Popup isOpen={isPopupOpen} onClose={closePopup} message={popupMessage} />
      <Breadcrumb pageName="Contact" />
      <div className="grid grid-cols-5 gap-5">
        <div></div>
        <div className="rounded-sm border col-span-5 md:col-span-3 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="border-b border-stroke py-4 px-6.5 dark:border-strokedark font-medium text-black dark:text-white">
            Contact Us
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    First name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="fName"
                    placeholder="Enter your first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onBlur={handleBlur}
                    onChange={handleBookingChange}
                  />
                  {formError.fName && (
                    <p className="text-danger text-xs italic mt-1">
                      {formError.fName}
                    </p>
                  )}
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Last name
                  </label>
                  <input
                    name="lName"
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  onBlur={handleBlur}
                  onChange={handleBookingChange}
                />
                {formError.email && (
                  <p className="text-danger text-xs italic mt-1">
                    {formError.email}
                  </p>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Subject <span className="text-meta-1">*</span>
                </label>
                <input
                  name="subject"
                  type="text"
                  placeholder="Select subject"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  onBlur={handleBlur}
                  onChange={handleBookingChange}
                />
                {formError.subject && (
                  <p className="text-danger text-xs italic mt-1">
                    {formError.subject}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Message <span className="text-meta-1">*</span>
                </label>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Type your message"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  onBlur={handleBlur}
                  onChange={handleBookingChange}
                ></textarea>
                {formError.message && (
                  <p className="text-danger text-xs italic mt-1">
                    {formError.message}
                  </p>
                )}
              </div>

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                {isLoading ? 'Loading...' : 'Send message'}
              </button>
            </div>
          </form>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Contact;
