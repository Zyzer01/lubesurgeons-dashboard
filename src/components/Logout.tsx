import { NavLink, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

interface LogoutButtonProps {
  link: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ link }) => {
  const location = useLocation();
  const { pathname } = location;
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
      } else {
        console.log('User is logged out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <NavLink
      onClick={handleLogout}
      to={link}
      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
        pathname.includes('logout') && 'bg-graydark dark:bg-meta-4'
      }`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        className="bi bi-box-arrow-left"
        viewBox="0 0 16 16">
        <path
          fillRule="evenodd"
          d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
        />
        <path
          fillRule="evenodd"
          d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
        />
      </svg>
      Logout
    </NavLink>
  );
};

export default LogoutButton;
