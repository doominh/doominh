import React from 'react';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import MainBranch from '~/components/branch/MainBranch';

const BranchPage: React.FC<{}> = () => {
  return (
    <div className="">
      <HeaderDashboard />
      <div className="m-[10px] pt-[30px] xl:mx-0 xl:p-0">
        <MainBranch />
      </div>
    </div>
  );
};

export default BranchPage;
