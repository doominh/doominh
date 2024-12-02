// HeaderDashboard.tsx
import React from 'react';
import UserDashboard from './UserDashboard';
import { FaBell } from 'react-icons/fa6';
import { IoSettings } from 'react-icons/io5';
import { IconType } from 'react-icons';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '../../redux/store';
import Avatar from 'boring-avatars';
import SearchDashboard from './SearchDashboard';
import { useTranslation } from 'react-i18next';
import { BiWorld } from 'react-icons/bi';
import { FaCaretDown } from 'react-icons/fa';
import { lngs } from '~/constants';
import ReactCountryFlag from 'react-country-flag';

const HeaderDashboard: React.FC<{
  title?: string;
  icon?: IconType;
}> = ({ title, icon }) => {
  const auth = useAppSelector((state: RootState) => state.auth.currentUser);
  const { t, i18n } = useTranslation();

  const SwitchLanguge = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="mb-[30px] mt-[10px] items-center justify-between  md:flex">
      <div className=" sm:relative sm:hidden">
        <div className="fixed left-0 top-0 z-[1] h-[60px] w-full bg-base-100 shadow-sm"></div>
      </div>

      <div className="hidden items-center gap-[8px] md:flex">
        {icon && icon({ className: 'text-2xl text-primary ' })}

        <h1 className="m-0 p-0 text-3xl font-bold capitalize text-primary-content md:hidden lg:block">
          {title ?? t('adminPage.header.headerDashboadMobile.dashboard')}
        </h1>
      </div>
      <div className="hidden md:block">
        <UserDashboard />
      </div>
      <div className="avatar online fixed   right-[10px] top-[10px] z-[2] block cursor-pointer md:hidden">
        <div className="w-[40px] rounded-full">
          <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label htmlFor="my-drawer-4">
                {auth.image ? (
                  <img
                    src={auth.image}
                    className="size-[6.25rem] rounded-full"
                  />
                ) : (
                  <Avatar
                    size={100}
                    name={auth.fullname}
                    variant="beam"
                    colors={['#FF4757', '#9980FA', '#00E26B', '#0a0310']}
                  />
                )}
              </label>
            </div>
            <div className="drawer-side z-10">
              <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu min-h-full w-[60%]  bg-base-100 p-4 text-base-content">
                <li className="mx-auto flex justify-center text-center">
                  <div className="avatar">
                    {auth.image ? (
                      <img
                        src={auth.image}
                        className="mx-auto size-[6.25rem] rounded-full"
                      />
                    ) : (
                      <Avatar
                        size={100}
                        name={auth.fullname}
                        variant="beam"
                        colors={['#FF4757', '#9980FA', '#00E26B', '#0a0310']}
                      />
                    )}
                  </div>
                  <div className=" mx-auto flex  justify-center">
                    <p className="text-[1.1rem] text-primary">
                      {auth.fullname}
                    </p>
                  </div>
                </li>
                <li>
                  <SearchDashboard />
                </li>
                <li>
                  <div className="">
                    <div tabIndex={0} role="button" className=" m-1 ">
                      <FaBell className="cursor-pointer text-[1.2rem] text-yellow-500" />
                    </div>
                    <p className="text-[1rem]">
                      {t('adminPage.header.headerDashboadMobile.notifications')}
                    </p>
                  </div>
                </li>
                <li className=" ">
                  <div className="">
                    <div tabIndex={0} role="button" className=" m-1">
                      <IoSettings className="cursor-pointer text-[1.2rem] " />
                    </div>
                    <p className="text-[1rem]">
                      {t('adminPage.header.headerDashboadMobile.settings')}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="m-1  flex items-center"
                    >
                      <BiWorld className="text-[1.4rem]" />
                      <FaCaretDown />
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
                          <ReactCountryFlag
                            countryCode={lngs.vi.countryCode}
                            svg
                          />
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
                          <ReactCountryFlag
                            countryCode={lngs.en.countryCode}
                            svg
                          />
                          <p>{t('LanguageSwitch.en')}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;
