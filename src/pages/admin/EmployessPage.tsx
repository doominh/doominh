import React from 'react';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import MainEmployees from '~/components/employee/MainEmployees';

const EmployeeDashboard: React.FC<{}> = () => {
  return (
    <div className="">
      <HeaderDashboard />
      <div className="m-[10px] pt-[30px]  xl:mx-0 xl:p-0">
        <MainEmployees />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
