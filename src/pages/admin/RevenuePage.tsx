import React from 'react';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import MainRevenue from '~/components/charts/MainRevenue';

const RevenuePage: React.FC<{}> = () => {
  return (
    <div>
      <div className="">
        <HeaderDashboard />
        <div className="m-[10px] pt-[50px] md:m-[20px] md:pt-[30px] xl:mx-0 xl:p-0">
          <MainRevenue />
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;
