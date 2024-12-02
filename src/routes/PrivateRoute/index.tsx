import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ForbiddenPage } from '~/pages';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { Toastify } from '~/helper/Toastify';
import { useEffect } from 'react';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

function PrivateRoute({ allowedRoles = [] }: PrivateRouteProps) {
  const auth = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();
  const history = useAppSelector(
    (state: RootState) => state.history.historyList
  );

  const authorized: boolean =
    allowedRoles.length > 0
      ? allowedRoles.some(role => role === auth.currentUser.role)
      : true;

  useEffect(() => {
    if (!auth.loggedIn || !auth.currentUser.token) {
      Toastify('Vui lòng đăng nhập để tiếp tục', 500);
    }
  }, [auth.loggedIn, auth.currentUser.token]);

  if (auth.loggedIn && history[0]?.path) {
    return <Navigate to={history[0].path} replace />;
  }

  return auth.loggedIn && auth.currentUser.token ? (
    authorized ? (
      <Outlet />
    ) : (
      <ForbiddenPage />
    )
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
}

export default PrivateRoute;
