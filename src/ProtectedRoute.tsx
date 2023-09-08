import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ redirectPath = '/auth/signin', isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
