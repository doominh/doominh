import React, { FormEvent, useRef, useState } from 'react';
import { Button } from 'react-daisyui';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Toastify } from '~/helper/Toastify';
import { RootState } from '~/redux/store';
import { setBrandCurrentUser } from '~/services/auth/authSlice';
import { useCreateMenuMutation } from '~/services/menu/menu.service';

import { useUpdateBranchMutation } from '~/services/branch/branchApi.service';
import LoadingLocal from '../Loading/LoadingLocal';
import { setBranch } from '~/services/branch/branchSlice';
import { IMenu } from '~/types/menu';
import { IBranch } from '~/types/branch';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react-refresh/only-export-components
function ModalAddMenu({
  closeModalAddMenu,
  modalAddMenuElenment
}: {
  closeModalAddMenu: () => void;
  modalAddMenuElenment: React.MutableRefObject<null>;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const store = useSelector((state: RootState) => state);
  const { t } = useTranslation();

  const [createMenus, { isLoading }] = useCreateMenuMutation();
  const [updateBranches, { isLoading: isLoadingBr }] =
    useUpdateBranchMutation();

  // handle submit form(add New Menu)
  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image_cover', selectedFile);
      formData.append('user_id', store.auth.currentUser.userId);
      try {
        const result = await createMenus(formData as unknown as IMenu);
        if ('data' in result) {
          const menu_id = result.data.data._id;
          const message = result.data.message;
          const statusCode = result.data.statusCode;
          const { _id, ...data } = store.auth.currentUser.branchId as IBranch;
          const dataUpdate = {
            ...data,
            menu_id
          };
          if (_id) {
            const resultUpdate = await updateBranches({
              id: String(_id),
              data: dataUpdate
            });
            if ('data' in resultUpdate) {
              const brancheUpdate = resultUpdate.data;
              dispatch(setBrandCurrentUser(brancheUpdate));
              dispatch(setBranch(brancheUpdate));
              Toastify(message, statusCode);
              closeModalAddMenu();
            }
          }
        }
      } catch (error) {
        console.error('Failed to create menu:', error);
      }
    }
  };

  // set value when input chane
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  // close modal add menu
  const closeModalMenuEl = () => {
    const dialog = document.querySelector(
      '#dialog_modal_add_menu'
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.close();
      setSelectedFile(null);
      if (inputRef.current) {
        (inputRef.current as HTMLInputElement).value = '';
      }
    }
  };

  return (
    <dialog
      ref={modalAddMenuElenment}
      className="modal modal-bottom sm:modal-middle"
      role="dialog"
      id="dialog_modal_add_menu"
    >
      <form
        onSubmit={handleSubmitForm}
        className="modal-box relative flex flex-col items-center justify-center md:min-h-[200px] md:w-[670px] md:pt-16"
      >
        <Button
          onClick={closeModalMenuEl}
          size="sm"
          color="ghost"
          shape="circle"
          className="absolute right-2 top-2"
        >
          <AiOutlineClose className="h-1/2 w-1/2 text-[#333333]" />
        </Button>
        <input
          className={`dark:placeholder-gray-40 block h-12 w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm leading-10 text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400`}
          id="file_input"
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
        ></input>
        {selectedFile && (
          <div className="mt-11 flex items-center justify-center">
            <div className="max-h-[200px] max-w-[200px] overflow-hidden rounded-lg">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Image"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>
        )}
        <div className="mt-12 flex items-center justify-center">
          <button
            disabled={isLoading}
            className="min-h-[54px] min-w-[174px] rounded-lg bg-accent text-xl font-bold text-[#ffff] transition-all duration-75 hover:opacity-80"
          >
            {isLoading || isLoadingBr ? (
              <LoadingLocal />
            ) : (
              t('modalAddMenuDetail.add')
            )}
          </button>
        </div>
      </form>
    </dialog>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(ModalAddMenu);
