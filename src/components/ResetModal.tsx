import { useState, FC } from 'react';
import { Transition } from '@headlessui/react';
import { supabase } from '../config/supabaseClient';

// Define error messages
const ERROR_MESSAGE = {
  email: 'Email address is required',
  invalidEmail: 'Invalid email address',
};

// Interface for reset email props
interface ResetEmailProps {
  email: string;
}

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetModal: FC<ResetModalProps> = ({ isOpen, onClose }) => {
  // State variables
  const [resetEmail, setResetEmail] = useState<ResetEmailProps>({ email: '' });
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetEmail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: { [key: string]: string } = {};

    const isValidEmail = (email: string) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailRegex.test(email);
    };

    if (!resetEmail.email) {
      validationErrors.email = ERROR_MESSAGE.email;
    } else if (!isValidEmail(resetEmail.email)) {
      validationErrors.email = ERROR_MESSAGE.invalidEmail;
    }

    setSuccessMessage('');
    setFormError(validationErrors.email || '');

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
          resetEmail.email, // Use the entered email
          {
            redirectTo: 'http://example.com/account/update-password',
          },
        );

        if (error) {
          console.error('Password reset error:', error.message);
        } else {
          setSuccessMessage(
            'Password reset sent. Check your inbox or spam folder',
          );
        }
      } catch (error) {
        console.error('Password reset error:', (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`fixed inset-0 flex items-center justify-center z-12  ${
          isOpen ? 'visible' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-10"></div>
        <div className="bg-white rounded-lg z-10">
          <div className="flex justify-end">
            <div className="relative w-full max-w-lg p-4 mx-auto rounded-md shadow-2xl">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
                  onClick={onClose}
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
              <div className="max-w-sm mx-auto pt-3 pb-4 px-2 space-y-3 text-center">
                <h3 className="text-xl font-medium text-black">
                  Reset Password
                </h3>
                <p className="text-[15px] text-gray-600">
                  Enter the email address associated with your account and
                  we&apos;ll send you a link to reset your password.
                </p>
                <div className="relative">
                  <svg
                    className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <input
                    name="email"
                    type="text"
                    placeholder="Enter email address"
                    className="w-full pl-12 pr-3 py-3 text-gray-500 bg-transparent outline-none border focus:border-amber-500 shadow-sm rounded-lg"
                    onChange={handleChange}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="block w-full mt-4 py-3 px-4 font-medium text-sm text-center text-white bg-bulaba hover:bg-slate-900 active:bg-bulaba rounded-lg ring-offset-2 ring-bulaba focus:ring-2"
                >
                  {isLoading ? 'Loading...' : 'Reset Password'}
                </button>
                {formError && (
                  <p className="text-danger mt-4 text-center">{formError}</p>
                )}
                {successMessage && (
                  <p className="text-success mt-4 text-center">
                    {successMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default ResetModal;
