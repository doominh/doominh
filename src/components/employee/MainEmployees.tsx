import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useGetPendingUsersQuery,
  useGetUsersQuery
} from '~/services/employee/employeeApi.service';
import { CiCirclePlus } from 'react-icons/ci';
import GetEmployees from './GetEmployess';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-daisyui';

const MainEmployees: React.FC<{}> = () => {
  const { data: pendingUsersData } = useGetPendingUsersQuery();
  const { data: usersData } = useGetUsersQuery();
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setLoadingData(!pendingUsersData);
  }, [pendingUsersData]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    if (selectedUserId) {
      navigate(`/admin/employees/${selectedUserId}`);
    }
  };

  return (
    <div className="">
      <div className="mb-[20px] mt-[20px] flex items-center gap-[10px]">
        <select
          className="select w-full max-w-xs text-[1rem] outline-none"
          onChange={handleUserChange}
        >
          <option disabled selected>
            <p>{`${t(
              'adminPage.employeesManagerment.mainEmployees.userDropdownLabel'
            )} (${
              usersData?.data.length ??
              t('adminPage.employeesManagerment.mainEmployees.loading')
            }) `}</p>
          </option>
          {usersData &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            usersData.data.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
        </select>
        <select className="select w-full max-w-xs text-[1rem]">
          <option disabled selected>
            {t(
              'adminPage.employeesManagerment.mainEmployees.roleDropdownPlaceholder'
            )}
          </option>
          <option>
            {t(
              'adminPage.employeesManagerment.mainEmployees.roleOptionEmployee'
            )}
          </option>
          <option>
            {t(
              'adminPage.employeesManagerment.mainEmployees.roleOptionKitchen'
            )}
          </option>
        </select>
      </div>
      <div className="mb-[20px] flex items-center justify-between gap-[10px]">
        <Link to="/admin/request-employess" className=" text-primary">
          <Button color={'secondary'} className="text-white">
            {t('adminPage.employeesManagerment.mainEmployees.pendingUsersLink')}
            <span className="text-white">
              {loadingData ? 'Loading...' : pendingUsersData?.data.length}
            </span>
          </Button>
        </Link>
        <div className="">
          <Button color="secondary" className="text-white">
            <Link to="/admin/post-employee">
              <CiCirclePlus className="text-[1.4rem]" />
            </Link>
          </Button>
        </div>
      </div>
      <GetEmployees />
    </div>
  );
};

export default MainEmployees;
