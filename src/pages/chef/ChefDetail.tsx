import { useParams } from 'react-router-dom';
import { MdEditNote } from 'react-icons/md';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { Button, Modal, Select } from 'react-daisyui';
import LoadingLocal from '~/components/Loading/LoadingLocal';
import { useSocketConnection } from '~/libs/socketio/useSocketConnection';
import { useJoinBranchRoom } from '~/libs/socketio/joinRoom-hooks';
import { Toastify } from '~/helper/Toastify';
import { socket } from '~/libs/socketio/socket';
import { useOrderUpdate } from '~/libs/socketio/useGetOrder';
import { useTranslation } from 'react-i18next';
import { StatusEnums, IChef } from '~/types/order';
import {
  useUpdateBillStatusMutation,
  useGetBillDetailQuery
} from '~/services/chef/chefApi.services';
import HeaderDashboard from '~/components/dashboard/HeaderDashboard';
import { formatDistanceToNow } from 'date-fns';
import { useGetDeleteBill } from '~/libs/socketio/useGetDeleteBill';

const ChefDetail: React.FC<{}> = () => {
  const [active, setActive] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const branch_id = useAppSelector(
    (state: RootState) => state.branch.data?._id
  );
  const { t } = useTranslation();

  const [hasNewOrder, setHasNewOrder] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: number;
  }>({});
  const [selectedItem, setSelectedItem] = useState<IChef | null>(null);

  const data = useOrderUpdate({ socket });
  const deleteData = useGetDeleteBill({ socket });
  const joinBranchRoom = useJoinBranchRoom({ socket, branchId: branch_id });

  const {
    data: billDetailResponse,
    isFetching,
    isError,
    refetch
  } = useGetBillDetailQuery({
    table_name: id || '',
    branch_id: branch_id
  });

  const [updateBillStatus] = useUpdateBillStatusMutation();

  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback((item: IChef) => {
    setSelectedItem(item);
    ref.current?.showModal();
  }, []);

  useEffect(() => {
    if (data && 'table' in data) {
      setHasNewOrder(true);
      if (data.orders && data.orders.length === 1) {
        Toastify(
          t('employeeDashboard.newOrdersChef', {
            newFoods: data.orders[0].name || null,
            quantityFoods: data.orders[0].quantity || null
          }),
          200
        );
      } else if (data.orders && data.orders.length > 1) {
        Toastify(
          t('employeeDashboard.newOrdersChef', {
            newFoods: data.orders.map(order => order.name) || null,
            quantityFoods: data.orders.map(order => order.quantity) || null
          }),
          200
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (hasNewOrder && !isFetching) {
      refetch();
      setHasNewOrder(false);
    }
  }, [hasNewOrder, isFetching, refetch]);

  useEffect(() => {
    refetch();
  }, []);

  useSocketConnection({
    socket,
    onConnect: () => {
      if (deleteData) {
        const { billDetail } = deleteData;
        if (billDetail && billDetail.name) {
          Toastify(
            `${t('message.deletedItemNotification')} ${billDetail.name}`,
            200
          );
        }
      }
      joinBranchRoom();
    }
  });

  useEffect(() => {
    if (deleteData) {
      refetch();
    }
  }, [deleteData, refetch]);

  if (isFetching) {
    return <LoadingLocal />;
  }

  const handleConfirmClick = async (item: IChef) => {
    const { _id, status: old_status } = item;
    const newStatus =
      selectedStatus[_id] !== undefined ? selectedStatus[_id] : old_status;
    try {
      await updateBillStatus({
        branch_id,
        table_name: id || '',
        updates: [
          {
            _id: _id,
            old_status: old_status,
            new_status: newStatus
          }
        ]
      }).unwrap();
      Toastify(t('ChefPages.chefDetail.statusUpdateSuccess'), 200);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Toastify(
        t('ChefPages.chefDetail.statusUpdateSuccess'),
        error.message || error
      );
    }
  };

  const handleStatusChange = (item_id: string, status: number) => {
    setSelectedStatus(prev => ({ ...prev, [item_id]: status }));
  };

  if (isError || !billDetailResponse) {
    return <div>{t('ChefPages.chefDetail.tableNotFound')}</div>;
  }

  const tableInfo = billDetailResponse?.data || null;
  return (
    <div className="">
      <div className="px-[10px]">
        <HeaderDashboard />
      </div>
      {isFetching ? (
        <LoadingLocal />
      ) : (
        <div className="mx-auto mt-20 flex  flex-col justify-between px-[10px] pt-6 md:mt-5">
          <div className="">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xl font-bold text-primary md:text-xl">
                <p>{t('ChefPages.chefDetail.table_name', { id })}</p>
                <p>
                  ({billDetailResponse?.data?.length} {t('shared.dish')})
                </p>
              </div>
            </div>
            {tableInfo?.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    setActive(index);
                  }}
                  key={item._id}
                  className={`${index === active ? 'bg-base-300' : 'bg-white'}  my-4 cursor-pointer rounded-md px-2`}
                >
                  <div
                    className={`${index === active ? 'w-full transition-all' : ''} mx-auto `}
                  ></div>
                  <div className="py-5">
                    <div className="mb-1 flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-1">
                        <h1 className="line-clamp-1 text-base capitalize md:text-lg">
                          {item.name}
                        </h1>
                        <p className="line-clamp-1 text-sm font-light">
                          ({' '}
                          {formatDistanceToNow(new Date(item.updatedAt), {
                            addSuffix: true
                          })}
                          )
                        </p>
                      </div>
                      <p className="font-bold">x{item.quantity}</p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between gap-7 text-sm font-semibold">
                        <div className="flex items-center gap-1 text-gray-300">
                          <p>
                            {item.note ? (
                              <div className="flex items-center">
                                <MdEditNote
                                  className="text-secondary"
                                  size={30}
                                  onClick={() => handleShow(item)}
                                />
                                <Modal ref={ref}>
                                  <Modal.Header className="font-bold text-black">
                                    {t('BillPages.food_name')}:{' '}
                                    {selectedItem?.name}
                                  </Modal.Header>
                                  <Modal.Body className="text-primary">
                                    {t('shared.note')}:{' '}
                                    {selectedItem?.note
                                      ? selectedItem?.note
                                      : t('ChefPages.chefDetail.noNote')}
                                  </Modal.Body>
                                  <Modal.Actions>
                                    <form method="dialog">
                                      <Button
                                        color="primary"
                                        className="text-white"
                                      >
                                        Close
                                      </Button>
                                    </form>
                                  </Modal.Actions>
                                </Modal>
                                <p className="hidden md:flex">
                                  {item.note
                                    ? item.note
                                    : t('ChefPages.chefDetail.noNote')}
                                </p>
                              </div>
                            ) : (
                              <MdEditNote
                                className="text-black"
                                size={30}
                                onClick={() => handleShow(item)}
                              />
                              // t('ChefPages.chefDetail.noNote')
                            )}
                          </p>
                        </div>
                        <div className="grid grid-cols-2">
                          <Select
                            className="mr-2"
                            value={selectedStatus[item._id] ?? item.status}
                            onChange={e =>
                              handleStatusChange(
                                item._id,
                                parseInt(e.target.value)
                              )
                            }
                          >
                            <option value={StatusEnums.ORDERED} disabled>
                              {t('ChefPages.chefDetail.ordered')}
                            </option>
                            <option value={StatusEnums.PREPARING}>
                              {t('ChefPages.chefDetail.preparing')}
                            </option>
                            <option value={StatusEnums.SERVED}>
                              {t('ChefPages.chefDetail.served')}
                            </option>
                          </Select>
                          <Button
                            onClick={() => handleConfirmClick(item)}
                            color="primary"
                            className="text-white"
                          >
                            {t('ChefPages.chefDetail.confirm')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mb-4 text-center">
            <Button className="w-full text-white sm:w-[200px]" color="primary">
              {t('ChefPages.chefDetail.complete')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDetail;
