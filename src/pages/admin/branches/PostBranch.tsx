import React from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { useCreateBranchMutation } from '~/services/branch/branchApi.service';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import { LuGitBranchPlus } from 'react-icons/lu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '~/redux/store';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useGetMenusQuery } from '~/services/menu/menu.service';
import { useTranslation } from 'react-i18next';
import { IMenu } from '~/types/menu';

const PostBranch: React.FC<object> = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const userId = authState.currentUser.userId;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const branchSchema = z.object({
    name: z
      .string()
      .min(6, t('adminPage.branchesManagerment.postBranch.errorMessage.name'))
      .max(
        100,
        t('adminPage.branchesManagerment.postBranch.errorMessage.maxName')
      )
      .optional(),
    address: z
      .string()
      .min(
        6,
        t('adminPage.branchesManagerment.postBranch.errorMessage.address')
      )
      .optional(),
    email: z
      .string()
      .email(t('adminPage.branchesManagerment.postBranch.errorMessage.email'))
      .optional(),
    phone_number: z
      .string()
      .min(
        10,
        t('adminPage.branchesManagerment.postBranch.errorMessage.phone_number')
      )
      .optional(),
    open: z
      .string()
      .min(1, t('adminPage.branchesManagerment.postBranch.errorMessage.open'))
      // .regex(/^\d+$/, 'Thời gian mở cửa phải là số')
      .optional(),
    close: z
      .string()
      .min(1, t('adminPage.branchesManagerment.postBranch.errorMessage.close'))
      // .regex(/^\d+$/, 'Thời gian đóng cửa phải là số')
      .optional(),
    menu_id: z
      .string()
      .min(
        1,
        t('adminPage.branchesManagerment.postBranch.errorMessage.menu_id')
      )
      .optional()
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(branchSchema)
  });

  const [createBranch] = useCreateBranchMutation();
  const { data: menuData } = useGetMenusQuery();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const menuId = data.menu_id;
      const requestData = { ...data, user_id: userId, menu_id: menuId };
      await sendRequest(requestData);

      toast.success(
        t('adminPage.branchesManagerment.postBranch.common.success')
      );
      reset();
      setTimeout(() => {
        navigate('/admin/branch');
      }, 2000);
    } catch (error: unknown) {
      handleError(error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendRequest = async (requestData: any) => {
    try {
      const response = await createBranch({
        data: requestData
      }).unwrap();
      console.log(response);
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    console.log(error);
    if (error instanceof Error) {
      const errorMessage = (error as Error).message || 'Lỗi không xác định';
      toast.error(`Lỗi: ${errorMessage}`);
    } else {
      toast.error(t('adminPage.branchesManagerment.postBranch.common.error'));
    }
  };

  return (
    <div>
      <HeaderDashboard />
      <div className="m-[10px] pt-[30px] md:m-[20px] xl:mx-0 xl:p-0">
        <div className="">
          <div className="mt-[10px] flex items-center gap-[8px]">
            <LuGitBranchPlus className="text-[1.2rem] text-primary " />
            <h1 className="text-[1.2rem] font-medium text-primary">
              {t('adminPage.branchesManagerment.postBranch.title')}
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <div className="flex flex-row gap-[10px] md:max-w-xl md:flex-col">
                <div className="mt-[20px] w-full">
                  <p>
                    {' '}
                    {t('adminPage.branchesManagerment.postBranch.common.name')}:
                  </p>
                  <input
                    type="text"
                    {...register('name')}
                    className={`input input-bordered w-full md:max-w-xl ${errors.name ? 'border-red-500' : ''}`}
                    placeholder={t(
                      'adminPage.branchesManagerment.postBranch.placeholderName'
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500">
                      {(errors.name as FieldError)?.message}
                    </p>
                  )}
                </div>
                <div className="mt-[20px] w-full">
                  <p>
                    {t(
                      'adminPage.branchesManagerment.postBranch.common.address'
                    )}
                    :
                  </p>
                  <input
                    type="text"
                    {...register('address')}
                    className={`input input-bordered w-full md:max-w-xl ${errors.address ? 'border-red-500' : ''}`}
                    placeholder={t(
                      'adminPage.branchesManagerment.postBranch.placeholderAddress'
                    )}
                  />
                  {errors.address && (
                    <p className="text-red-500">
                      {(errors.address as FieldError)?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-[20px]">
                <p>
                  {t('adminPage.branchesManagerment.postBranch.common.email')}:
                </p>
                <input
                  type="text"
                  {...register('email')}
                  className={`input input-bordered w-full md:max-w-xl ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={t(
                    'adminPage.branchesManagerment.postBranch.placeholderEmail'
                  )}
                />
                {errors.email && (
                  <p className="text-red-500">
                    {(errors.email as FieldError)?.message}
                  </p>
                )}
              </div>
              <div className="mt-[20px]">
                <p>
                  {t(
                    'adminPage.branchesManagerment.postBranch.common.phone_number'
                  )}
                  :
                </p>
                <input
                  type="number"
                  {...register('phone_number')}
                  className={`input input-bordered w-full md:max-w-xl ${errors.phone_number ? 'border-red-500' : ''}`}
                  placeholder={t(
                    'adminPage.branchesManagerment.postBranch.placeholderPhoneNumber'
                  )}
                />
                {errors.phone_number && (
                  <p className="text-red-500">
                    {(errors.phone_number as FieldError)?.message}
                  </p>
                )}
              </div>
              <div className="mt-[20px] flex gap-[10px] md:max-w-xl">
                <div className="w-full">
                  <p>
                    {t('adminPage.branchesManagerment.postBranch.common.open')}:
                  </p>
                  <input
                    type="number"
                    {...register('open')}
                    className={`file-input file-input-bordered w-full p-2 ${errors.open ? 'border-red-500' : ''}`}
                    placeholder={t(
                      'adminPage.branchesManagerment.postBranch.placeholderOpen'
                    )}
                  />
                  {errors.open && (
                    <p className="text-red-500">
                      {(errors.open as FieldError)?.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <p>
                    {t('adminPage.branchesManagerment.postBranch.common.close')}
                    :
                  </p>
                  <input
                    type="number"
                    {...register('close')}
                    className={`file-input file-input-bordered w-full p-2 ${errors.close ? 'border-red-500' : ''}`}
                    placeholder={t(
                      'adminPage.branchesManagerment.postBranch.placeholderClose'
                    )}
                  />
                  {errors.close && (
                    <p className="text-red-500">
                      {(errors.close as FieldError)?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-[20px]">
                <p>
                  {t('adminPage.branchesManagerment.postBranch.common.menu')}:
                </p>
                <select
                  {...register('menu_id')}
                  className={`input input-bordered w-full md:max-w-xl ${errors.menu_id ? 'border-red-500' : ''}`}
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    {t('adminPage.branchesManagerment.postBranch.common.menu')}
                  </option>
                  {menuData &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.isArray(menuData?.data) &&
                    menuData?.data?.map((menu: IMenu) => (
                      <option key={menu._id} value={menu._id}>
                        {menu.name}
                      </option>
                    ))}
                </select>

                {errors.menu_id && (
                  <p className="text-red-500">
                    {(errors.menu_id as FieldError)?.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="btn mt-[20px] w-full border-none bg-primary text-white outline-none hover:bg-primary hover:opacity-[0.6] md:max-w-xl"
            >
              {t('adminPage.branchesManagerment.postBranch.common.save')}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PostBranch;
