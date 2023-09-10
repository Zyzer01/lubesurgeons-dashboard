import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import AdminSignIn from './pages/Authentication/AdminSignIn';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import { AuthProvider, useAuth } from './context/AuthContext';
import Loader from './common/Loader';
import routes from './routes';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminSales from './pages/AdminSales';
import Book from './pages/Book';
import { ResetPassword } from './pages/Authentication/ResetPassword';
import { ProtectedRoute } from './ProtectedRoute';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const AdminLayout = lazy(() => import('./layout/AdminLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto" />
      <AuthProvider>
        <Routes>
          <ProtectedRoute isAllowed={user}>
            <Route path="/book" element={<Book />} />
          </ProtectedRoute>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="*" element={<p>There's nothing here, 404 error</p>}></Route>
          <Route element={<DefaultLayout />}>
            <Route
              index
              element={
                <ProtectedRoute isAllowed={user}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {routes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute isAllowed={user}>
                    <Suspense fallback={<Loader />}>
                      <Component session={undefined} />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
          <Route path="/admin/auth/signin" element={<AdminSignIn />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/auth/signin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/auth/signin">
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/auth/signin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="sales"
              element={
                <ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/auth/signin">
                  <AdminSales />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
