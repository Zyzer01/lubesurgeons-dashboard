import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import AdminSignIn from './pages/Authentication/AdminSignIn';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminSales from './pages/AdminSales';
import Book from './pages/Book';
import { ResetPassword } from './pages/Authentication/ResetPassword';
import { supabase } from './config/supabaseClient';

// Assuming you have a function to check the user's authentication status
const isAuthenticated = async (): Promise<boolean> => {
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error checking authentication:', error);
    return false;
  }

  return !!user; // Return true if user exists (authenticated), false otherwise
};

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const AdminLayout = lazy(() => import('./layout/AdminLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when the component mounts
    isAuthenticated()
      .then((result) => {
        if (!result) {
          navigate('/auth/signin'); // Redirect to login page if not authenticated
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error checking authentication:', error);
        setLoading(false);
      });
  }, [navigate]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto" />

      <Routes>
        <Route path="/book" element={<Book />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route element={<DefaultLayout />}>
          <Route index element={<Dashboard />} />
          {routes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<Loader />}>
                  <Component session={undefined} />
                </Suspense>
              }
            />
          ))}
        </Route>
        <Route path="/admin/auth/signin" element={<AdminSignIn />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sales" element={<AdminSales />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
