import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/lubsurgeons logo.png';
import Logo from '../../images/logo/lubsurgeons logo.png';
import signpImage from '../../images/cover/Sign.png';
import { supabase } from '../../config/supabaseClient';
import ResetModal from '../../components/ResetModal';
import { useAuth } from '../../context/AuthContext';

const ERROR_MESSAGE = {
  email: 'Email address is required',
  password: 'Passord is required',
};

interface LoginFormProps {
  email: string;
  password: string;
}
interface ErrorMessages {
  email: string;
  password: string;
  invalidEmail: string;
  passwordRequired: string;
  passwordLength: string;
  passwordCharacter: string;
}

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authMessage, setAuthMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginFormData, setLoginFormData] = useState<LoginFormProps>({
    email: '',
    password: '',
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const ERROR_MESSAGE = {
    email: 'Email is required',
    invalidEmail: 'Invalid email address',
    password: 'Password is required',
    passwordLength: 'Password must be at least 6 characters long',
    passwordCharacter: 'Password must contain at least one character',
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (authMessage) {
      timeoutId = setTimeout(() => {
        setAuthMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [authMessage]);

  const handleBlur = (name: keyof LoginFormProps) => {
    if (!loginFormData[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ERROR_MESSAGE[name],
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: { [key: string]: string } = {};

    const isValidEmail = (email: string) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailRegex.test(email);
    };

    if (!loginFormData.email) {
      validationErrors.email = ERROR_MESSAGE.email;
    } else if (!isValidEmail(loginFormData.email)) {
      validationErrors.email = ERROR_MESSAGE.invalidEmail;
    }

    if (!loginFormData.password) {
      validationErrors.password = ERROR_MESSAGE.password;
    } else if (loginFormData.password.length < 6) {
      validationErrors.password = ERROR_MESSAGE.passwordLength;
    } else if (!/[a-zA-Z]/.test(loginFormData.password)) {
      validationErrors.password = ERROR_MESSAGE.passwordCharacter;
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginFormData.email,
          password: loginFormData.password,
        });

        if (error) {
          if (error.code === 'NETWORK_ERROR') {
            console.error('Network error:', error.message);
            setAuthMessage('A network error occurred. Please check your internet connection.');
          } else {
            console.error('Login error:', error.message);
            setAuthMessage('Email or password does not match records.');
          }
        } else if (data?.user) {
          login(data.user);
          console.log('Logged in user:', data.user.id);
          navigate('/');
          window.location.reload();
        }
      } catch (error) {
        console.error('Login error:', (error as Error).message);
        setAuthMessage('An error occurred while signing in');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        console.error('Error signing in with Google:', error);
      } else {
        // Access the user's name
        const userName = user?.user_metadata?.full_name;

        if (userName) {
          console.log('User name:', userName);
        } else {
          console.warn('User name not available');
        }
        login(data.user);
        navigate('/');
        console.log('Successfully signed in with Google:', user);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full lg:block lg:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="hidden dark:block" src={Logo} width={300} height={450} alt="Logo" />
                <img className="dark:hidden" src={LogoDark} width={300} height={450} alt="Logo" />
              </Link>

              {/* <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
              </p> */}

              <span className="mt-15 inline-block">
                <img src={signpImage} alt="mechanic" width={300} height={350} />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark lg:w-1/2 lg:border-l-2">
            <div className="w-full p-8 sm:p-12.5 xl:p-17.5">
              {/* <Link to="/">
                <span className="mb-1.5 block font-medium">Back to home</span>
              </Link> */}
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign in to your account
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  {authMessage && <h3 className="text-center text-danger mb-5">{authMessage}</h3>}
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className={`${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={loginFormData.email}
                      onBlur={() => handleBlur('email')}
                      onChange={handleChange}
                    />
                    {errors.email && <p className="text-danger text-sm italic">{errors.email}</p>}
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="absolute right-0 -mt-6 mr-3"
                      onClick={togglePasswordVisibility}>
                      {!showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="bi bi-eye-slash"
                          viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-eye"
                          viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>
                      )}
                    </button>
                    <input
                      className={`${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="6+ Characters, 1 Capital letter"
                      value={loginFormData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                    />
                    {errors.password && (
                      <p className="text-danger text-sm italic">{errors.password}</p>
                    )}
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                  <div className="mt-5 mb-5.5 flex items-center justify-between">
                    <label htmlFor="formCheckbox" className="flex cursor-pointer">
                      <div className="relative pt-0.5">
                        <input type="checkbox" id="formCheckbox" className="taskCheckbox sr-only" />
                        <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark">
                          <span className="text-white opacity-0">
                            <svg
                              className="fill-current"
                              width="10"
                              height="7"
                              viewBox="0 0 10 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                                fill=""
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <p>Remember me</p>
                    </label>
                    <button type="button" className="text-medium text-primary" onClick={openModal}>
                      Forgot password?
                    </button>
                  </div>
                  <ResetModal isOpen={isModalOpen} onClose={closeModal} />
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90">
                    {isLoading ? 'Loading...' : 'Sign in'}
                  </button>
                </div>
              </form>
              {/* <button
                onClick={handleSignInWithGoogle}
                className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                <span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_191_13499)">
                      <path
                        d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                        fill="#EB4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_191_13499">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Sign in with Google
              </button> */}

              <div className="mt-6 text-center">
                <p>
                  Don’t have any account?{' '}
                  <Link to="/auth/signup" className="text-primary">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
