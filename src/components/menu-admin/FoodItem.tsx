import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '~/helper/formatCurrency';
import { ICategoryMenu } from '~/types/category';
import { MenuDetail } from '~/types/menu';

export default function FoodItem({
  item,
  index,
  handleUpdateFood,
  handleDeleteFood
}: {
  item: MenuDetail;
  index: number;
  handleUpdateFood: (item: MenuDetail) => void;
  handleDeleteFood: (_id: string) => void;
}) {
  const { image, name, description, price, category_id, _id } = item;
  const { t } = useTranslation();

  return (
    <>
      <tr>
        <td className="font-semibold">{index + 1}</td>
        <td className="w-32">
          <img
            className="min-w-20 object-cover"
            src={image as string}
            alt={name}
          />
        </td>
        <td>{name}</td>
        <td className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
          {description}
        </td>
        <td>{formatCurrency(price)}</td>
        <td>{(category_id as ICategoryMenu)?.name}</td>
        <td className="flex h-[110px] items-center justify-center">
          <div className="flex items-center justify-center gap-[10px]">
            <Button
              color="accent"
              onClick={() => handleUpdateFood(item)}
              className="text-white"
            >
              {t('adminPage.menuManagement.menuDetail.button.update')}
            </Button>
            <Button
              color="primary"
              className="text-white"
              onClick={() => {
                if (_id) handleDeleteFood(_id);
              }}
            >
              {t('adminPage.menuManagement.menuDetail.button.delete')}
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
}
