import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetUserByIdQuery } from '~/services/employee/employeeApi.service';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import Loading from '~/components/Loading/LoadingLocal';
import { useGetBranchByIdQuery } from '~/services/BaseApi.service';
import { GrPrevious } from 'react-icons/gr';
import { FiEdit3 } from 'react-icons/fi';
import Avatar from 'boring-avatars';
import { Button, Hero } from 'react-daisyui';
import { useTranslation } from 'react-i18next';

const UserDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const {
    data: employee,
    error,
    isLoading,
    refetch
  } = useGetUserByIdQuery(id || '');

  const selectedEmployee = employee?.data;
  const { data: branchData } = useGetBranchByIdQuery(
    selectedEmployee?.branchId || ''
  );

  useEffect(() => {
    refetch();
  }, []);

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

  if (error) {
    return (
      <div>
        <HeaderDashboard />
        <div className="pt-[30px] md:pt-0">
          {t('adminPage.employeesManagerment.employeeDetails.loadingError')}
        </div>
      </div>
    );
  }

  if (!selectedEmployee) {
    return (
      <div>
        <HeaderDashboard />
        <div className="pt-[30px] md:pt-0">
          {t(
            'adminPage.employeesManagerment.employeeDetails.dataLoadingFailed'
          )}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${t('adminPage.employeesManagerment.employeeDetails.at')} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
  };

  return (
    <div>
      <HeaderDashboard />
      <div className="mx-[10px] pt-[40px] md:m-[20px] md:my-[50px] md:pt-[10px] xl:mx-0 xl:my-[10px] xl:p-0">
        <div className="mt-[0px] rounded-lg bg-base-100 p-2  md:m-0 md:pt-0">
          <div className="">
            <div className="mt-[10px] flex justify-center md:hidden">
              <Hero
                className="relative h-[200px] w-screen"
                style={{
                  backgroundImage:
                    'url(https://cdn.dribbble.com/userupload/7143226/file/original-0925d800240f43680473c0753133bf0c.png?resize=752x)'
                }}
              >
                <Hero.Overlay />
                <Hero.Content className="">
                  <div className="absolute bottom-[-30px] text-center">
                    <Avatar
                      size={78}
                      // name={auth.fullname}
                      variant="beam"
                      colors={['#FF4757', '#9980FA', '#00E26B', '#0a0310']}
                    />
                  </div>
                  <div className="absolute left-2 top-2">
                    <div className="flex items-center justify-between">
                      <div className="">
                        <Link to="/admin/employees">
                          <Button color="primary" className="text-white">
                            <GrPrevious />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-2 top-2">
                    <Link to={`/admin/update-employee/${selectedEmployee._id}`}>
                      <Button color="secondary" className="text-white">
                        <FiEdit3 />
                        {t(
                          'adminPage.employeesManagerment.employeeDetails.update'
                        )}
                      </Button>
                    </Link>
                  </div>
                </Hero.Content>
              </Hero>
            </div>
            <div className="mt-[10px] hidden p-2 md:block">
              <div className="relative">
                <img
                  className="h-[200px] w-screen object-cover"
                  src="https://cdn.dribbble.com/userupload/7143226/file/original-0925d800240f43680473c0753133bf0c.png?resize=752x"
                />
                <div className="absolute right-2 top-2">
                  <Link to={`/admin/update-employee/${selectedEmployee._id}`}>
                    <Button color="secondary" className="text-white">
                      <FiEdit3 />
                      {t(
                        'adminPage.employeesManagerment.employeeDetails.update'
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className=" justify-center  md:flex">
              <div className="m-10 hidden pr-10 md:block">
                <Avatar
                  size={78}
                  // name={auth.fullname}
                  variant="beam"
                  colors={['#FF4757', '#9980FA', '#00E26B', '#0a0310']}
                />
                <h2 className="text-center">{selectedEmployee.username}</h2>
              </div>
              <div className="mt-[40px] md:border-l-[.5px] md:border-gray-200 md:pl-10">
                <div className="my-2 flex items-center justify-center gap-[7px] md:hidden">
                  <h2>
                    {t(
                      'adminPage.employeesManagerment.employeeDetails.username'
                    )}
                    : {selectedEmployee.username}
                  </h2>
                </div>
                <div className="my-2 flex items-center justify-center gap-[7px]   md:justify-start">
                  <h2>
                    {t(
                      'adminPage.employeesManagerment.employeeDetails.fullname'
                    )}
                    : {selectedEmployee.fullname}
                  </h2>
                </div>
                <div className="my-2 flex items-center justify-center gap-[7px]  md:justify-start">
                  <p>
                    {t('adminPage.employeesManagerment.employeeDetails.email')}:{' '}
                    {selectedEmployee.email}
                  </p>
                </div>
                <div className="my-2 flex items-center justify-center gap-[7px]  md:justify-start">
                  <p>
                    {t('adminPage.employeesManagerment.employeeDetails.phone')}:{' '}
                    {selectedEmployee.phone}
                  </p>
                </div>

                <div className="my-2 flex items-center justify-center  gap-[7px] md:justify-start">
                  <p className="flex items-center gap-[5px]">
                    {t('adminPage.employeesManagerment.employeeDetails.status')}
                    :{' '}
                    {selectedEmployee.status === 0 ? (
                      <p className="text-secondary">
                        {t(
                          'adminPage.employeesManagerment.employeeDetails.inactiveAccount'
                        )}
                      </p>
                    ) : (
                      <p className="text-primary">
                        {t(
                          'adminPage.employeesManagerment.employeeDetails.activeAccount'
                        )}
                      </p>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 items-center justify-center  gap-[15px]  md:flex md:justify-start">
                  <div className="btn my-2 flex items-center justify-center gap-[7px]">
                    <p>
                      {t('adminPage.employeesManagerment.employeeDetails.role')}
                      : {selectedEmployee.role}
                    </p>
                  </div>
                  <div className="btn my-2 flex items-center justify-center gap-[7px]  md:justify-start">
                    <p>
                      {t(
                        'adminPage.employeesManagerment.employeeDetails.branch'
                      )}
                      :{' '}
                      {isLoading
                        ? t(
                            'adminPage.employeesManagerment.employeeDetails.loading'
                          )
                        : branchData && branchData.data
                          ? branchData.data.name
                          : t(
                              'adminPage.employeesManagerment.employeeDetails.noData'
                            )}
                    </p>
                  </div>
                </div>
                <div className="my-2 flex items-center justify-center gap-[7px]  md:justify-start">
                  <p>
                    {t(
                      'adminPage.employeesManagerment.employeeDetails.createdAt'
                    )}
                    : {formatDate(selectedEmployee.createdAt)}
                  </p>
                </div>
                <div className="my-2 flex items-center justify-center gap-[7px]  text-center md:justify-start">
                  <p>
                    {t(
                      'adminPage.employeesManagerment.employeeDetails.updatedAt'
                    )}
                    : {formatDate(selectedEmployee.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
