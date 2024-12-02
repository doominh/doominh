import React from 'react';
import { FaBell } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import { FaCaretDown } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdNewReleases } from 'react-icons/md';
import { GrStatusGood } from 'react-icons/gr';
import Avatar from 'boring-avatars';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import SearchDashboard from './SearchDashboard';
import { useTranslation } from 'react-i18next';
import { lngs } from '~/constants';
import ReactCountryFlag from 'react-country-flag';

const UserDashboard: React.FC<{}> = () => {
  const auth = useAppSelector((state: RootState) => state.auth.currentUser);

  const { t, i18n } = useTranslation();

  const SwitchLanguge = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="flex items-center gap-[20px]">
      {/* search  */}
      <SearchDashboard />
      {/* bell */}
      <div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className=" m-1">
            <FaBell className="cursor-pointer text-[1.2rem] text-yellow-500" />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] w-[200px] rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <div className="flex items-center gap-[5px]">
                <MdNewReleases className=" text-[2rem] text-primary" />
                <p className=" text-[14px]">Doanh thu tháng nay giảm 12%</p>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-[5px]">
                <GrStatusGood className=" text-[2rem] text-green-500" />
                <p className=" text-[14px]">
                  Vừa xoá nhân viên tên:... thành công
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* avatar user*/}

      <div className="flex items-center gap-[5px]">
        {/* avatar */}
        <div className="avatar online cursor-pointer">
          {auth.image ? (
            <img src={auth.image} className="size-8 rounded-full" />
          ) : (
            <Avatar
              size={32}
              name={auth.fullname}
              variant="beam"
              colors={['#FF4757', '#9980FA', '#00E26B', '#0a0310']}
            />
          )}
          <div></div>
        </div>
        {/* name */}
        <div>
          {auth.fullname}
          <p>{}</p>
        </div>
      </div>

      {/* country */}
      <div className=" cursor-pointer ">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="m-1  flex items-center">
            <BiWorld className="text-[1.4rem]" />
            <FaCaretDown />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li
              onClick={() => SwitchLanguge(lngs.vi.key)}
              className={i18n.language === lngs.vi.key ? 'bg-neutral-200' : ''}
            >
              <div className="">
                <ReactCountryFlag countryCode={lngs.vi.countryCode} svg />
                <p>{t('LanguageSwitch.vi')}</p>
              </div>
            </li>
            <li
              onClick={() => SwitchLanguge(lngs.en.key)}
              className={i18n.language === lngs.en.key ? 'bg-neutral-200' : ''}
            >
              <div className="">
                <ReactCountryFlag countryCode={lngs.en.countryCode} svg />
                <p>{t('LanguageSwitch.en')}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* setting  */}
      <div className="cursor-pointer ">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn m-1 bg-primary text-[1.1rem] text-white hover:bg-primary hover:opacity-[0.6]"
          >
            <IoSettingsOutline />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <div className="flex items-center gap-[6px] ">
                <p className="text-[14px]">Đổi giao diện</p>
                <input
                  type="checkbox"
                  value="synthwave"
                  className="theme-controller toggle col-span-2 col-start-1 row-start-1 border-sky-400 bg-amber-300 [--tglbg:theme(colors.sky.500)] checked:border-blue-800 checked:bg-blue-300 checked:[--tglbg:theme(colors.blue.900)]"
                />
              </div>
            </li>
            {/* <li>
              <a>Item 2</a>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
