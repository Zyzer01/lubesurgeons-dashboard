import { lazy } from 'react';

const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/AdminUsers'));
const AdminOrders = lazy(() => import('../pages/AdminOrders'));
const AdminSale = lazy(() => import('../pages/AdminSales'));
const Vehicles = lazy(() => import('../pages/Vehicles'));
const Bookings = lazy(() => import('../pages/Bookings'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Contact = lazy(() => import('../pages/Contact'));

const coreRoutes = [
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/contact',
    title: 'Contact',
    component: Contact,
  },
  {
    path: '/vehicles',
    title: 'Vehicles',
    component: Vehicles,
  },
  {
    path: '/bookings',
    title: 'Bookings',
    component: Bookings,
  },
  {
    path: '/admin',
    title: 'Admin',
    component: AdminDashboard,
  },
  {
    path: '/orders',
    title: 'Orders',
    component: AdminOrders,
  },
  {
    path: '/users',
    title: 'Users',
    component: AdminUsers,
  },
  {
    path: '/sales',
    title: 'Users',
    component: AdminSale,
  },
];

const routes = [...coreRoutes];
export default routes;
