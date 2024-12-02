import React from 'react';
import { RiBillLine } from 'react-icons/ri';
import { FiUsers } from 'react-icons/fi';
import { GrMapLocation } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

const StatsDashboard: React.FC<{}> = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-[25px] overflow-x-auto pt-[30px] md:pt-0">
      <div className="stats flex items-center gap-[10px] rounded-lg bg-transparent shadow scrollbar-hide md:gap-[30px]">
        {/* bill */}
        <div className="stat rounded-lg border-none bg-gradient-to-r from-indigo-500  to-indigo-400">
          <div className="stat-figure text-secondary">
            <RiBillLine className="text-[2rem] text-white" />
          </div>
          <div className="stat-title font-semibold text-white">
            {t('adminPage.dashboard.stats.billTitle')}
          </div>
          <div className="stat-value my-4 text-white">312</div>
          <div className="stat-desc text-[14px] text-white">
            {t('adminPage.dashboard.stats.billDesc')}
          </div>
        </div>
        {/* employment  */}
        <div className="stat rounded-lg border-none bg-gradient-to-r from-cyan-500 to-blue-500">
          <div className="stat-figure text-secondary">
            <FiUsers className="text-[2rem]  text-white" />
          </div>
          <div className="stat-title font-semibold text-white">
            {t('adminPage.dashboard.stats.employeeTitle')}
          </div>
          <div className="stat-value my-4 text-white">12</div>
          <div className="stat-desc  text-[14px] text-white">
            {t('adminPage.dashboard.stats.employeeDesc')}
          </div>
        </div>

        {/* stats */}
        <div className="stat rounded-lg border-none bg-gradient-to-r from-red-400 to-primary">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title font-semibold text-white">
            {t('adminPage.dashboard.stats.revenueTitle')}
          </div>
          <div className="stat-value my-4 text-[1.1rem] text-white">
            122.000.000 VNĐ
          </div>
          <div className="stat-desc text-[14px] text-white">
            {t('adminPage.dashboard.stats.revenueDesc')}
          </div>
        </div>

        {/* department  */}
        <div className="stat rounded-lg border-none bg-gradient-to-r from-green-400 to-green-500">
          <div className="stat-figure text-secondary">
            <GrMapLocation className="text-[2rem] text-white" />
          </div>
          <div className="stat-title font-semibold text-white">
            {t('adminPage.dashboard.stats.branchTitle')}
          </div>
          <div className="stat-value my-4 text-white">8</div>
          <div className="stat-desc text-[14px] text-white">
            {t('adminPage.dashboard.stats.branchDesc')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
