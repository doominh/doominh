import React, { useEffect, useRef, useState } from 'react';
import { useUpdateMenuMutation } from '~/services/menu/menu.service';
import { useTranslation } from 'react-i18next';
import { IMenu } from '~/types/menu';
import { Button } from 'react-daisyui';

const initialState: Omit<IMenu, '_id' | 'createdAt' | 'updatedAt' | 'user_id'> =
  {
    image_cover: null,
    name: ''
  };

interface Props {
  refetchMenus: Function;
  item: IMenu;
}

const ModalUpdateMenu: React.FC<Props> = ({ item, refetchMenus }) => {
  const [formData, setFormData] =
    useState<Omit<IMenu, '_id' | 'createdAt' | 'updatedAt' | 'user_id'>>(
      initialState
    );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateMenu] = useUpdateMenuMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: item.name || '',
      image_cover: null
    });
  }, [item]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = t(
        'adminPage.menuManagement.mainMenu.modal.error.valid_menuName'
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle reset form
  const handleModalClose = () => {
    setFormData(initialState);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const formDataSend = new FormData();
    formDataSend.append('name', formData.name);
    if (formData.image_cover) {
      formDataSend.append('image_cover', formData.image_cover);
    }
    await updateMenu({
      _id: item._id as string,
      data: formDataSend as unknown as Omit<
        IMenu,
        '_id' | 'createdAt' | 'updatedAt' | 'user_id'
      >
    }).unwrap();
    handleModalClose();
    (
      document.getElementById('modal_update_menu') as HTMLDialogElement
    )?.close();
    refetchMenus();
  };

  return (
    <>
      <dialog id="modal_update_menu" className="modal">
        <div className="modal-box rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-center text-2xl font-bold">
            {t('adminPage.menuManagement.mainMenu.modal.updateMenu')}
          </h3>
          <form method="dialog">
            <Button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={handleModalClose}
            >
              ✕
            </Button>
            <div className="flex flex-col">
              <label htmlFor="food_name" className="mb-2 font-medium">
                {t('adminPage.menuManagement.mainMenu.modal.menuName')}:
              </label>
              <input
                type="text"
                id="menu_name"
                name="name"
                className={`input input-bordered w-full p-2 ${errors.name ? 'border-red-500' : ''}`}
                value={formData.name}
                onChange={event =>
                  setFormData(prev => ({
                    ...prev,
                    name: event.target.value
                  }))
                }
              />
              {errors.name && (
                <span className="text-red-500">{errors.name}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="image" className="mb-2 font-medium">
                {t('adminPage.menuManagement.mainMenu.modal.image')}:
              </label>
              <input
                type="file"
                id="image_cover"
                name="image_cover"
                className="file-input w-full p-2"
                ref={fileInputRef}
                onChange={event => {
                  const file = event.target.files?.[0];
                  setFormData(prev => ({
                    ...prev,
                    image_cover: file ? file : null
                  }));
                }}
              />
            </div>
            <Button
              color="accent"
              type="submit"
              className="w-full text-white"
              onClick={handleSubmit}
            >
              {t('adminPage.menuManagement.mainMenu.modal.btnSubmit')}
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ModalUpdateMenu;
