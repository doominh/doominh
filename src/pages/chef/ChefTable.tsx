import { NavLink } from 'react-router-dom';
import { useGetBillDetailQuery } from '~/services/bill/billApi.service';
import { ITable } from '~/types/table';
import { IEmployeeOrder } from '~/types/order';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { IDeleteData } from '~/types/bill-details';

interface ChefTableProps {
  table: ITable;
  orders: { item: ITable; order: IEmployeeOrder[] | null }[];
  deleteData?: IDeleteData;
}

const ChefTable = ({ table, orders, deleteData }: ChefTableProps) => {
  const { t } = useTranslation();
  const {
    data: billDetail,
    isFetching: isBillDetailFetching,
    refetch
  } = useGetBillDetailQuery({
    table_name: table.name,
    branch_id: table.branch_id
  });

  const [dishCount, setDishCount] = useState(0);

  useEffect(() => {
    if (billDetail?.data) {
      setDishCount(billDetail.data.length);
    }
  }, [billDetail]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      refetch();
    }
  }, [orders, refetch]);

  useEffect(() => {
    if (deleteData) {
      refetch();
    }
  }, [deleteData, refetch]);

  if (!deleteData && dishCount <= 0) {
    // Check if deleteData is undefined
    return null;
  }

  return (
    <NavLink
      to={`/chef/${table.name}`}
      className={({ isActive }) =>
        `${isActive ? 'border-b-4 border-primary' : ''}`
      }
    >
      <div className="rounded-2xl border-2 bg-white p-4">
        <div className="relative flex cursor-pointer items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="">
              <div className="inline-block rounded-lg bg-primary p-2 text-2xl font-bold text-white">
                <div className="">{table.name}</div>
              </div>
            </div>
          </div>

          <div className="">
            <p className="font-semibold text-primary">
              {isBillDetailFetching
                ? 'Loading...'
                : `${dishCount} ${t('shared.dish')}`}
            </p>
          </div>
        </div>

        <div className="mt-2 line-clamp-2">
          <p className="line-clamp-2 text-sm font-light">
            {table.updatedAt
              ? `${t('ChefPages.chefDetail.create_table')} (${formatDistanceToNow(new Date(table.updatedAt), { addSuffix: true })})`
              : t('ChefPages.chefDetail.not_create_table')}
          </p>
        </div>
      </div>
    </NavLink>
  );
};

export default ChefTable;
