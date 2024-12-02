// admin pages
export { default as AdminDashboard } from './admin/AdminDashboard';
export { default as EmployessPages } from './admin/EmployessPage';
export { default as RequestEmployess } from '~/pages/admin/employees/RequestEmployess';
export { default as BranchPage } from './admin/BranchPage';
export { default as BranchDetails } from './admin/branches/BranchDetails';
export { default as RevenuePage } from './admin/RevenuePage';
export { default as PostBranch } from './admin/branches/PostBranch';
export { default as UpdateEmployees } from './admin/branches/UpdateBranch';
export { default as EmployeesDetails } from './admin/employees/EmployeesDetails';
export { default as PostEmployee } from './admin/employees/PostEmployee';

// auth pages
export { default as Login } from './auth/Login';
export { default as SignUp } from './auth/SignUp';

// employee pages
export { default as EmployeeDashboard } from './employee/EmployeeDashboard/EmployeeDashboard';
export { default as EmployeeMenuManager } from './employee/EmployeeMenuManager';
export { default as EmployeeTableManager } from './employee/EmployeeTableManager/EmployeeTableManager';

// chef pages
export { default as ChefDashboard } from './chef/ChefDashboard';

// customer pages
export { default as CustomerPage } from './customer/CustomerPage';
export { default as ProductDetails } from './customer/ProductDetailsCustomer';
export { default as BillCustomer } from './customer/BillCustomer';

// landing page
export { default as LandingPage } from './LandingPage';

// not found page
export { default as NotFound } from './custom/NotFound';

// forbidden page
export { default as ForbiddenPage } from './custom/ForbiddenPage';
