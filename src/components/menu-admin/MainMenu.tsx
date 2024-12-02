import React, { useEffect, useState } from 'react';

import {
  useDeleteMenuMutation,
  useGetMenusQuery
} from '~/services/menu/menu.service';
import MenuIt from './MenuIt';
import { CiCirclePlus } from 'react-icons/ci';
import ModalCreateMenu from '~/pages/admin/menus/ModalCreateMenu';
import ModalUpdateMenu from '~/pages/admin/menus/ModalUpdateMenu';
import { useTranslation } from 'react-i18next';
import { IMenu } from '~/types/menu';
import { Button } from 'react-daisyui';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const MainMenu: React.FC<object> = () => {
  const [currentItem, setCurrentItem] = useState<IMenu | null>(null);
  const { data: menus, isFetching, refetch } = useGetMenusQuery();
  const { t } = useTranslation();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // handle add menu
  const handleAddMenu = () => {
    const modal = document.getElementById(
      'modal_add_menu'
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  // handle update: set item > useEffect to show update modal > pass item into modal
  const handleUpdateMenu = (item: IMenu) => {
    setCurrentItem(null);
    setCurrentItem({ ...item });
  };

  useEffect(() => {
    if (currentItem) {
      const modal = document.getElementById(
        'modal_update_menu'
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }
    }
  }, [currentItem]);

  // handle delete menu
  const [deleteMenu] = useDeleteMenuMutation();
  const handleDeleteMenu = async (_id: string) => {
    await deleteMenu(_id);
    refetch();
  };

  // Handle pagination
  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [menus]);

  if (isFetching) {
    return <p>Loading...</p>;
  }

  const menuList: IMenu[] = Array.isArray(menus?.data) ? menus.data : [];
  const totalRecords = menuList.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const pageNumbers = Array.from(Array(totalPages).keys()).map(
    pageNumber => pageNumber + 1
  );

  return (
    <div className="">
      <div className="mb-[20px] mt-4 flex flex-row-reverse items-center justify-between gap-[10px]">
        {/* modal create menu */}
        <Button color="accent" className="text-white" onClick={handleAddMenu}>
          <CiCirclePlus className="text-[1.4rem]" />
        </Button>
        <ModalCreateMenu refetchMenus={refetch} />

        {/* modal update menu */}
        {currentItem && (
          <ModalUpdateMenu item={currentItem} refetchMenus={refetch} />
        )}
      </div>
      <div className="mt-[20px]">
        <div className="mb-[25px] mt-[20px] overflow-x-auto  rounded-lg bg-base-100 p-3 ">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table table-zebra ">
              <thead className="rounded-lg  bg-primary text-center text-[.9rem] text-white">
                <tr>
                  <th>
                    {t('adminPage.menuManagement.mainMenu.numericalOrder')}
                  </th>
                  <th>{t('adminPage.menuManagement.mainMenu.menuName')}</th>
                  <th>{t('adminPage.menuManagement.mainMenu.creator')}</th>
                  <th>
                    {t('adminPage.menuManagement.mainMenu.innitiatedDate')}
                  </th>
                  <th></th>
                  <th>{t('adminPage.menuManagement.mainMenu.action')}</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {!isFetching &&
                  Array.isArray(menuList) &&
                  menuList
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((menu: IMenu, index: number) => (
                      <MenuIt
                        key={menu._id}
                        menu={menu}
                        index={(currentPage - 1) * pageSize + index}
                        handleUpdateMenu={handleUpdateMenu}
                        handleDeleteMenu={handleDeleteMenu}
                      />
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="mr-2 text-black"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>
        {pageNumbers.map((pageNumber, index) => (
          <Button
            key={index}
            color={`${currentPage === pageNumber ? 'primary' : 'neutral'}`}
            className="mx-1 text-white"
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        <button
          className="mr-2 text-black"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
