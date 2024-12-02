import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation
} from '~/services/employee/employeeApi.service';
import { useGetBranchesQuery } from '~/services/BaseApi.service';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Employee } from '~/types/employee';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import { FiEdit3 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { IBranch } from '~/types/branch';
import { Button } from 'react-daisyui';

const UpdateEmployees: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading: isEmployeeLoading } = useGetUserByIdQuery(
    id || ''
  );
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const branchesQuery = useGetBranchesQuery();
  const { data: branchesData } = branchesQuery;

  useEffect(() => {
    if (employee && employee.data) {
      setEmployeeData(employee.data);
    }
  }, [employee]);

  const {
    register,
    handleSubmit
    // formState: { errors }
  } = useForm<Employee>();

  const [patchEmployee, { isLoading: isPatchLoading }] =
    useUpdateUserMutation();

  const onSubmit = async (data: Employee) => {
    try {
      if (id) {
        const newData: Partial<Employee> = { ...data };
        if (employeeData) {
          for (const key in newData) {
            if (newData[key as keyof Employee] === '') {
              newData[key as keyof Employee] =
                employeeData[key as keyof Employee];
            }
          }
        }

        const selectedBranch = branchesData?.data.find(
          (branch: IBranch) => branch.name === newData.branchId
        );
        if (selectedBranch) {
          newData.branchId = selectedBranch._id as string;
        }

        const result = await patchEmployee({ id, data: newData });

        if ('error' in result) {
          if (result.error) {
            toast.error(
              t('adminPage.employeesManagerment.updateEmployee.updateError')
            );
          }
        } else {
          toast.success(
            t('adminPage.employeesManagerment.updateEmployee.updateSuccess')
          );
          setTimeout(() => {
            navigate(`/admin/employees/${employeeData?._id}`);
          }, 2000);
        }
      } else {
        toast.error(
          t('adminPage.employeesManagerment.updateEmployee.idNotExist')
        );
      }
    } catch (error) {
      toast.error(
        t('adminPage.employeesManagerment.updateEmployee.updateError')
      );
    }
  };

  return (
    <div>
      <HeaderDashboard />
      <div className="m-[10px] pt-[30px] md:m-[20px] xl:mx-0 xl:p-0">
        <ToastContainer />
        <div className="mt-[10px] flex items-center gap-[8px]">
          <FiEdit3 className="text-[1.2rem] text-primary " />
          <h1 className="text-[1.2rem] font-medium text-primary">
            {t('adminPage.employeesManagerment.updateEmployee.updateAccount')}
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[10px] md:max-w-xl">
            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-1">
              <div className="mt-[20px]">
                <p>
                  {t('adminPage.employeesManagerment.updateEmployee.username')}:
                </p>
                <input
                  type="text"
                  {...register('username')}
                  className="input input-bordered w-full"
                  defaultValue={employeeData?.username || ''}
                />
              </div>
              <div className="mt-[20px] ">
                <p>
                  {t('adminPage.employeesManagerment.updateEmployee.fullname')}:
                </p>
                <input
                  type="text"
                  {...register('fullname')}
                  className="input input-bordered w-full"
                  defaultValue={employeeData?.fullname || ''}
                />
              </div>
            </div>
            <div className="mt-[20px] ">
              <p>{t('adminPage.employeesManagerment.updateEmployee.email')}:</p>
              <input
                type="text"
                {...register('email')}
                className="input input-bordered w-full"
                defaultValue={employeeData?.email || ''}
              />
            </div>
            <div className="mt-[20px] ">
              <p>{t('adminPage.employeesManagerment.updateEmployee.phone')}:</p>
              <input
                type="text"
                {...register('phone')}
                className="input input-bordered w-full"
                defaultValue={employeeData?.phone || ''}
              />
            </div>
            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-1">
              <div className="mt-[20px] ">
                <p>
                  {t('adminPage.employeesManagerment.updateEmployee.role')}:
                </p>
                <select
                  {...register('role')}
                  className="input input-bordered w-full"
                  defaultValue={employeeData?.role || ''}
                >
                  <option value="employee">
                    {t(
                      'adminPage.employeesManagerment.updateEmployee.employee'
                    )}
                  </option>
                  <option value="chef">
                    {t('adminPage.employeesManagerment.updateEmployee.chef')}
                  </option>
                </select>
              </div>
              <div className="mt-[20px] ">
                <p>
                  {t('adminPage.employeesManagerment.updateEmployee.branch')}:
                </p>
                <select
                  {...register('branchId')}
                  className="input input-bordered w-full"
                  defaultValue={employeeData?.branchId || ''}
                >
                  {branchesData &&
                    branchesData.data.map((branch: IBranch) => (
                      <option key={branch._id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <Button
              color="primary"
              type="submit"
              className="btn mt-[20px] w-full border-none bg-primary text-white outline-none md:max-w-xl"
              disabled={isPatchLoading || isEmployeeLoading}
            >
              {isPatchLoading
                ? t('adminPage.employeesManagerment.updateEmployee.updating')
                : t(
                    'adminPage.employeesManagerment.updateEmployee.updateEmployee'
                  )}
            </Button>
            {/* {errors && (
              <div>
                {Object.values(errors).map((error, index) => (
                  <div key={index}>{error.message}</div>
                ))}
              </div>
            )} */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployees;
