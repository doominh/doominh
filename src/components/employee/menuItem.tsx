import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { formatCurrency } from '~/helper/formatCurrency';
import { setDelete, setEdit } from '~/services/menuDetail/menuDetailSlice';
import { ICategoryMenu } from '~/types/category';
import { MenuDetail } from '~/types/menu';

export default function MenuItem({ item }: { item: MenuDetail }) {
  const { _id, image, name, description, price, category_id } = item;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // dispath setEdit to store
  const handleEdit = (_id: string) => {
    dispatch(setEdit(_id));
    openModalEdit();
  };

  // dispath setDelete to store
  const handledelete = (_id: string) => {
    dispatch(setDelete(_id));
    openModalDelete();
  };

  // open modal delete
  const openModalDelete = () => {
    const dialog = document.querySelector(
      '#dialog_modal_delete'
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  // open modal edit
  const openModalEdit = () => {
    const dialog = document.querySelector(
      '#dialog_modal_add_menu_detail'
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  return (
    <>
      <tr className="text-center">
        {/* <td className="">
          <h2>{index}</h2>
        </td> */}
        <td>
          <div className="h-[80px] w-[80px] text-center md:w-full">
            <img
              className="mx-auto h-full w-full rounded-lg object-cover md:w-[140px]"
              src={image as string}
              alt={name}
            />
          </div>
        </td>
        <td>
          <span className="line-clamp-1 block text-base font-bold capitalize md:overflow-hidden md:text-[1rem] lg:text-center">
            {name}
          </span>
        </td>
        <td>
          <span className="block max-h-14 max-w-[100px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-base  md:text-[1rem]">
            {description}
          </span>
        </td>
        <td>
          <span className="block  text-base  text-primary md:text-[1rem]">
            {formatCurrency(price)}
          </span>
        </td>
        <td>
          <span className="block text-sm md:text-[1rem]">
            {(category_id as ICategoryMenu).name}
          </span>
        </td>
        <td>
          <div className="flex items-center justify-center gap-[10px]">
            <Button
              color="secondary"
              onClick={() => handleEdit(_id as string)}
              className="btn cursor-pointer text-base-100"
            >
              {t('shared.update')}
            </Button>
            <Button
              color="primary"
              onClick={() => handledelete(_id as string)}
              className="btn  text-base-100"
            >
              {t('shared.delete')}
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
}
