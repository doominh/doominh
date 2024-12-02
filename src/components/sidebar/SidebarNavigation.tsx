import { useMemo, type ReactNode } from 'react';
import { BiFoodMenu } from 'react-icons/bi';
import { CgMenuBoxed } from 'react-icons/cg';
import { GrMapLocation } from 'react-icons/gr';
import { LuUsers } from 'react-icons/lu';
import { MdOutlineTableRestaurant } from 'react-icons/md';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { LuLayoutDashboard } from 'react-icons/lu';
import { LuClipboardSignature } from 'react-icons/lu';
import { IconType } from 'react-icons';

interface SidebarNavigationProps {
  children: (SidebarByRole: ISidebarItem[]) => ReactNode;
}

type TranslationKeys =
  | 'routes.home'
  | 'shared.logout'
  | 'routes.tableManager'
  | 'routes.employeeManager'
  | 'routes.branchManager'
  | 'routes.revenueManager'
  | 'routes.menuManager';
export interface ISidebarItem {
  label: TranslationKeys;
  path: string;
  Icon: IconType;
}

export const sidebarRole: Record<string, ISidebarItem[]> = {
  admin: [
    {
      label: 'routes.home',
      path: '/admin/dashboard',
      Icon: LuLayoutDashboard
    },
    {
      label: 'routes.branchManager',
      path: '/admin/branch',
      Icon: GrMapLocation
    },
    {
      label: 'routes.employeeManager',
      path: '/admin/employees',
      Icon: LuUsers
    },

    {
      label: 'routes.menuManager',
      path: '/admin/menu-admin',
      Icon: LuClipboardSignature
    },
    {
      label: 'routes.revenueManager',
      path: '/admin/revenue-managerment',
      Icon: CgMenuBoxed
    }
  ],
  employee: [
    {
      label: 'routes.home',
      path: '/employee/dashboard',
      Icon: LuLayoutDashboard
    },
    {
      label: 'routes.menuManager',
      path: '/employee/menu-manager',
      Icon: BiFoodMenu
    },
    {
      label: 'routes.tableManager',
      path: '/employee/tables-manager',
      Icon: MdOutlineTableRestaurant
    }
  ],
  chef: [
    {
      label: 'routes.home',
      path: '/chef',
      Icon: LuLayoutDashboard
    }
    // ,
    // {
    //   label: 'routes.home',
    //   path: '/chefs ',
    //   Icon: LuLayoutDashboard
    // }
  ]
};

function SidebarNavigation({ children }: SidebarNavigationProps) {
  const auth = useAppSelector((state: RootState) => state.auth.currentUser);

  const role = auth?.role;

  const sidebar = useMemo(() => {
    return role ? sidebarRole[role] : [];
  }, [role]);

  return <>{children(sidebar)}</>;
}

export default SidebarNavigation;
