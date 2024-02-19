import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;