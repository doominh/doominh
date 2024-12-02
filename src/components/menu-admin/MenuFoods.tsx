import { useTranslation } from 'react-i18next';
import { CiCirclePlus } from 'react-icons/ci';
import { GrPrevious } from 'react-icons/gr';
import { Link, useParams } from 'react-router-dom';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import FoodItem from '~/components/menu-admin/FoodItem';
import ModalCreateFood from '~/pages/admin/menus/ModalCreateFood';
import { useGetAllMenuDetailByIdMenuQuery } from '~/services/BaseApi.service';
import ModalUpdateFood from '~/pages/admin/menus/ModalUpdateFood';
import { useEffect, useState } from 'react';
import { useDeleteMenuDetailMutation } from '~/services/menuDetail/menuDetailApi.service';
import { MenuDetail } from '~/types/menu';
import { Button } from 'react-daisyui';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const MenuFoods: React.FC = () => {
  const [currentItem, setCurrentItem] = useState<MenuDetail | null>(null);
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const {
    data: items,
    isFetching,
    refetch
  } = useGetAllMenuDetailByIdMenuQuery(id || '');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // handle add food
  const handleAddFood = () => {
    const modal = document.getElementById(
      'modal_add_food'
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  //handle update: set item > useEffect to show update modal > pass item into modal
  const handleUpdateFood = (item: MenuDetail) => {
    setCurrentItem(null);
    setCurrentItem({ ...item });
  };
  useEffect(() => {
    if (currentItem) {
      const modal = document.getElementById(
        'modal_update_food'
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }
    }
  }, [currentItem]);

  // handle delete food
  const [deleteFood] = useDeleteMenuDetailMutation();
  const handleDeleteFood = async (_id: string) => {
    await deleteFood(_id);
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
  }, [items]);

  const menuItems: MenuDetail[] = Array.isArray(items?.data) ? items.data : [];
  const totalRecords = menuItems.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const pageNumbers = Array.from(Array(totalPages).keys()).map(
    pageNumber => pageNumber + 1
  );
  return (
    <div className="">
      <HeaderDashboard />
      <div className="m-[10px] pt-[30px] md:m-[20px]  xl:mx-0 xl:p-0">
        <div className="mb-[20px] mt-4  flex items-center justify-between gap-[10px]">
          <Link to="/admin/menu-admin">
            <Button color="primary" className="text-white">
              <GrPrevious />
              {t('adminPage.branchesManagerment.branchDetails.backButton')}
            </Button>
          </Link>

          {/* modal create food */}
          <Button color="accent" className="text-white" onClick={handleAddFood}>
            <CiCirclePlus className="text-[1.4rem]" />
          </Button>
          {id && <ModalCreateFood idMenu={id} refetchFoods={refetch} />}
          {currentItem && (
            <ModalUpdateFood item={currentItem} refetchFoods={refetch} />
          )}
        </div>
        <div className="mt-[20px]">
          <div className="mt-[20px]">
            <div className="mb-[25px] mt-[20px] overflow-x-auto  rounded-lg bg-base-100 p-3 ">
              <div className=" overflow-x-auto  scrollbar-thin">
                <table className="table table-zebra ">
                  <thead className="rounded-lg  bg-primary text-center text-[.9rem] text-white">
                    <tr>
                      <th>
                        {t(
                          'adminPage.menuManagement.menuDetail.numericalOrder'
                        )}
                      </th>
                      <th>
                        {t('adminPage.menuManagement.menuDetail.foodImage')}
                      </th>
                      <th>
                        {t('adminPage.menuManagement.menuDetail.foodName')}
                      </th>
                      <th>
                        {t('adminPage.menuManagement.menuDetail.description')}
                      </th>
                      <th>{t('adminPage.menuManagement.menuDetail.price')}</th>
                      <th>
                        {t('adminPage.menuManagement.menuDetail.category')}
                      </th>
                      <th>{t('adminPage.menuManagement.menuDetail.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {!isFetching &&
                      menuItems
                        .slice(
                          (currentPage - 1) * pageSize,
                          currentPage * pageSize
                        )
                        .map((item: MenuDetail, index: number) => (
                          <FoodItem
                            key={item._id}
                            item={item}
                            index={(currentPage - 1) * pageSize + index}
                            handleUpdateFood={handleUpdateFood}
                            handleDeleteFood={handleDeleteFood}
                          />
                        ))}
                  </tbody>
                </table>
                {!isFetching &&
                  (!Array.isArray(items?.data) || items.data.length === 0) && (
                    <div className="w-full p-2 text-center">
                      <p>
                        {t('adminPage.menuManagement.menuDetail.error.empty')}
                      </p>
                    </div>
                  )}
              </div>
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
    </div>
  );
};

export default MenuFoods;
