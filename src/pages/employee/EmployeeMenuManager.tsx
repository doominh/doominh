import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { IoAdd } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import LoadingLocal from '~/components/Loading/LoadingLocal';
import HeaderEmployees from '~/components/employee/HeaderEmployees';
import ModalAddMenu from '~/components/employee/ModalAddMenu';
import ModalAddMenuDetail from '~/components/employee/ModalAddMenuDetail';
import MenuItem from '~/components/employee/menuItem';
import ModalDelete from '~/components/menu/ModalDelete';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import {
  useGetAllMenuDetailByIdMenuQuery,
  useGetBranchByIdQuery
} from '~/services/BaseApi.service';
import { useGetAllCategoryMenuQuery } from '~/services/categoryMenu/categoryApi.service';

import {
  setFillterData,
  setMenuDetail
} from '~/services/menuDetail/menuDetailSlice';
import { IBranch } from '~/types/branch';
import { ICategoryMenu } from '~/types/category';
import { MenuDetail } from '~/types/menu';

const EmployeeMenuManager: React.FC<object> = () => {
  const [fillterCategory, setFillterCategory] = useState<string>('All');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const modalAddMenuElenment = useRef(null);
  const modalAddMenuDetailElenment = useRef(null);
  const modalDeleteMenuDetailEl = useRef(null);

  //get branchId from store redux
  const branchId = useAppSelector(
    (state: RootState) => state.auth.currentUser.branchId as IBranch
  );

  //get fillterData from store redux
  const fillterData = useAppSelector(
    (state: RootState) => state.menuDetail.fillterData as MenuDetail[]
  );

  // check brand have menu or have't menu
  const { isFetching, refetch: refetBranch } = useGetBranchByIdQuery(
    branchId._id as string
  );

  // get category
  const { data: dataCategory, isLoading } = useGetAllCategoryMenuQuery();

  // get menu detail by menu id (skip when no dataCategory)
  const {
    data: dataMenuDetail,
    refetch: refetchMenuDetail,
    isFetching: isFetchingDetail,
    isLoading: isLoadingDetail
  } = useGetAllMenuDetailByIdMenuQuery(branchId.menu_id, {
    skip: dataCategory?.data?.length == 0
  });

  // dispatch menuDetail to store
  useEffect(() => {
    if (dataMenuDetail && !isFetchingDetail) {
      dispatch(setMenuDetail(dataMenuDetail?.data));
    }
  }, [dataMenuDetail, dispatch, isFetchingDetail]);

  // fuction close modal delete (refetch when close)
  const closeModalDelete = useCallback(() => {
    const modalDelete =
      modalDeleteMenuDetailEl.current as unknown as HTMLDialogElement;
    if (modalDelete) {
      modalDelete.close();
    }
    refetchMenuDetail();
  }, [refetchMenuDetail]);

  // fuction close modal add menu (refetch when close)
  const closeModalAddMenu = useCallback((): void => {
    const menuEl = modalAddMenuElenment.current as unknown as HTMLDialogElement;
    if (menuEl) {
      menuEl.close();
    }
    refetBranch();
  }, [refetBranch]);

  // fuction open modal add menu
  const openMenuAdd = () => {
    const modalAddEl =
      modalAddMenuElenment.current as unknown as HTMLDialogElement;
    if (modalAddEl) {
      modalAddEl.showModal();
    }
  };

  // fuction open modal add menu detail
  const openMenuAddDetail = () => {
    const modalAddEl =
      modalAddMenuDetailElenment.current as unknown as HTMLDialogElement;
    if (modalAddEl) {
      modalAddEl.showModal();
    }
  };

  // fuction close modal add menu detail (refetch when close)
  const closeModalAddMenuDetail = useCallback((): void => {
    const modalAddElement =
      modalAddMenuDetailElenment.current as unknown as HTMLDialogElement;
    if (modalAddElement) {
      modalAddElement.close();
      refetchMenuDetail();
    }
  }, [refetchMenuDetail]);

  // handle when user clicks on tab
  const handleTabClick = (categoryId: string) => {
    setFillterCategory(categoryId);
    dispatch(setFillterData(categoryId));
  };

  //check account user no menu_id
  if (!branchId) {
    return (
      <div className="flex h-full w-full items-center justify-center text-2xl text-red-600">
        {t('employeeMenuManager.noBranchAccount')}
      </div>
    );
  }

  return (
    <div className=" ml-0 box-border h-full max-h-[100%] w-full  overflow-y-auto  lg:ml-0 lg:px-[10px] lg:pb-[20px] lg:pt-[20px]">
      <div className="box-border h-full max-h-[100%] w-full overflow-hidden bg-[#FFFFFF] shadow-mainMenu md:rounded-[15px] md:px-2 md:pt-0 lg:px-[5px]">
        <div className="mb-3 mt-10 px-[10px] md:mt-0 md:basis-[30%] md:pt-3 lg:mt-0 lg:pt-0">
          <HeaderEmployees title={t('routes.menuManager')} />
          {isFetching && (
            <div className="flex h-full w-full items-center justify-center text-2xl text-red-600">
              <div className="full skeleton min-h-24 w-full"></div>
            </div>
          )}
          {branchId.menu_id && (
            <>
              <div className="mb-3 md:basis-[30%] md:pr-0 md:pt-0 lg:mt-0 ">
                <div className="hidden items-center justify-between px-[7px] md:mt-5 md:flex md:pl-0">
                  <h1 className="mb-[22px] mt-[18px] text-[28px] font-semibold leading-6 text-[#000000] md:hidden md:text-2xl md:text-[30px] md:leading-[30px]">
                    {t('employeeMenuManager.title')}
                  </h1>
                </div>
                <div className="my-[10px] block items-center justify-between md:flex">
                  <div className="mt-3 flex  flex-wrap items-center justify-between gap-3 overflow-x-auto  scrollbar-hide md:my-0 md:flex-row">
                    <div>
                      {isLoading && (
                        <div className="flex w-full flex-wrap gap-1 py-3 xl:gap-2">
                          {Array.from(new Array(6)).map((item, index) => (
                            <div
                              key={index}
                              className="btn skeleton flex w-[110px] items-center shadow-tableItem "
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                      {dataCategory?.data && dataCategory?.data.length > 0 && (
                        <ul
                          className={`flex w-full max-w-full items-center gap-3 overflow-x-auto  scrollbar-hide  md:justify-start md:px-4 md:pl-0 md:scrollbar-thin lg:gap-5 ${fillterCategory != 'All' && '-ml-6 md:ml-0'}`}
                        >
                          <li
                            className={`  ${fillterCategory == 'All'}`}
                            onClick={() => handleTabClick('All')}
                          >
                            <Button
                              className={` btn ${fillterCategory == 'All' && 'bg-primary text-white'}`}
                            >
                              {t('shared.all')}
                            </Button>
                          </li>
                          {dataCategory?.data.map(
                            (item: ICategoryMenu, index: number) => (
                              <li
                                key={index}
                                className={` ${fillterCategory == item._id}`}
                                onClick={() =>
                                  handleTabClick(item._id as string)
                                }
                              >
                                <Button
                                  className={`btn w-[120px] capitalize md:w-full  ${fillterCategory == item._id && 'border-none bg-primary text-white'}`}
                                >
                                  {item.name}
                                </Button>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                      {!dataCategory?.data &&
                        dataCategory?.data.length == 0 && (
                          <div>
                            <span className="text-base font-medium">
                              {t('message.emptyData')}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                  <Button
                    color="accent"
                    onClick={openMenuAddDetail}
                    className=" mt-[10px] cursor-pointer transition-all duration-100 ease-linear active:scale-110 md:mt-0"
                  >
                    <IoAdd className="text-xl text-white" />
                  </Button>
                </div>
                <div className="h-[65vh] w-full overflow-x-auto scrollbar-hide">
                  <table className="table table-zebra mt-[10px] flex items-center ">
                    <thead className="bg-primary text-center text-white ">
                      <tr className="text-[.9rem]">
                        {/* <th>STT</th> */}
                        <th>{t('shared.image')}</th>
                        <th>{t('shared.dish')}</th>
                        <th>{t('shared.description')}</th>
                        <th>{t('shared.price')}</th>
                        <th>{t('shared.type')}</th>
                        <th>{t('shared.action')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {dataMenuDetail?.data &&
                        (dataMenuDetail.data as MenuDetail[]).length > 0 &&
                        (fillterData as MenuDetail[]).map(
                          (item: MenuDetail) => (
                            <MenuItem key={item._id} item={item} />
                          )
                        )}
                    </tbody>
                  </table>
                  {dataMenuDetail?.data &&
                    (dataMenuDetail.data as MenuDetail[]).length == 0 && (
                      <h1 className="mt-8 text-center text-2xl font-semibold capitalize">
                        {t('message.emptyFood')}
                      </h1>
                    )}
                  {isLoadingDetail && <LoadingLocal />}
                </div>
              </div>
            </>
          )}
          {!branchId.menu_id && (
            <>
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <h3 className="text-2xl font-semibold capitalize">
                  {t('message.emptyFood')}
                </h3>
                <span
                  onClick={openMenuAdd}
                  className="mt-3 flex cursor-pointer items-center justify-center rounded-md bg-accent p-2 text-center  text-white hover:opacity-80"
                >
                  {t('employeeMenuManager.createNewMenu')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {branchId.menu_id && (
        <>
          <ModalAddMenuDetail
            modalAddMenuDetailElenment={modalAddMenuDetailElenment}
            closeModalAddMenuDetail={closeModalAddMenuDetail}
          />
          <ModalDelete
            modalDeleteMenuDetailEl={modalDeleteMenuDetailEl}
            closeModalDelete={closeModalDelete}
          />
        </>
      )}

      {!branchId.menu_id && (
        <ModalAddMenu
          modalAddMenuElenment={modalAddMenuElenment}
          closeModalAddMenu={closeModalAddMenu}
        />
      )}
    </div>
  );
};

export default EmployeeMenuManager;
