import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import RecentActiveBranch from '~/components/branch/RecentActiveBranch';
import StatusBranch from '~/components/branch/StatusBranch';
import StatsDashboard from '~/components/charts/StatsDashboard';
import AreCharts from '~/components/charts/AreaCharts';
import SimpleAreaCharts from '~/components/charts/SimpleAreaCharts';
import { IBranch } from '~/types/branch';
import Loading from '~/components/Loading/LoadingLocal';
import { useGetBranchByIdQuery } from '~/services/BaseApi.service';
import { GrPrevious } from 'react-icons/gr';
import { useGetUserByIdQuery } from '~/services/employee/employeeApi.service';
import { BiGitBranch } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { FaRegUserCircle } from 'react-icons/fa';
import { useGetMenuDetailByIdQuery } from '~/services/menu/menu.service';
import { useTranslation } from 'react-i18next';

const BranchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: branch, isLoading } = useGetBranchByIdQuery(id || '');

  console.log(branch);
  const [branchData, setBranchData] = useState<IBranch | null>(null);
  const { data: user } = useGetUserByIdQuery(branchData?.user_id || '');

  const { data: menuData } = useGetMenuDetailByIdQuery(
    branchData?.menu_id || ''
  );

  useEffect(() => {
    if (branch) {
      setBranchData(branch.data);
    }
  }, [branch]);

  if (isLoading) {
    return (
      <div>
        <HeaderDashboard />
        <div className="pt-[30px] md:pt-0">
          <Loading />
        </div>
      </div>
    );
  }

  if (!branchData) {
    return (
      <div>
        <HeaderDashboard />
        <div className="pt-[30px] md:pt-0">
          {' '}
          <Loading />
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} lúc ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="">
      <HeaderDashboard />
      <div className="m-[10px] pt-[50px] md:m-[20px] md:pt-[30px] xl:mx-0 xl:p-0">
        <div className="mb-[20px] flex  items-center gap-[10px]">
          <Link to="/admin/branch">
            <button className="btn bg-primary text-white hover:bg-primary hover:opacity-[0.6]">
              <GrPrevious />
              {t('adminPage.branchesManagerment.branchDetails.backButton')}
            </button>
          </Link>
        </div>
        <div className="mb-[10px] mt-5 w-full rounded-lg bg-base-100 p-3">
          <div className="mb-[10px] flex flex-wrap items-center justify-between md:flex-row">
            <p className="flex items-center gap-[4px] ">
              <BiGitBranch />
              {t('adminPage.branchesManagerment.branchDetails.branch')}:{' '}
              <span className="font-normal text-primary">
                {branchData.name}
              </span>
            </p>
            <p className="flex flex-wrap items-center gap-[4px] md:flex-row ">
              <FaRegClock />
              {t(
                'adminPage.branchesManagerment.branchDetails.openingClosingHours'
              )}
              :{' '}
              <span className="font-normal ">
                {`${branchData.open} giờ - ${branchData.close} giờ`}
              </span>
            </p>
          </div>
          <p className="">
            {t('shared.menu')}:{' '}
            <span className="font-normal text-primary">
              {menuData ? menuData.data?.name : t('message.emptyMenu')}
            </span>
          </p>
          <p className="">
            {t('shared.address')}:{' '}
            <span className="font-normal ">{branchData.address}</span>
          </p>
          <p className="">
            {t('user.email')}:{' '}
            <span className="font-normal ">{branchData.email}</span>
          </p>
          <p className="">
            {t('shared.phone')}:{' '}
            <span className="font-normal ">{branchData.phone_number}</span>
          </p>
          <div className="my-[10px]">
            <p>
              {t('shared.createdAt')}: {formatDate(branchData.createdAt)}
            </p>
            <p>
              {t('shared.updatedAt')}: {formatDate(branchData.updatedAt)}
            </p>
          </div>
          <p className="flex items-center gap-[4px] ">
            <FaRegUserCircle />
            {t('adminPage.branchesManagerment.branchDetails.creator')}:{' '}
            <span className="text-primary">
              {user
                ? user?.data?.fullname !== undefined
                  ? user?.data?.fullname
                  : t('adminPage.branchesManagerment.branchDetails.anonymous')
                : t('adminPage.branchesManagerment.branchDetails.loading')}
            </span>
          </p>
        </div>
        <div className="mb-[10px] mt-5 grid grid-cols-1 flex-wrap items-center justify-between gap-[10px] md:grid-cols-2">
          <SimpleAreaCharts />
          <AreCharts />
        </div>
        <div className="my-10">
          <StatsDashboard />
        </div>
        <div className="mt-[20px] grid w-full grid-cols-1 gap-[10px] md:grid-cols-2">
          <RecentActiveBranch />
          <StatusBranch />
        </div>
      </div>
    </div>
  );
};

export default BranchDetails;
