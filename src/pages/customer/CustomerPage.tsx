import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/hooks/hooks';
import { useGetAllCategoryMenuQuery } from '~/services/categoryMenu/categoryApi.service';
import {
  setFillterData,
  setMenuDetail
} from '~/services/menuDetail/menuDetailSlice';
import { ICategoryMenu } from '~/types/category';
import FoodItem from '~/components/customer/FoodItem';
import { MenuDetail } from '~/types/menu';
import { RootState } from '~/redux/store';
import {
  useGetAllMenuDetailByIdMenuQuery,
  useGetBranchByIdQuery
} from '~/services/BaseApi.service';
import { CiSearch } from 'react-icons/ci';
import CartCustomer from './CartCustomer';
// import { useSocketConnection } from '~/libs/socketio/useSocketConnection';
// import { socket } from '~/libs/socketio/socket';
import { useTranslation } from 'react-i18next';
import { TextLogo } from '~/styles';
import { Button } from 'react-daisyui';
import Avatar from 'boring-avatars';
import ReactCountryFlag from 'react-country-flag';
import { lngs } from '~/constants';

const CustomerPage: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [fillterCategory, setFillterCategory] = useState<string>('All');
  const menuDetail = useAppSelector((state: RootState) => state.menuDetail);
  const branch_id = params.get('branch_id');

  const { data: branch } = useGetBranchByIdQuery(branch_id as string);
  const { data: dataCategory } = useGetAllCategoryMenuQuery();

  const { t, i18n } = useTranslation();

  const SwitchLanguge = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const {
    data: dataMenuDetail,
    isError: isErrorMenuDetail,
    isLoading: isLoadingDetail
  } = useGetAllMenuDetailByIdMenuQuery(branch?.data?.menu_id ?? '', {
    skip: dataCategory?.data?.length == 0
  });

  useEffect(() => {
    if (dataMenuDetail) {
      dispatch(setMenuDetail(dataMenuDetail?.data));
    }
  }, [dataMenuDetail, dispatch]);

  const handleTabClick = (categoryId: string) => {
    setFillterCategory(categoryId);
    dispatch(setFillterData(categoryId));
  };

  return (
    <div className="container mx-auto overflow-x-hidden overflow-y-hidden p-[10px] md:overflow-y-auto md:py-[20px]">
      {/* header  */}
      <div className="flex items-center justify-between">
        <div className="">
          {/* <div className="">Xin chào</div> */}
          <div className="block cursor-pointer md:hidden">
            <p className="text-[1.7rem] font-bold text-primary">Gloria</p>
          </div>

          <div className="">
            <div className="hidden md:block">
              <TextLogo className="text-primary">Gloria</TextLogo>
            </div>
          </div>
        </div>
        <div className="flex items-center md:gap-[10px]">
          <div className="mr-2 flex cursor-pointer items-center rounded-md border bg-white p-2">
            <input
              type="text"
              className="w-[130px] bg-transparent text-[14px]  outline-none sm:w-full"
              placeholder={t('orderPage.customerDashboard.search_placeholder')}
            />
            <button type="submit">
              <CiSearch className="text-[1.4rem]" />
            </button>
          </div>
          <div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="m-1  flex items-center"
              >
                <div className="avatar online cursor-pointer">
                  <Avatar
                    size={32}
                    name="hehe"
                    variant="beam"
                    colors={['#FF4757', '#9980FA', '#00E26B', '#0a0310']}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li
                  onClick={() => SwitchLanguge(lngs.vi.key)}
                  className={
                    i18n.language === lngs.vi.key ? 'bg-neutral-200' : ''
                  }
                >
                  <div className="">
                    <ReactCountryFlag countryCode={lngs.vi.countryCode} svg />
                    <p>{t('LanguageSwitch.vi')}</p>
                  </div>
                </li>
                <li
                  onClick={() => SwitchLanguge(lngs.en.key)}
                  className={
                    i18n.language === lngs.en.key ? 'bg-neutral-200' : ''
                  }
                >
                  <div className="">
                    <ReactCountryFlag countryCode={lngs.en.countryCode} svg />
                    <p>{t('LanguageSwitch.en')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className=" cursor-pointer ">
            <div className="">
              <div className="hidden md:block">
                <CartCustomer />
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-[5] block  bg-white p-[10px] md:hidden">
              <CartCustomer />
            </div>
          </div>
        </div>
      </div>
      {/* main  */}
      <div className="mt-5">
        <div className="relative z-[-1] hidden h-[300px] w-full overflow-hidden rounded-[10px] bg-[#2F2F2F]  md:block">
          <div className="">
            <div className="p-[40px] text-white md:w-[40%] xl:w-[60%]">
              <p className="text-[2rem] text-primary">
                {t('orderPage.customerDashboard.discount_program_title')}
              </p>
              <p className="mt-5 md:line-clamp-3 xl:line-clamp-2">
                {t('orderPage.customerDashboard.discount_program_description')}
              </p>
              <button className="btn mt-5 bg-primary text-white">
                {t('orderPage.customerDashboard.call_order_button')}
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 top-0 h-full md:w-[60%] xl:w-[40%]">
            <img
              src="https://cdn.dribbble.com/userupload/7143226/file/original-0925d800240f43680473c0753133bf0c.png?resize=752x"
              alt=""
            />
          </div>
        </div>
        <div className="relative block h-[180px] w-full rounded-[10px] shadow-md md:hidden">
          <img
            src="https://cdn.dribbble.com/userupload/7143226/file/original-0925d800240f43680473c0753133bf0c.png?resize=752x"
            alt=""
            className="h-full w-full rounded-[10px] object-cover"
          />
        </div>
      </div>
      {/* category  */}
      {dataCategory?.data && dataCategory?.data.length > 0 && (
        <nav className=" mt-5 md:my-[40px]">
          <div className="flex flex-wrap justify-between">
            <div className="">
              <p className="text-[1rem] font-bold md:text-[1.4rem]">
                {t('orderPage.customerDashboard.menu_title')}
              </p>
            </div>
            <div className=" my-[10px] overflow-x-hidden md:my-[0]">
              <div className="flex gap-[10px] overflow-x-scroll pb-[10px] scrollbar-hide md:mt-0 md:overflow-x-hidden md:pb-[0]">
                <Button
                  onClick={() => handleTabClick('All')}
                  className={` mx-0 border-none capitalize  md:mx-2 ${fillterCategory == 'All' ? 'bg-primary text-white' : ''}`}
                >
                  {t('shared.all')}(
                  {dataMenuDetail?.data &&
                    (dataMenuDetail?.data as MenuDetail[]).length}
                  )
                </Button>
                {dataCategory?.data.map(
                  (item: ICategoryMenu, index: number) => (
                    <Button
                      onClick={() => handleTabClick(item._id as string)}
                      key={index}
                      className={`  mx-0 border-none capitalize  md:mx-2 ${fillterCategory == item._id ? 'bg-primary text-white' : ''}`}
                    >
                      {item?.name}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
      <div>
        <div>
          <div className="mb-[40px] h-full overflow-auto scroll-smooth rounded-[10px]  scrollbar-none md:h-full">
            {isLoadingDetail ? (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-4">
                {Array.from(new Array(6)).map((item, index) => (
                  <div key={index} className="skeleton">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {dataMenuDetail?.data &&
                  (dataMenuDetail.data as MenuDetail[]).length > 0 &&
                  menuDetail.fillterData.map((item: MenuDetail) => (
                    <FoodItem key={item._id} item={item} />
                  ))}
                {(menuDetail.fillterData.length == 0 && !isLoadingDetail) ||
                isErrorMenuDetail ? (
                  <h1 className="text-base font-semibold capitalize">
                    {t('orderPage.customerDashboard.no_menus_available')}
                  </h1>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
