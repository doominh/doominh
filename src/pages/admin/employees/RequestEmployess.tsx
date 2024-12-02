// RequestEmployees.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  useGetPendingUsersQuery,
  useApproveUserMutation
} from '~/services/employee/employeeApi.service';
import { toast } from 'react-toastify';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import Loading from '~/components/Loading/LoadingLocal';
import { GrPrevious } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-daisyui';

const RequestEmployees: React.FC<{}> = () => {
  const {
    data: pendingUsersData,
    isLoading,
    refetch
  } = useGetPendingUsersQuery();
  const [approveUser, { isLoading: isApproving }] = useApproveUserMutation();
  const { t } = useTranslation();

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await approveUser({ id: userId, status: 1 });
      if ('error' in response && response.error) {
        let errorMessage: string = t(
          'adminPage.requestEmployees.error.approve_user'
        );
        if ('message' in response.error && response.error.message) {
          errorMessage = response.error.message;
        }
        throw new Error(errorMessage);
      }
      toast.success(t('adminPage.requestEmployees.success.approve_user'));
      refetch();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error(t('adminPage.requestEmployees.error.approve_user'));
    }
  };

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

  return (
    <div className="">
      <HeaderDashboard title={t('adminPage.requestEmployees.pending_users')} />
      <div className="m-[10px] pt-[30px] xl:mx-0 xl:p-0">
        <div className="mb-[20px] flex items-center gap-[10px] pt-[30px]">
          <Link to="/admin/employees">
            <Button color="primary" className="text-white">
              <GrPrevious />
              {t('adminPage.requestEmployees.back')}
            </Button>
          </Link>
        </div>
        <div className="rounded-lg bg-base-100 ">
          <div className="overflow-x-auto">
            <table className="table flex items-center">
              {/* head */}
              <thead className="bg-primary text-center text-white">
                <tr className="text-[.9rem]">
                  <th>STT</th>
                  <th>{t('adminPage.requestEmployees.employee_name')}</th>
                  <th>{t('adminPage.requestEmployees.position')}</th>
                  <th>{t('adminPage.requestEmployees.email')}</th>
                  <th>{t('adminPage.requestEmployees.phone')}</th>
                  <th>{t('adminPage.requestEmployees.action')}</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {pendingUsersData?.data.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      {t('adminPage.requestEmployees.no_pending_users')}
                    </td>
                  </tr>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pendingUsersData?.data.map((user: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <p className="font-bold ">{user.username}</p>
                      </td>
                      <td>
                        <p>{user.role}</p>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <div className="flex items-center justify-center gap-[10px]">
                          {/* approve user */}
                          <div className="">
                            <Button
                              color="accent"
                              className={`  cursor-pointer ${isApproving ? 'cursor-not-allowed opacity-50' : 'accent'} text-white`}
                              onClick={() => handleApproveUser(user._id)}
                              disabled={isApproving}
                            >
                              {isApproving
                                ? t(
                                    'adminPage.requestEmployees.success.approving'
                                  )
                                : t(
                                    'adminPage.requestEmployees.success.approve'
                                  )}
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestEmployees;
