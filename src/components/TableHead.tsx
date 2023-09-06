const TableHead = () => {
  return (
    <thead>
      <tr className="bg-gray-2 text-left dark:bg-meta-4">
        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
          Vehicle
        </th>
        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
          Service
        </th>
        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
          Location
        </th>
        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
          Status
        </th>
        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
          Date
        </th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">
          Actions
        </th>
        <th className="py-4 px-4 font-medium text-black dark:text-white">
          Payment
        </th>
      </tr>
    </thead>
  );
};

export default TableHead;
