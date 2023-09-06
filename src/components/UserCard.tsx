import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface UserCardProps {
  icon: ReactNode;
  label: string;
  count: string | number;
  linkTo: string;
}

const UserCard: React.FC<UserCardProps> = ({ icon, label, count, linkTo }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-12.5 w-12.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {icon}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {label}
          </h4>
          <span className="text-sm font-bold">{count}</span>
        </div>
        <Link to={linkTo}>
          <span className="flex items-center gap-1 text-sm font-medium text-form-input underline dark:text-white">
            View details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-right-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
