import { useDispatch } from 'react-redux';
import { Toastify } from '~/helper/Toastify';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { useDeleteMenuDetailMutation } from '~/services/menuDetail/menuDetailApi.service';
import { setCancelDelete } from '~/services/menuDetail/menuDetailSlice';
import { useTranslation } from 'react-i18next';

export default function ModalDelete({
  closeModalDelete,
  modalDeleteMenuDetailEl
}: {
  closeModalDelete: () => void;
  modalDeleteMenuDetailEl: React.MutableRefObject<null>;
}) {
  const dispatch = useDispatch();
  const [deleteMenuDetail, { isLoading }] = useDeleteMenuDetailMutation();
  const { t } = useTranslation();

  //check status of delete menu detail from store( '' or idMenuDelete )
  const menuDeleteId = useAppSelector(
    (state: RootState) => state.menuDetail.deleteMenuDetailId
  );
  // handle delete menu detail set status edit = false
  const handleDeleteMenuDetail = async () => {
    if (menuDeleteId) {
      try {
        const result = await deleteMenuDetail(menuDeleteId);
        if ('data' in result) {
          Toastify(result.data.message, result.data.statusCode);
          closeModalDelete();
          dispatch(setCancelDelete());
        }
      } catch (error) {
        console.error('Failed to add menu detail:', error);
      }
    }
  };

  // close modal menu detail and setCancelDelete in store
  const closeModalDeleteEle = () => {
    const dialog = document.querySelector(
      '#dialog_modal_delete'
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
    dispatch(setCancelDelete());
  };

  return (
    <dialog
      ref={modalDeleteMenuDetailEl}
      id="dialog_modal_delete"
      className="modal"
      role="dialog"
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold text-primary">
          {t('modalDelete.delete_product')}
        </h3>
        <p className="py-4"> {t('modalDelete.confirm_delete_message')}</p>
        <div className="modal-action flex items-center gap-3">
          <button
            onClick={handleDeleteMenuDetail}
            className="rounded-lg bg-primary px-5 py-3 text-base-100 transition-all duration-75 hover:opacity-80"
          >
            {!isLoading
              ? t('modalDelete.confirm_delete')
              : t('modalDelete.deleting_product')}
          </button>
          <span
            onClick={closeModalDeleteEle}
            className="btn border border-[#3333] text-[#333]"
          >
            {t('modalDelete.cancel')}
          </span>
        </div>
      </div>
    </dialog>
  );
}
