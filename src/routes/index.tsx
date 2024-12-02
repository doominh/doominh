import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import LoadingPage from '~/pages/LoadingPage';
import { DashboardLayout, AuthLayout, DefaultLayout } from '~/layouts';
import { NotLoggedMiddleware } from './RouteMiddleware';
import { ROLE } from '~/constants';
import Layout from '~/layouts/Layout';
import ChefDetail from '~/pages/chef/ChefDetail';

const MenuPage = lazy(() => import('~/pages/admin/MenuPage'));
const MenuDetail = lazy(() => import('~/components/menu-admin/MenuFoods'));

const AdminDashboard = lazy(() => import('~/pages/admin/AdminDashboard'));
const EmployessPages = lazy(() => import('~/pages/admin/EmployessPage'));
const BranchPage = lazy(() => import('~/pages/admin/BranchPage'));
const RequestEmployess = lazy(
  () => import('~/pages/admin/employees/RequestEmployess')
);
const BranchDetails = lazy(
  () => import('~/pages/admin/branches/BranchDetails')
);
const UpdateBranch = lazy(() => import('~/pages/admin/branches/UpdateBranch'));
const PostBranch = lazy(() => import('~/pages/admin/branches/PostBranch'));
const EmployeesDetails = lazy(
  () => import('~/pages/admin/employees/EmployeesDetails')
);
const RevenuePage = lazy(() => import('~/pages/admin/RevenuePage'));

const UpdateEmployees = lazy(
  () => import('~/pages/admin/employees/UpdateEmployees')
);
const PostEmployee = lazy(() => import('~/pages/admin/employees/PostEmployee'));

const ChefDashboard = lazy(() => import('~/pages/chef/ChefDashboard'));
const CustomerPage = lazy(() => import('~/pages/customer/CustomerPage'));
const EmployeeDashboard = lazy(
  () => import('~/pages/employee/EmployeeDashboard/EmployeeDashboard')
);
const LandingPage = lazy(() => import('~/pages/LandingPage'));
const Login = lazy(() => import('~/pages/auth/Login'));
const NotFound = lazy(() => import('~/pages/custom/NotFound'));
const SignUp = lazy(() => import('~/pages/auth/SignUp'));

const EmployeeMenuManager = lazy(
  () => import('~/pages/employee/EmployeeMenuManager')
);
const EmployeeTableManager = lazy(
  () => import('~/pages/employee/EmployeeTableManager/EmployeeTableManager')
);

const ProductDetailsCustomer = lazy(
  () => import('~/pages/customer/ProductDetailsCustomer')
);
const BillCustomer = lazy(() => import('~/pages/customer/BillCustomer'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage loading={true} />}>
      <Routes>
        {/* auth */}
        <Route element={<NotLoggedMiddleware />}>
          <Route element={<AuthLayout />}>
            <Route path="/auth">
              <Route path="login" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<LandingPage />} />

        {/* employee */}
        <Route
          path="/employee"
          element={<PrivateRoute allowedRoles={[ROLE.ADMIN, ROLE.EMPLOYEE]} />}
        >
          <Route element={<DashboardLayout />}></Route>
          <Route element={<Layout />}>
            <Route index element={<EmployeeDashboard />} />

            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="menu-manager" element={<EmployeeMenuManager />} />

            <Route path="tables-manager" element={<EmployeeTableManager />} />
          </Route>
        </Route>

        {/* chef */}
        <Route
          path="/chef"
          element={<PrivateRoute allowedRoles={[ROLE.ADMIN, ROLE.CHEF]} />}
        >
          <Route element={<Layout />}>
            <Route index element={<ChefDashboard />} />
            <Route path=":id" element={<ChefDetail />} />
          </Route>
        </Route>

        {/* customer */}
        <Route path="/customer" element={<DefaultLayout />}>
          <Route index element={<CustomerPage />} />
          <Route path=":id" element={<ProductDetailsCustomer />} />
          <Route path="bill" element={<BillCustomer />} />
        </Route>

        {/* admin */}
        <Route
          path="/admin"
          element={<PrivateRoute allowedRoles={[ROLE.ADMIN]} />}
        >
          <Route element={<DashboardLayout />}>
            <Route index path="" element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployessPages />} />
            <Route path="request-employess" element={<RequestEmployess />} />
            <Route path="branch" element={<BranchPage />} />
            <Route path="branch/:id" element={<BranchDetails />} />
            <Route path="update-branch/:id" element={<UpdateBranch />} />
            <Route path="post-branch" element={<PostBranch />} />
            <Route path="employees/:id" element={<EmployeesDetails />} />
            <Route path="update-employee/:id" element={<UpdateEmployees />} />
            <Route path="post-employee" element={<PostEmployee />} />
            <Route path="menu-admin" element={<MenuPage />} />
            <Route path="menu-admin/:id" element={<MenuDetail />} />
            <Route path="revenue-managerment" element={<RevenuePage />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="tables-manager" element={<EmployeeTableManager />} />
            <Route path="menu-manager" element={<EmployeeMenuManager />} />
          </Route>
        </Route>

        <Route errorElement={<NotFound />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
