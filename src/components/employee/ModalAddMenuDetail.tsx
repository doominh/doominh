import { AiOutlineClose } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuDetail } from '~/types/menu';

import { ICategoryMenu } from '~/types/category';
import { IoAdd } from 'react-icons/io5';
import ModalAddCategory from './ModalAddCategory';

import { Fragment, useCallback, useEffect, useRef } from 'react';
import { Toastify } from '~/helper/Toastify';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { useDispatch } from 'react-redux';
import {
  useCreateMenuDetailMutation,
  useUpdateMenuDetailMutation
} from '~/services/menuDetail/menuDetailApi.service';

import { setCancelEdit } from '~/services/menuDetail/menuDetailSlice';
import { useGetAllCategoryMenuQuery } from '~/services/categoryMenu/categoryApi.service';
import { createMenuDetailSchema } from '~/libs/validators/menuDetail_validator';
import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';

export default function ModalAddMenuDetail({
  closeModalAddMenuDetail,
  modalAddMenuDetailElenment
}: {
  closeModalAddMenuDetail: () => void;
  modalAddMenuDetailElenment: React.MutableRefObject<null>;
}) {
  const currentBranch = useAppSelector(
    (state: RootState) => state.auth.currentUser.branchId
  );
  const editCurrentMenuDetail = useAppSelector(
    (state: RootState) => state.menuDetail.editMenuDetail
  );

  const statusAction: boolean = editCurrentMenuDetail.status;
  const [addMenuDetail, { isLoading }] = useCreateMenuDetailMutation();
  const [updateMenuDetail, { isLoading: isLoadingUpdate }] =
    useUpdateMenuDetailMutation();
  const { data: dataCategory, refetch: refetchCategory } =
    useGetAllCategoryMenuQuery();

  const dispatch = useDispatch();
  const modalActionMenuDetail = useRef(null);
  const modalAddCategory = useRef(null);
  const { t } = useTranslation();

  //zod validation form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<MenuDetail>({
    resolver: zodResolver(createMenuDetailSchema)
  });

  // set values form from store when status is editMenuDetail = true
  useEffect(() => {
    if (editCurrentMenuDetail.status) {
      const { category_id, name, price, description, image } =
        editCurrentMenuDetail.value;
      setValue('category_id', (category_id as ICategoryMenu)._id);
      setValue('name', name);
      setValue('price', price);
      setValue('description', description);
      setValue('image', image);
    }
  }, [setValue, editCurrentMenuDetail.status, editCurrentMenuDetail.value]);

  //handle action form (add or delete)
  const onSubmit = async (data: MenuDetail) => {
    if (currentBranch.menu_id) {
      const formData = new FormData();
      formData.append('category_id', data.category_id as string);
      formData.append('price', String(data.price));
      formData.append('description', String(data.description));
      formData.append('name', data.name);
      formData.append('menu_id', currentBranch.menu_id);
      if (statusAction) {
        if (data.image instanceof FileList) {
          formData.append('image', (data?.image as unknown as File[])?.[0]);
        }
        const _id = editCurrentMenuDetail.value._id;
        try {
          const result = await updateMenuDetail({
            _id: _id as string,
            data: formData as unknown as Omit<MenuDetail, '_id'>
          });
          if ('data' in result) {
            Toastify(result.data.message, result.data.statusCode);
            refetchCategory();
            reset();
            closeModalAddMenuDetail();
            closeMenuAddDetail();
            dispatch(setCancelEdit());
          }
        } catch (error) {
          console.error('Failed to add menu detail:', error);
        }
      } else {
        formData.append('image', (data?.image as unknown as File[])?.[0]);
        try {
          const result = await addMenuDetail(
            formData as unknown as Omit<MenuDetail, '_id'>
          );
          if ('data' in result) {
            Toastify(result.data.message, result.data.statusCode);
            refetchCategory();
            reset();
            closeMenuAddDetail();
            closeModalAddMenuDetail();
          }
        } catch (error) {
          console.error('Failed to add menu detail:', error);
        }
      }
    }
  };

  //func close modal MenuAddDetail (reset form and no get data)
  const closeMenuAddDetail = () => {
    const dialogEl =
      modalAddMenuDetailElenment.current as unknown as HTMLDialogElement;
    if (dialogEl) {
      dialogEl.close();
    }
    if (modalActionMenuDetail as unknown as HTMLInputElement) {
      (modalActionMenuDetail.current as unknown as HTMLInputElement).checked =
        false;
    }
    if (editCurrentMenuDetail.status) {
      dispatch(setCancelEdit());
    }
    reset();
  };

  //func open modal add category (only show)
  const handleOpenModalAddCategory = () => {
    const dialog = document.querySelector(
      '#dialog_modal_add_category'
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  //func close modal add category  (refetch data category)
  const closeModalAddCategory = useCallback((): void => {
    const modalAddEl = modalAddCategory.current as unknown as HTMLDialogElement;
    if (modalAddEl) {
      modalAddEl.close();
      refetchCategory();
    }
  }, [refetchCategory]);

  return (
    <>
      <input
        ref={modalActionMenuDetail}
        type="checkbox"
        id="modal_add_menu_detail"
        className="modal-toggle"
      />
      <dialog
        ref={modalAddMenuDetailElenment}
        id="dialog_modal_add_menu_detail"
        className="modal modal-bottom pt-0 sm:modal-middle"
        role="dialog"
      >
        <div className="modal-box relative w-full md:overflow-y-auto">
          <Button
            color="primary"
            onClick={closeMenuAddDetail}
            className="modal-backdrop absolute right-[5px] top-[5px] z-[1]  float-right cursor-pointer items-center justify-end"
          >
            <AiOutlineClose className="text-[1rem] text-white" />
          </Button>
          <div className="flex items-center justify-center">
            <h3 className="] mt-5 text-2xl font-bold">
              {statusAction
                ? t('modalAddMenuDetail.edit')
                : t('modalAddMenuDetail.add_menu')}
            </h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-full">
            <div className="mb-2 flex w-full flex-col gap-2">
              <label className="block font-medium" htmlFor="">
                {t('modalAddMenuDetail.type')}
              </label>
              <div className="flex items-center gap-2">
                <select
                  {...register('category_id')}
                  defaultValue={'none'}
                  className={`select select-bordered w-full max-w-full border border-solid text-base ${errors.category_id && 'border-red-500'}`}
                >
                  <option value={'none'} disabled>
                    {t('modalAddMenuDetail.type')}
                  </option>
                  {dataCategory?.data &&
                    dataCategory?.data?.map((data: ICategoryMenu) => (
                      <option
                        key={data._id}
                        className="capitalize"
                        value={data._id}
                      >
                        {data.name}
                      </option>
                    ))}
                </select>
                <Button
                  color="accent"
                  onClick={handleOpenModalAddCategory}
                  className="btn cursor-pointer items-center justify-center rounded-lg transition-all duration-100 ease-linear active:scale-110 "
                >
                  <IoAdd className="text-xl text-base-100" />
                </Button>
              </div>
            </div>
            {errors.category_id && (
              <span className="text-red-600">{`${errors.category_id.message}`}</span>
            )}

            {dataCategory?.data && dataCategory?.data?.length > 0 && (
              <Fragment>
                <div className="mb-2 mt-4 flex flex-col gap-2">
                  <label className="block font-medium" htmlFor="">
                    {/* {t('modalAddMenuDetail.food_name')} */}
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className={`input input-bordered w-full max-w-full border border-solid ${errors.name && 'border-red-500'}`}
                  />
                </div>
                <span className="text-red-500">{`${!errors.name?.message ? '' : errors.name?.message}`}</span>

                <div className="mb-2 mt-4 flex flex-col gap-2">
                  <label className="block font-medium" htmlFor="">
                    {t('modalAddMenuDetail.price')}
                  </label>
                  <input
                    type="number"
                    {...register('price', {
                      valueAsNumber: true
                    })}
                    className={`input input-bordered w-full max-w-full border border-solid ${errors.price && 'border-red-500'}`}
                  />
                </div>
                <span className="text-red-500">{`${!errors.price?.message ? '' : errors.price?.message}`}</span>

                <div className="mb-2 mt-4 flex flex-col gap-2">
                  <label className="block font-medium" htmlFor="">
                    {t('modalAddMenuDetail.description')}
                  </label>
                  <textarea
                    {...register('description')}
                    className={`textarea textarea-bordered textarea-lg w-full max-w-full text-[1rem] ${errors.description && 'border-red-500'}`}
                  ></textarea>
                </div>
                <span className="text-red-500">{`${!errors.description?.message ? '' : errors.description?.message}`}</span>

                <div className="mb-2 mt-4 flex flex-col gap-2">
                  <label className="block font-medium" htmlFor="">
                    {t('modalAddMenuDetail.image')}
                  </label>

                  <input
                    {...register('image')}
                    className={`block h-12 w-full cursor-pointer rounded-lg border px-2 text-sm leading-10 text-gray-900 focus:outline-none ${errors.image && 'border-red-500'}`}
                    id="file_input"
                    type="file"
                  ></input>
                  <span className="text-red-500">{`${!errors.image?.message ? '' : errors.image?.message}`}</span>
                </div>

                <div className="mt-12 flex items-center justify-center">
                  <Button
                    color="accent"
                    disabled={isLoading}
                    className="btn w-full rounded-lg text-sm font-bold text-[#ffff] transition-all duration-75 hover:opacity-80 md:text-base"
                  >
                    {statusAction
                      ? isLoadingUpdate && t('modalAddMenuDetail.editing')
                      : isLoading && t('modalAddMenuDetail.adding')}

                    {statusAction
                      ? !isLoadingUpdate && t('modalAddMenuDetail.edit')
                      : !isLoading && t('modalAddMenuDetail.add_menu')}
                  </Button>
                </div>
              </Fragment>
            )}
          </form>
        </div>
      </dialog>
      <ModalAddCategory
        modalAddCategory={modalAddCategory}
        closeModalAddCategory={closeModalAddCategory}
      />
    </>
  );
}
