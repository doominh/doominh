import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '~/hooks/hooks';
import { useJoinBranchRoom } from '~/libs/socketio/joinRoom-hooks';
import { useOrderUpdate } from '~/libs/socketio/useGetOrder';
import { useSocketConnection } from '~/libs/socketio/useSocketConnection';
import { socket } from '~/libs/socketio/socket';
import { Toastify } from '~/helper/Toastify';
import { useTranslation } from 'react-i18next';
import { RootState } from '~/redux/store';
import { IEmployeeOrder } from '~/types/order';
import { useGetTablesQuery } from '~/services/table/tableApi.service';
import { ITable } from '~/types/table';
import ChefTable from './ChefTable';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import LoadingLocal from '~/components/Loading/LoadingLocal';
import { useGetBillDetailQuery } from '~/services/bill/billApi.service';
import { useGetDeleteBill } from '~/libs/socketio/useGetDeleteBill';

const ChefDashboard = () => {
  const [orders, setOrders] = useState<
    { item: ITable; order: IEmployeeOrder[] | null }[]
  >([]);
  const branch_id = useAppSelector(
    (state: RootState) => state.branch.data?._id
  );
  const { t } = useTranslation();
  const orderData = useOrderUpdate({ socket });
  const joinBranchRoom = useJoinBranchRoom({ socket, branchId: branch_id });
  const deleteData = useGetDeleteBill({ socket });

  const { data: tablesDataResponse, isFetching } = useGetTablesQuery({
    status: '1',
    branch_id
  });

  const tablesData = tablesDataResponse?.data;
  const billDataTables = tablesData?.map((tables: ITable) => tables.name);

  const { data: billDetail, isFetching: isBillDetailFetching } =
    useGetBillDetailQuery({
      table_name: billDataTables,
      branch_id: branch_id
    });

  const [dishCount, setDishCount] = useState(0);

  useEffect(() => {
    if (billDetail?.data) {
      setDishCount(billDetail?.data?.length);
    }
  }, [billDetail]);

  const updateOrders = useCallback(() => {
    if (orderData && 'table' in orderData) {
      setOrders(prevOrders => {
        const existingOrderIndex = prevOrders.findIndex(
          order => order.item._id === orderData.table._id
        );
        if (existingOrderIndex !== -1) {
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex].order = orderData?.orders;
          return updatedOrders;
        } else {
          return [
            ...prevOrders,
            { item: orderData.table, order: orderData.orders }
          ];
        }
      });

      Toastify(
        t('employeeDashboard.newOrder', {
          tableName: orderData?.table.name,
          orderCount: orderData?.orders?.length
        }),
        200
      );
    }
  }, [orderData, t]);

  useSocketConnection({
    socket,
    onConnect: () => {
      joinBranchRoom();
    }
  });

  useEffect(() => {
    updateOrders();
  }, [updateOrders]);

  return (
    <div className="">
      <div className="px-[10px]">
        <HeaderDashboard />
      </div>
      <div className="my-20 px-[10px] md:mt-0">
        <div className="">
          {isBillDetailFetching ? (
            ''
          ) : (
            <div className="">
              {dishCount >= 0 && (
                <div className="">
                  <div className="my-6 flex items-center gap-2 text-xl font-bold capitalize text-primary md:hidden">
                    <h1 className="">{t('ChefPages.title')}</h1>
                    <p>({tablesData?.length})</p>
                  </div>
                  <div className="">
                    <h1 className="my-2 hidden text-xl font-bold text-primary md:block">
                      {t('ChefPages.chefDetail.total_table')}: (
                      {tablesData?.length})
                    </h1>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {isFetching ? (
          <LoadingLocal />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tablesData?.map((table: ITable, index: number) => (
              <ChefTable
                key={index}
                table={table}
                orders={orders}
                deleteData={deleteData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefDashboard;
