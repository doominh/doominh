import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Button } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { Toastify } from '~/helper/Toastify';
import { categoryMenuSchema } from '~/libs/validators';
import { useCreateCategoryMenuMutation } from '~/services/categoryMenu/categoryApi.service';
import { ICategoryMenu } from '~/types/category';
import { useTranslation } from 'react-i18next';

function ModalAddCategory({
  closeModalAddCategory,
  modalAddCategory
}: {
  closeModalAddCategory: () => void;
  modalAddCategory: React.MutableRefObject<null>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Omit<ICategoryMenu, '_id'>>({
    resolver: zodResolver(categoryMenuSchema)
  });
  const [addCategory, { isLoading }] = useCreateCategoryMenuMutation();
  const { t } = useTranslation();

  // handle submit form(add New Category)
  const onSubmit = async (data: Omit<ICategoryMenu, '_id'>) => {
    try {
      const result = await addCategory(data);
      if ('data' in result) {
        Toastify(result.data.message, result.data.statusCode);
        closeModalAddCategory();
        reset();
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  //closer modal and resetForm
  const closeModalAddCategoryEl = () => {
    const dialog = document.querySelector(
      '#dialog_modal_add_category'
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.close();
      reset();
    }
  };
  return (
    <div className="">
      {/* Put this part before </body> tag */}
      <input id="modal_add_category" type="checkbox" className="modal-toggle" />
      <dialog
        ref={modalAddCategory}
        className="modal modal-bottom  sm:modal-middle"
        role="dialog"
        id="dialog_modal_add_category"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-box relative ">
          <Button
            onClick={closeModalAddCategoryEl}
            color="primary"
            className="absolute right-2 top-1"
          >
            <AiOutlineClose className="text-white" />
          </Button>
          <div className="mb-4 flex flex-col gap-2 pt-4">
            <label className="block" htmlFor="">
              {t('modalAddMenuDetail.type')}
            </label>
            <input
              {...register('name')}
              type="text"
              className={`input input-bordered w-full max-w-full border border-solid ${errors.name && 'border-red-500'}`}
            />
          </div>
          <span className="text-red-500">{`${!errors.name?.message ? '' : errors.name?.message}`}</span>
          <div className="mt-4 flex items-center justify-center">
            <Button color="accent" disabled={isLoading} className="text-white">
              {isLoading && t('modalAddMenuDetail.adding')}
              {!isLoading && t('modalAddMenuDetail.add')}
            </Button>
          </div>
        </form>
        <label className="modal-backdrop" htmlFor="dialog_modal_add_category">
          Close
        </label>
      </dialog>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(ModalAddCategory);
