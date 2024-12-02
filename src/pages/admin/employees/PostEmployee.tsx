import React, { useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { usePostUserMutation } from '~/services/employee/employeeApi.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TbMoodEdit } from 'react-icons/tb';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import { useGetBranchesQuery } from '~/services/BaseApi.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-daisyui';

const PostEmployee: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const employeeSchema = z.object({
    username: z
      .string()
      .min(6, t('adminPage.employeesManagerment.postEmployee.minUsername'))
      .max(100, t('adminPage.employeesManagerment.postEmployee.maxUsername'))
      .optional(),
    fullname: z
      .string()
      .min(6, t('adminPage.employeesManagerment.postEmployee.minFullname'))
      .max(100, t('adminPage.employeesManagerment.postEmployee.maxFullname'))
      .optional(),
    email: z
      .string()
      .email(t('adminPage.employeesManagerment.postEmployee.invalidEmail'))
      .optional(),
    password: z
      .string()
      .min(6, t('adminPage.employeesManagerment.postEmployee.minPassword'))
      .max(100, t('adminPage.employeesManagerment.postEmployee.maxPassword'))
      .optional(),
    phone: z
      .string()
      .min(10, t('adminPage.employeesManagerment.postEmployee.minPhone'))
      .max(15, t('adminPage.employeesManagerment.postEmployee.maxPhone'))
      .optional(),
    role: z
      .string()
      .min(1, t('adminPage.employeesManagerment.postEmployee.requiredRole'))
      .optional(),
    branchId: z
      .string()
      .min(1, t('adminPage.employeesManagerment.postEmployee.requiredBranch'))
      .optional()
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(employeeSchema)
  });

  const [postEmployee] = usePostUserMutation();
  const { data: branchesData, refetch: refetchBranches } =
    useGetBranchesQuery();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: any) => {
    try {
      await postEmployee(formData).unwrap();
      toast.success(
        t('adminPage.employeesManagerment.postEmployee.employeeCreated')
      );
      reset();
      setTimeout(() => {
        navigate('/admin/employees');
      }, 2000);
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      const errorMessage =
        (error as Error).message ||
        t('adminPage.employeesManagerment.postEmployee.unknownError');
      toast.error(
        `${t('adminPage.employeesManagerment.postEmployee.error')}: ${errorMessage}`
      );
    } else {
      toast.error(
        t('adminPage.employeesManagerment.postEmployee.genericError')
      );
    }
  };

  React.useEffect(() => {
    refetchBranches();
  }, [refetchBranches]);

  return (
    <div>
      <HeaderDashboard />
      <div className="m-[10px] pt-[30px] md:m-[20px] xl:mx-0 xl:p-0">
        <div className="mt-[10px] flex items-center gap-[7px]">
          <TbMoodEdit className="text-[1.2rem] text-primary " />
          <h1 className="text-[1.1rem] font-medium text-primary">
            {t('adminPage.employeesManagerment.postEmployee.createEmployee')}
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-[10px] md:grid-cols-1">
            <div className="mt-[20px]">
              <p>
                {t('adminPage.employeesManagerment.postEmployee.username')}:
              </p>
              <input
                type="text"
                {...register('username')}
                className={`input input-bordered w-full md:max-w-xl ${errors.username ? 'border-red-500' : ''}`}
                placeholder={t(
                  'adminPage.employeesManagerment.postEmployee.placeholder.usernamePlaceholder'
                )}
              />
              {errors.username && (
                <p className="text-red-500">
                  {(errors.username as FieldError)?.message}
                </p>
              )}
            </div>
            <div className="mt-[20px]">
              <p>
                {t('adminPage.employeesManagerment.postEmployee.fullname')}:
              </p>
              <input
                type="text"
                {...register('fullname')}
                className={`input input-bordered w-full md:max-w-xl ${errors.fullname ? 'border-red-500' : ''}`}
                placeholder={t(
                  'adminPage.employeesManagerment.postEmployee.placeholder.fullnamePlaceholder'
                )}
              />
              {errors.fullname && (
                <p className="text-red-500">
                  {(errors.fullname as FieldError)?.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-[20px]">
            <p>{t('adminPage.employeesManagerment.postEmployee.email')}:</p>
            <input
              type="text"
              {...register('email')}
              className={`input input-bordered w-full md:max-w-xl ${errors.email ? 'border-red-500' : ''}`}
              placeholder={t(
                'adminPage.employeesManagerment.postEmployee.placeholder.emailPlaceholder'
              )}
            />
            {errors.email && (
              <p className="text-red-500">
                {(errors.email as FieldError)?.message}
              </p>
            )}
          </div>
          <div className="mt-[20px]">
            <p>{t('adminPage.employeesManagerment.postEmployee.password')}:</p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`input input-bordered w-full md:max-w-xl ${errors.password ? 'border-red-500' : ''}`}
                placeholder={t(
                  'adminPage.employeesManagerment.postEmployee.placeholder.passwordPlaceholder'
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaRegEyeSlash className="1.2rem md:hidden" />
                ) : (
                  <FaRegEye className="md:hidden" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500">
                {(errors.password as FieldError)?.message}
              </p>
            )}
          </div>
          <div className="mt-[20px]">
            <p>{t('adminPage.employeesManagerment.postEmployee.phone')}:</p>
            <input
              type="text"
              {...register('phone')}
              className={`input input-bordered w-full md:max-w-xl ${errors.phone ? 'border-red-500' : ''}`}
              placeholder={t(
                'adminPage.employeesManagerment.postEmployee.placeholder.phonePlaceholder'
              )}
            />
            {errors.phone && (
              <p className="text-red-500">
                {(errors.phone as FieldError)?.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-[10px] md:grid-cols-1">
            <div className="mt-[20px]">
              <p>{t('adminPage.employeesManagerment.postEmployee.role')}:</p>
              <select
                {...register('role')}
                className={`input input-bordered w-full md:max-w-xl ${errors.role ? 'border-red-500' : ''}`}
                defaultValue=""
              >
                <option value="" disabled hidden>
                  {t('adminPage.employeesManagerment.postEmployee.selectRole')}
                </option>
                <option value="chef">
                  {t('adminPage.employeesManagerment.postEmployee.chef')}
                </option>
                <option value="employee">
                  {t('adminPage.employeesManagerment.postEmployee.employee')}
                </option>
              </select>
              {errors.role && (
                <p className="text-red-500">
                  {(errors.role as FieldError)?.message}
                </p>
              )}
            </div>
            <div className="mt-[20px]">
              <p>{t('adminPage.employeesManagerment.postEmployee.branch')}:</p>
              <select
                {...register('branchId')}
                className={`input input-bordered w-full md:max-w-xl ${errors.branchId ? 'border-red-500' : ''}`}
                defaultValue=""
              >
                <option value="" disabled hidden>
                  {t(
                    'adminPage.employeesManagerment.postEmployee.selectBranch'
                  )}
                </option>
                {branchesData &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  branchesData.data.map((branch: any) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
              </select>
              {errors.branchId && (
                <p className="text-red-500">
                  {(errors.branchId as FieldError)?.message}
                </p>
              )}
            </div>
          </div>
          <Button
            color="primary"
            type="submit"
            className="btn mt-[20px] w-full border-none bg-primary text-white outline-none md:max-w-xl"
          >
            {t('adminPage.employeesManagerment.postEmployee.addEmployee')}
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PostEmployee;
