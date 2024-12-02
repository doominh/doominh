import React from 'react';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import MainDashboard from '~/components/dashboard/MainDashboard';

const AdminDashboard: React.FC<{}> = () => {
  return (
    <div>
      <HeaderDashboard />
      <div className="m-[10px] xl:mx-0">
        <MainDashboard />
      </div>
    </div>
  );
};

export default AdminDashboard;
