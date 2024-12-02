import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { sidebarRole } from '~/components/sidebar/SidebarNavigation';

export function NotLoggedMiddleware() {
  const auth = useAppSelector((state: RootState) => state.auth);

  const role = auth.currentUser.role;
  const sidebar = role ? sidebarRole[role] : [];
  const redirectPath = sidebar.length > 0 ? sidebar[0].path : '/';
  return auth.loggedIn && auth.currentUser.token ? (
    <Navigate to={redirectPath} replace />
  ) : (
    <Outlet />
  );
}
