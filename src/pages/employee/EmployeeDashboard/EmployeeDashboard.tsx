/* eslint-disable */
import React, { useEffect } from 'react';
import TableItem from '~/pages/employee/EmployeeDashboard/components/TableDashboardItem';
import HeaderEmployees from '~/components/employee/HeaderEmployees';
import { useAppDispatch, useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { useGetTablesQuery } from '~/services/table/tableApi.service';
import { ITable } from '~/types/table';
import { setTable } from '~/services/table/tableSlice';
import { useTranslation } from 'react-i18next';
import { useSocketConnection } from '~/libs/socketio/useSocketConnection';
import { socket } from '~/libs/socketio/socket';
import { useJoinBranchRoom } from '~/libs/socketio/joinRoom-hooks';
import { useOrderUpdate } from '~/libs/socketio/useGetOrder';
import { Toastify } from '~/helper/Toastify';
import { EmployeeOrdersData, IEmployeeOrder } from '~/types/order';
import { useGetDeleteBill } from '~/libs/socketio/useGetDeleteBill';

const EmployeeDashboard: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const tables = useAppSelector((state: RootState) => state.table.data);
  const { t } = useTranslation();
  const branch_id = useAppSelector(
    (state: RootState) => state.branch.data?._id
  );

  const data = useOrderUpdate({ socket });
  const joinBranchRoom = useJoinBranchRoom({ socket, branchId: branch_id });
  const deleteData = useGetDeleteBill({ socket });

  const {
    data: tablesData,
    isFetching,
    error
  } = useGetTablesQuery({
    status: 'all',
    branch_id: branch_id
  });

  useSocketConnection({
    socket,
    onConnect: () => {
      joinBranchRoom();
      if (deleteData) {
        const { billDetail } = deleteData;
        if (billDetail && billDetail.name) {
          Toastify(
            `${t('message.deletedItemNotification')} ${billDetail.name}`,
            200
          );
        }
      }
      if ('table' in data) {
        Toastify(
          t('employeeDashboard.newOrder', {
            tableName: data.table.name,
            orderCount: data.orders.length
          }),
          200
        );
      }
    }
  });

  useEffect(() => {
    if (tablesData && !isFetching) {
      dispatch(setTable(tablesData.data));
    } else {
      dispatch(setTable([]));
    }
  }, [error, tablesData, isFetching]);

  return (
    <div className="mx-[10px]">
      {/* 440 */}
      <HeaderEmployees title={t('routes.home')} />
      {/* Table list */}
      <div className="h-screen w-full overflow-hidden">
        <div className=" grid w-full grid-cols-1 flex-wrap justify-around gap-6 overflow-visible  scroll-smooth py-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-2">
          {tables.length == 0 && !isFetching ? (
            <h4 className="my-2 w-full text-center text-sm font-semibold">
              {t('message.emptyFood')}
            </h4>
          ) : (
            <>
              {isFetching
                ? Array.from(new Array(16)).map((item, index) => (
                    <div
                      key={index}
                      className="skeleton h-32 w-full rounded-lg p-3  px-5 shadow-tableItem"
                    >
                      {item}
                    </div>
                  ))
                : tables.map((item: ITable, index: number) =>
                    data && 'table' in data && item._id === data.table._id ? (
                      <TableItem
                        key={index}
                        data={{
                          item,
                          order: (data as EmployeeOrdersData)
                            .orders as IEmployeeOrder[]
                        }}
                      />
                    ) : (
                      <TableItem
                        key={index}
                        data={{ item, order: null }}
                        deleteData={deleteData}
                      />
                    )
                  )}
            </>
          )}
        </div>
      </div>
      {/* Bill detail */}
      {/* <div className="fixed bottom-0 right-[-120%] top-0 h-[100vh] w-[467px] md:right-[-100%]">
        <BillDetail />
      </div> */}
    </div>
  );
};

export default EmployeeDashboard;
