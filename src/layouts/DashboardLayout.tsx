import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBarLayout from '~/components/sidebar/Sidebar';

const DashboardLayout: React.FC<object> = () => {
  // const [sideBarOpen, setSideBarOpen] = useState(true);
  // const handleToggleSideBar = () => setSideBarOpen(!sideBarOpen);
  return (
    <div className="fixed flex h-full w-full">
      <aside className="left-0">
        <SideBarLayout />
      </aside>
      <main className="relative w-full overflow-y-auto bg-[#f7f8fa] px-0 lg:px-[20px] xl:w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
