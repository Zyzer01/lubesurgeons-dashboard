export const ResetPassword = () => {
  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark w-100 dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Enter a new password
          </h3>
        </div>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Re-enter Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <button className="flex w-full justify-center rounded bg-primary p-3 mt-6 font-medium text-gray">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
