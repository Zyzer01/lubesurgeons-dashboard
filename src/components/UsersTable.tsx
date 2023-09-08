import { useState, useEffect } from 'react';
import userx from '../images/user/userx.png';
import { supabase } from '../config/supabaseAdminClient';
import MyModal from './Modal';
import Roller from '../components/Roller';

const UsersTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState('');
  const [lubesurgeonUsers, setLubesurgeonUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true); // Start loading
        const {
          data: { users },
          error,
        } = await supabase.auth.admin.listUsers();
        setIsLoading(false); // End loading

        if (!error) {
          const filteredUsers = users.filter(
            (user) => user.id !== 'b9522e4b-2a7a-4e7f-ad5c-068fb7b13165'
          );
          setLubesurgeonUsers(filteredUsers);
        } else {
          console.error('Error fetching users:', error);
        }
      } catch (error) {
        setIsLoading(false); // End loading
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setError('Deleting...');
    try {
      const { data, error } = await supabase.auth.admin.deleteUser(userId);
      if (!error) {
        console.log('User deleted successfully');
        setLubesurgeonUsers(lubesurgeonUsers.filter((user) => user.id !== userId));
      } else {
        console.error('Error deleting user:', error);
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    } finally {
      setError('');
    }
  };

  const confirmDelete = () => {
    if (deleteUserId !== null) {
      handleDelete(deleteUserId);
    }
    setCancelModalOpen(false);
    setDeleteUserId(null);
  };

  return (
    <>
      <MyModal
        isOpen={cancelModalOpen}
        closeModal={() => setCancelModalOpen(false)}
        actionText="Delete user"
        actionSub="This action is irreversible. Are you sure you want to delete this user?"
        onActionClick={confirmDelete}
        buttonColor="bg-danger"
      />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Active Users</h4>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Phone Number</h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5>
            </div>
          </div>

          {isLoading ? (
            <Roller />
          ) : (
            lubesurgeonUsers.map((user) => (
              <div
                className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-4"
                key={user.id}>
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8" src={userx} alt="Brand" />
                  </div>
                  <p className="hidden text-black dark:text-white sm:block">
                    {user.user_metadata.full_name}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3 dark:text-white">{user.email}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black">{user.user_metadata.phone}</p>
                </div>
                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <button
                    type="button"
                    className="text-meta-1 rounded-md border border-danger px-4 py-2 text-sm font-medium hover:text-white hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
                    onClick={() => {
                      setDeleteUserId(user.id);
                      setCancelModalOpen(true);
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          <p className="text-center text-danger py-3">{error}</p>
        </div>
      </div>
    </>
  );
};

export default UsersTable;
