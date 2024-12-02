import React from 'react';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import MainMenu from '~/components/menu-admin/MainMenu';

const MenuPage: React.FC<{}> = () => {
  return (
    <div className="">
      <HeaderDashboard />
      <div className="m-[10px] pt-[30px] xl:mx-0 xl:p-0">
        <MainMenu />
      </div>
    </div>
  );
};

export default MenuPage;
