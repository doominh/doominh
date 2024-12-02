import React from 'react';
import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IMenu } from '~/types/menu';

interface Props {
  menu: IMenu;
  index: number;
  handleUpdateMenu: (item: IMenu) => void;
  handleDeleteMenu: (_id: string) => void;
}

const MenuIt: React.FC<Props> = ({
  menu,
  index,
  handleUpdateMenu,
  handleDeleteMenu
}) => {
  const { name, createdAt, user_id, _id } = menu;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
  };
  const { t } = useTranslation();

  return (
    <>
      <tr>
        <td className="font-semibold">{index + 1}</td>
        <td>{name}</td>
        <td>{user_id?.fullname ?? null}</td>
        <td>{formatDate(createdAt)}</td>
        <td></td>
        <td className="flex w-full justify-center text-center">
          <div className="flex items-center justify-center gap-[10px]">
            <Link to={`/admin/menu-admin/${menu._id}`}>
              <Button color="secondary" className="text-white">
                {t('adminPage.menuManagement.mainMenu.button.detail')}
              </Button>
            </Link>

            <Button
              color="accent"
              className="text-white"
              onClick={() => handleUpdateMenu(menu)}
            >
              {t('adminPage.menuManagement.mainMenu.button.update')}
            </Button>
            <Button
              color="primary"
              className="text-white"
              onClick={() => handleDeleteMenu(_id)}
            >
              {t('adminPage.menuManagement.mainMenu.button.delete')}
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default MenuIt;
