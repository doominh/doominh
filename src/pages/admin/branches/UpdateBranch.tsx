import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateBranchMutation } from '~/services/branch/branchApi.service';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import { IBranch } from '~/types/branch';
import { useGetBranchByIdQuery } from '~/services/BaseApi.service';
import { FiEdit3 } from 'react-icons/fi';
import { useGetMenusQuery } from '~/services/menu/menu.service';
import { useTranslation } from 'react-i18next';
import { IMenu } from '~/types/menu';

const UpdateBranch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: branch,
    isLoading: isBranchLoading,
    refetch
  } = useGetBranchByIdQuery(id || '');
  const [formData, setFormData] = useState<Partial<IBranch> | null>(null);

  useEffect(() => {
    if (branch) {
      setFormData(branch.data);
    }
  }, [branch]);

  const { register, handleSubmit } = useForm<IBranch>();
  const [patchBranch, { isLoading: isPatchLoading }] =
    useUpdateBranchMutation();

  const { data: menuData } = useGetMenusQuery();
  const onSubmit = async (data: Partial<IBranch> & { menu_id: string }) => {
    try {
      if (id) {
        const newData: Partial<IBranch> = { ...data };

        if (branch) {
          for (const key in newData) {
            if (newData[key as keyof IBranch] === '') {
              newData[key as keyof IBranch] = branch.data[
                key as keyof IBranch
              ] as (string & string[]) | undefined;
            }
          }
        }

        const result = await patchBranch({ id, data: newData });
        console.log(result);

        if ('error' in result) {
          if (result.error) {
            toast.error(t('adminPage.branchesManagerment.updateBranch.error'));
          }
        } else {
          toast.success(
            t('adminPage.branchesManagerment.updateBranch.success')
          );
          setTimeout(() => {
            navigate('/admin/branch');
          }, 1000);
          refetch();
        }
      } else {
        toast.error(t('adminPage.branchesManagerment.updateBranch.notFound'));
      }
    } catch (error) {
      toast.error(t('adminPage.branchesManagerment.updateBranch.error'));
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
            {t('adminPage.branchesManagerment.updateBranch.title')}
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-[10px] md:max-w-xl md:flex-col">
            <div className="mt-[20px]">
              <p>
                {' '}
                {t('adminPage.branchesManagerment.postBranch.common.name')}:
              </p>
              <input
                type="text"
                {...register('name')}
                className="input input-bordered w-full md:max-w-xl"
                defaultValue={formData?.name}
              />
            </div>
            <div className="mt-[20px]">
              <p>
                {t('adminPage.branchesManagerment.postBranch.common.address')}:
              </p>
              <input
                type="text"
                {...register('address')}
                className="input input-bordered w-full md:max-w-xl"
                defaultValue={formData?.address}
              />
            </div>
          </div>
          <div className="mt-[20px]">
            <p>
              {' '}
              {t('adminPage.branchesManagerment.postBranch.common.email')}:
            </p>
            <input
              type="text"
              {...register('email')}
              className="input input-bordered w-full md:max-w-xl"
              defaultValue={formData?.email}
            />
          </div>
          <div className="mt-[20px]">
            <p>
              {' '}
              {t(
                'adminPage.branchesManagerment.postBranch.common.phone_number'
              )}
              :
            </p>
            <input
              type="text"
              {...register('phone_number')}
              className="input input-bordered w-full md:max-w-xl"
              defaultValue={formData?.phone_number}
            />
          </div>
          <div className="mt-[20px] flex gap-[10px]">
            <div className="">
              <p>
                {t('adminPage.branchesManagerment.postBranch.common.open')}:
              </p>
              <input
                type="text"
                {...register('open')}
                defaultValue={formData?.open}
                className="file-input file-input-bordered w-full p-2 md:max-w-xs"
              />
            </div>
            <div className="">
              <p>
                {' '}
                {t('adminPage.branchesManagerment.postBranch.common.close')}:
              </p>
              <input
                type="text"
                {...register('close')}
                defaultValue={formData?.close}
                className="file-input file-input-bordered w-full p-2 md:max-w-xs"
              />
            </div>
          </div>
          <div className="mt-[20px]">
            <p> {t('adminPage.branchesManagerment.postBranch.common.menu')}:</p>
            <select
              {...register('menu_id')}
              className="input input-bordered w-full md:max-w-xl"
              defaultValue={formData?.menu_id}
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
          </div>
          <button
            type="submit"
            className="btn mt-[20px] w-full border-none bg-primary text-white outline-none hover:bg-primary hover:opacity-[0.6] md:max-w-xl"
            disabled={isPatchLoading || isBranchLoading}
          >
            {isPatchLoading
              ? t('adminPage.branchesManagerment.updateBranch.saving')
              : t('adminPage.branchesManagerment.updateBranch.save')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBranch;
