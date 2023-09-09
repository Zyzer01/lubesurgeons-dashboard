import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectPath?: string;
  isAllowed: boolean;
  children?: React.ReactNode;
}

export const ProtectedRoute = ({
  redirectPath = '/auth/signin',
  isAllowed,
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
