import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useAppSelector } from '../../services/store';
import { selectUser, selectAuthChecked } from '../../slices/burger-slice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  unAuthOnly?: boolean;
};

export const ProtectedRoute = ({
  children,
  unAuthOnly = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectAuthChecked);

  if (!isAuthChecked) return <Preloader />;

  if (unAuthOnly && user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!unAuthOnly && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
