import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBooking from '../components/AdminBooking';
import { supabase } from '../config/supabaseAdminClient';
import UserCard from '../components/UserCard';
import UserIcon from '../images/icon/UserIcon';
import OrderIcon from '../images/icon/OrderIcon';
import SaleIcon from '../images/icon/SaleIcon';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);

  // Authentication Check
  // useEffect(() => {
  //   const checkUserAuthentication = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) {
  //       navigate('/admin/auth/signin');
  //     }
  //   };
  //   checkUserAuthentication();
  // }, [navigate]);

  useEffect(() => {
    const fetchUserCount = async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error('Error fetching user list:', error);
      } else {
        setUserCount(data.users.length);
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
    const fetchOrderCount = async () => {
      const { data, count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      setOrderCount(count);
    };
    fetchOrderCount();
  }, []);

  useEffect(() => {
    const fetchTotalSales = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('servicePrice')
        .eq('paymentStatus', 'successful');

      if (error) {
        console.error('Error fetching total sales:', error);
      } else {
        if (data && data.length > 0) {
          const totalSales = data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.servicePrice;
          }, 0);
          setSalesTotal(totalSales);
        }
      }
    };
    fetchTotalSales();
  }, []);

  return (
    <>
      <h3 className="text-xl text-start font-medium mb-4 text-black dark:text-white">
        Overview
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <UserCard
          icon={<OrderIcon />}
          label="Orders"
          count={orderCount} // Replace with your actual order count
          linkTo="orders"
        />
        <UserCard
          icon={<UserIcon />}
          label="Users"
          count={userCount} // Display the fetched user count
          linkTo="users"
        />
        <UserCard
          icon={<SaleIcon />}
          label="Sales"
          count={Number(salesTotal).toLocaleString('en-US', {
            style: 'currency',
            currency: 'NGN',
          })}
          linkTo="sales"
        />
      </div>
      <h3 className="text-xl text-start font-medium mb-2 mt-8 text-black dark:text-white">
        Appointments
      </h3>
      <AdminBooking />
    </>
  );
};

export default AdminDashboard;
