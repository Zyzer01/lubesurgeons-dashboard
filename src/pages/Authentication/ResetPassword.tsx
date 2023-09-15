import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// Import the necessary Supabase functions here

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");

  // Function to handle password input change
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const navigate = useNavigate();

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    const reenteredPassword = e.target.reenteredPassword.value;
    if (newPassword !== reenteredPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Reset password using Supabase
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error("There was an error updating your password.");
    }
    toast.success("Password updated successfully!");
    navigate("/auth/signin");
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen px-4">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark w-100 dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Enter a new password
            </h3>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  name="reenteredPassword"
                  placeholder="Re-enter password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 mt-6 font-medium text-gray"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
