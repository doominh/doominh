import React from 'react';
import BarChartsRevenue from './BarChartsRevenue';
import { IoIosArrowRoundUp } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { useGetBranchesQuery } from '~/services/BaseApi.service';

interface MainRevenueProps {}

const MainRevenue: React.FC<MainRevenueProps> = () => {
  const { t } = useTranslation();
  const { data: branches, isLoading } = useGetBranchesQuery();

  const generateChartData = () => {
    const months = [
      'T1',
      'T2',
      'T3',
      'T4',
      'T5',
      'T6',
      'T7',
      'T8',
      'T9',
      'T10',
      'T11',
      'T12'
    ];

    const chartData = months.map(month => ({
      name: month,
      total: Math.floor(Math.random() * 91) + 10
    }));

    return chartData;
  };

  const chartData = generateChartData();

  return (
    <div>
      <div className="w-full rounded-lg bg-base-100 p-4 shadow-md">
        <div className="flex justify-between gap-[20px]">
          {/* title left  */}
          <div className="">
            <div className="flex items-center gap-[5px]">
              <p className="line-clamp-1">
                {t('adminPage.revenueManagerment.revenueTitle')}
              </p>
              <p className="flex items-center gap-[3px] rounded-lg bg-accent p-1 text-white">
                <IoIosArrowRoundUp />{' '}
                {t('adminPage.revenueManagerment.revenueIncrease')}
              </p>
            </div>
            <div className="mt-[7px] font-light">
              {t('adminPage.revenueManagerment.branch')}{' '}
              <span className="font-semibold text-primary">
                {t('adminPage.revenueManagerment.hcmc')}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-[10px]">
            <select className="select border-[0.5px] border-black">
              <option disabled selected>
                {t('adminPage.revenueManagerment.selectBranch')}
              </option>
              {!isLoading &&
                branches?.data?.map(branch => (
                  <option key={branch._id} value={String(branch._id)}>
                    {branch.name}
                  </option>
                ))}
            </select>
            <select className="select border-[0.5px] border-black">
              <option disabled selected>
                {t('adminPage.revenueManagerment.selectYear')}
              </option>
              <option>2024</option>
            </select>
          </div>
        </div>
        <div className="mt-[30px]">
          <BarChartsRevenue chartData={chartData} />
        </div>
      </div>
    </div>
  );
};

export default MainRevenue;
