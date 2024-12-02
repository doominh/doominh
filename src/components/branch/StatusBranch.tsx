import React from 'react';
import { useTranslation } from 'react-i18next';

const StatusBranch: React.FC<{}> = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full w-full rounded-lg bg-base-100 p-2 shadow-sm">
      <div className="">
        <div className="mb-[10px]">
          <p className="text-[1.1rem] font-semibold text-primary">
            {t(
              'adminPage.branchesManagerment.branchDetails.statusBranch.orderStatus'
            )}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="table flex items-center ">
            {/* head */}
            <thead className="bg-primary text-center text-white">
              <tr>
                <th className="text-[1rem]">
                  {t(
                    'adminPage.branchesManagerment.branchDetails.statusBranch.tableNumber'
                  )}
                </th>
                <th className="text-[1rem]">
                  {t(
                    'adminPage.branchesManagerment.branchDetails.statusBranch.totalItems'
                  )}
                </th>
                <th className="text-[1rem]">
                  {t(
                    'adminPage.branchesManagerment.branchDetails.statusBranch.totalPrice'
                  )}
                </th>
                <th className="text-[1rem]">
                  {t(
                    'adminPage.branchesManagerment.branchDetails.statusBranch.employeeName'
                  )}
                </th>
                <th className="text-[1rem]">
                  {t(
                    'adminPage.branchesManagerment.branchDetails.statusBranch.status'
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {/* rows */}
              <tr>
                <td>42</td>
                <td className="text-[1rem]">
                  <p>7</p>
                </td>
                <td className="text-[1rem]">435.000vnđ</td>
                <td className="text-[1rem]">Thanh Vũ</td>
                <td className="text-green-500">
                  {t(
                    'adminPage.branchesManagerment.branchDetails.statusBranch.success'
                  )}
                </td>
              </tr>
              <tr>
                <td>41</td>
                <td className="text-[1rem]">
                  <p>8</p>
                </td>
                <td className="text-[1rem]">435.000vnđ</td>
                <td className="text-[1rem]">Thanh Vũ</td>
                <td className="text-green-500">
                  {t(
                    'adminPage.branchesManagerment.branchDetails.statusBranch.success'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusBranch;
