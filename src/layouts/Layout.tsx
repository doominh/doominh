import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBarLayout from '../components/sidebar/Sidebar';
const Layout: React.FC<object> = () => {
  return (
    <div className="flex  h-screen w-full">
      <aside>
        <SideBarLayout />
      </aside>
      <main className="w-full overflow-y-scroll bg-base-200">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
