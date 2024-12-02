import React, { useEffect, useRef, useState } from 'react';
import { ICategoryMenu } from '~/types/category';
import { useGetAllCategoryMenuQuery } from '~/services/categoryMenu/categoryApi.service';
import { useUpdateMenuDetailMutation } from '~/services/menuDetail/menuDetailApi.service';
import { useTranslation } from 'react-i18next';
import { MenuDetail } from '~/types/menu';
import { Button } from 'react-daisyui';

const initialState: Omit<MenuDetail, '_id'> = {
  menu_id: '',
  category_id: '',
  name: '',
  price: 0,
  description: '',
  image: ''
};

interface Props {
  refetchFoods: Function;
  item: MenuDetail;
}

const ModalUpdateFood: React.FC<Props> = ({ refetchFoods, item }) => {
  const [formData, setFormData] =
    useState<Omit<MenuDetail, '_id'>>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateFood] = useUpdateMenuDetailMutation();
  const { data: dataCategory } = useGetAllCategoryMenuQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      menu_id: item.menu_id || '',
      category_id: (item.category_id as ICategoryMenu)?._id || '',
      name: item.name || '',
      price: item.price || 0,
      description: item.description || '',
      image: ''
    });
  }, [item]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_id) {
      newErrors.category_id = t(
        'adminPage.menuManagement.menuDetail.modal.error.valid_category'
      );
    }
    if (!formData.name) {
      newErrors.food_name = t(
        'adminPage.menuManagement.menuDetail.modal.error.valid_foodName'
      );
    }
    if (!formData.price) {
      newErrors.price = t(
        'adminPage.menuManagement.menuDetail.modal.error.valid_foodPrice'
      );
    }
    if (!formData.description) {
      newErrors.description = t(
        'adminPage.menuManagement.menuDetail.modal.error.valid_foodDescription'
      );
    } else if (formData.description.length < 10) {
      newErrors.description = t(
        'adminPage.menuManagement.menuDetail.modal.error.valid_foodDesLength'
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
    formDataSend.append('menu_id', formData.menu_id);
    formDataSend.append('category_id', formData.category_id as string);
    formDataSend.append('food_name', formData.name);
    formDataSend.append('price', formData.price.toString());
    formDataSend.append('description', formData.description);
    if (formData.image) {
      formDataSend.append('image', formData.image);
    }
    await updateFood({
      _id: item._id as string,
      data: formDataSend as unknown as Omit<MenuDetail, '_id'>
    }).unwrap();
    handleModalClose();
    (
      document.getElementById('modal_update_food') as HTMLDialogElement
    )?.close();
    refetchFoods();
  };

  return (
    <>
      <dialog id="modal_update_food" className="modal">
        <div className="modal-box rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-center text-2xl font-bold">
            {t('adminPage.menuManagement.menuDetail.modal.updateMenu')}
          </h3>
          <form method="dialog">
            <Button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={handleModalClose}
            >
              ✕
            </Button>
            <input
              type="hidden"
              id="menu_id"
              name="menu_id"
              value={formData.menu_id}
              readOnly
            />
            <div className="flex flex-col">
              <label htmlFor="category_id" className="mb-2 font-medium">
                {t('adminPage.menuManagement.menuDetail.modal.foodCategory')}:
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id as string}
                onChange={event =>
                  setFormData(prev => ({
                    ...prev,
                    category_id: event.target.value
                  }))
                }
                className={`select select-bordered w-full p-2 ${errors.category_id ? 'border-red-500' : ''}`}
              >
                <option value="" disabled></option>
                {dataCategory?.data &&
                  dataCategory?.data.map((data: ICategoryMenu) => (
                    <option key={data._id} value={data._id}>
                      {data.name}
                    </option>
                  ))}
              </select>
              {errors.category_id && (
                <span className="text-red-500">{errors.category_id}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="food_name" className="mb-2 font-medium">
                {t('adminPage.menuManagement.menuDetail.modal.foodName')}:
              </label>
              <input
                type="text"
                id="food_name"
                name="food_name"
                className={`input input-bordered w-full p-2 ${errors.food_name ? 'border-red-500' : ''}`}
                value={formData.name}
                onChange={event =>
                  setFormData(prev => ({
                    ...prev,
                    food_name: event.target.value
                  }))
                }
              />
              {errors.food_name && (
                <span className="text-red-500">{errors.food_name}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="price" className="mb-2 font-medium">
                {t('adminPage.menuManagement.menuDetail.modal.price')}:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className={`input input-bordered w-full p-2 ${errors.price ? 'border-red-500' : ''}`}
                value={formData.price}
                onChange={event =>
                  setFormData(prev => ({
                    ...prev,
                    price: parseFloat(event.target.value)
                  }))
                }
              />
              {errors.price && (
                <span className="text-red-500">{errors.price}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="mb-2 font-medium">
                {t('adminPage.menuManagement.menuDetail.modal.description')}:
              </label>
              <textarea
                id="description"
                name="description"
                className={`textarea textarea-bordered w-full p-2 ${errors.description ? 'border-red-500' : ''}`}
                value={formData.description}
                onChange={event =>
                  setFormData(prev => ({
                    ...prev,
                    description: event.target.value
                  }))
                }
              />
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="image" className="mb-2 font-medium">
                {t('adminPage.menuManagement.menuDetail.modal.image')}:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                className="file-input w-full p-2"
                ref={fileInputRef}
                onChange={event => {
                  const file = event.target.files?.[0];
                  setFormData(prev => ({
                    ...prev,
                    image: file ? file : null
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
              {t('adminPage.menuManagement.menuDetail.modal.btnSubmit')}
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ModalUpdateFood;
