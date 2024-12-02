import React from 'react';
import { useTranslation } from 'react-i18next';

const RecentActiveBranch: React.FC<{}> = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full rounded-lg bg-base-100 p-2 shadow-sm">
      <div className="mb-[10px]">
        <p className="text-[1.1rem] font-semibold text-primary">
          {t(
            'adminPage.branchesManagerment.branchDetails.recentActiveBranch.recentActivity'
          )}
        </p>
      </div>
      <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
        <li>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-start mb-10 md:text-end">
            {/*<time className="">10:24:30 ngày 20/3/2024</time>*/}
            <div className="text-lg text-secondary">
              {t(
                'adminPage.branchesManagerment.branchDetails.recentActiveBranch.billCreated'
              )}
            </div>
            {t(
              'adminPage.branchesManagerment.branchDetails.recentActiveBranch.tableNumber'
            )}
            14
          </div>
          <hr className="bg-primary" />
        </li>
        <li>
          <hr className="bg-primary" />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end mb-10">
            {/*<time className="">11:24:30 ngày 21/3/2024</time>*/}
            <div className="text-lg text-secondary">
              {t(
                'adminPage.branchesManagerment.branchDetails.recentActiveBranch.revenueIncreased'
              )}
            </div>
            +113.000
          </div>
          <hr />
        </li>
      </ul>
    </div>
  );
};

export default RecentActiveBranch;
