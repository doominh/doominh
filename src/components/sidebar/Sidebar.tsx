import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TextLogo } from '~/styles';
import { FaAnglesLeft } from 'react-icons/fa6';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { BiLogOut } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '~/hooks/hooks';
import { logout } from '~/services/auth/authSlice';
import Avatar from 'boring-avatars';
import SidebarNavigation, { ISidebarItem } from './SidebarNavigation';
import { Divider } from 'react-daisyui';
import { RootState } from '~/redux/store';
import { ROLE } from '~/constants';
import { useTranslation } from 'react-i18next';

const SideBarLayout: React.FC = () => {
  const auth = useAppSelector((state: RootState) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [pathName, setPathName] = useState(window.location.pathname);
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  useEffect(() => {
    setPathName(window.location.pathname);
  }, [pathName]);

  return (
    <div className={`drawer lg:drawer-open`}>
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content absolute left-[20px] top-[10px] z-[2] flex h-[30px] w-full  cursor-pointer flex-col  items-center  justify-center  text-[2rem] md:top-[20px] lg:hidden  ">
        <label htmlFor="my-drawer-2" className="pt-0 *:drawer-button md:pt-3">
          <HiOutlineMenuAlt2 className="cursor-pointer" />
        </label>
      </div>

      <div className="drawer-side z-20  shadow-lg">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu min-h-full w-72 bg-base-100 p-4 text-base-content md:w-64 xl:w-72">
          <div className=" my-5">
            <div className="relative flex items-center justify-center">
              <TextLogo className="text-primary">Gloria</TextLogo>
              <label
                className="drawer-overlay"
                htmlFor="my-drawer-2"
                aria-label="close sidebar"
              >
                <FaAnglesLeft className=" absolute right-0 hidden cursor-pointer text-[1.5rem] font-semibold text-primary max-md:block" />
              </label>
            </div>
            {auth && auth.role !== ROLE.ADMIN && (
              <div className="mt-8 flex flex-col items-center justify-center gap-[10px]">
                <div className="avatar">
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
                </div>
                <h3 className=" text-center text-lg font-bold">
                  {auth.fullname}
                </h3>
                <h3 className="text-sm font-medium">{auth.branchId.name}</h3>
              </div>
            )}
          </div>
          <Divider>
            <h4 className="my-2 text-sm font-semibold">
              {t('shared.category')}
            </h4>
          </Divider>
          <div className="   max-h-[calc(100vh-80px-300px)]  overflow-y-auto">
            <SidebarNavigation>
              {(sidebarRole: ISidebarItem[]) =>
                sidebarRole.map((item: ISidebarItem, index: number) => {
                  return (
                    <NavLink
                      key={index}
                      to={item.path}
                      className={({ isActive }) =>
                        `my-2 flex items-center gap-x-3  truncate p-2 font-medium ${
                          isActive
                            ? ' justify-between border-l-[3px] border-primary bg-base-200 '
                            : 'duration-50 group  hover:bg-base-200'
                        }`
                      }
                      onClick={() => setPathName(item.path)}
                    >
                      <div className="flex  items-center gap-2">
                        {item.Icon && <item.Icon className="text-xl" />}
                        <p className="text-base">{t(item.label)}</p>
                      </div>
                    </NavLink>
                  );
                })
              }
            </SidebarNavigation>
          </div>
          <Divider>
            <h4 className="my-2 text-sm font-semibold">{t('shared.action')}</h4>
          </Divider>
          <div
            onClick={handleLogout}
            className="my-2 flex  cursor-pointer items-center gap-x-3   truncate rounded-none p-2  font-medium hover:bg-base-200"
          >
            <BiLogOut className="text-[20px]" />
            <p className="text-base">{t('shared.logout')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarLayout;
