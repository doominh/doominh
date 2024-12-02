import React from 'react';
import { Link } from 'react-router-dom';
import { IBranch } from '~/types/branch';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-daisyui';

interface Props {
  branches: IBranch[];
  startIndex: number;
}

const TableBranch: React.FC<Props> = ({ branches, startIndex }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-[25px] mt-[20px] overflow-x-auto  rounded-lg bg-base-100 p-3 ">
      <div className=" overflow-x-auto scrollbar-hide ">
        <table className="table table-zebra ">
          <thead className="rounded-lg  bg-primary text-center text-[.9rem] text-white">
            <tr>
              <th>
                {t(
                  'adminPage.branchesManagerment.mainBranch.tableBranch.serialNumber'
                )}
              </th>
              <th>
                {t(
                  'adminPage.branchesManagerment.mainBranch.tableBranch.branch'
                )}
              </th>
              {/* <th>Địa chỉ</th> */}
              <th>
                {t(
                  'adminPage.branchesManagerment.mainBranch.tableBranch.email'
                )}
              </th>
              {/* <th>Số lượng nhân viên</th> */}
              <th>
                {t(
                  'adminPage.branchesManagerment.mainBranch.tableBranch.phoneNumber'
                )}
              </th>
              <th>
                {t(
                  'adminPage.branchesManagerment.mainBranch.tableBranch.openingClosingHours'
                )}
              </th>
              <th>
                {t(
                  'adminPage.branchesManagerment.mainBranch.tableBranch.status'
                )}
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {branches.map((branch, index) => (
              <tr key={branch._id}>
                <td className="font-semibold">{startIndex + index + 1}</td>
                <td>{branch.name}</td>
                {/* <td className="line-clamp-1">{branch.address}</td> */}
                <td>{branch.email}</td>
                {/* <td>{branch.employee.length}</td> */}
                <td>{branch.phone_number}</td>
                <td>{`${branch.open} giờ sáng - ${branch.close} giờ tối`}</td>
                <td className="flex w-full justify-center text-center">
                  <div className="flex items-center justify-center gap-[10px]">
                    <Link to={`/admin/branch/${branch._id}`}>
                      <Button color="secondary" className="text-white ">
                        {t(
                          'adminPage.branchesManagerment.mainBranch.tableBranch.view'
                        )}
                      </Button>
                    </Link>
                    <Link to={`/admin/update-branch/${branch._id}`}>
                      <Button color="accent" className="text-white ">
                        {t(
                          'adminPage.branchesManagerment.mainBranch.tableBranch.update'
                        )}
                      </Button>
                    </Link>
                    {/* <button className="btn bg-red-500 text-white hover:bg-red-600 hover:opacity-[0.6]">
                    Xóa
                  </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBranch;
