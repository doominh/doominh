import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Drawer,
  // Loading,
  Menu,
  Modal,
  Select,
  Textarea
} from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { AiOutlineClose } from 'react-icons/ai';
import { GrNotes } from 'react-icons/gr';
import { TbShoppingBagSearch } from 'react-icons/tb';
import { format } from 'date-fns';
import { formatCurrency } from '~/helper/formatCurrency';
import { Toastify } from '~/helper/Toastify';
import {
  useDeleteBillDetailMutation,
  useGetBillDetailQuery,
  useUpdateBillDetailCustomerMutation
} from '~/services/bill/billApi.service';
import {
  useCheckStatusTableQuery,
  useOpenTableMutation,
  useChangeTableMutation,
  useGetTablesQuery
} from '~/services/table/tableApi.service';
import { IEmployeeOrder, UpdateBillQuantity } from '~/types/order';
import { ITable, StatusEnum } from '~/types/table';
import { toast } from 'react-toastify';
import { LuMinus } from 'react-icons/lu';
import { GoPlus } from 'react-icons/go';
import { formatDistanceToNow } from 'date-fns';
import { IDeleteData } from '~/types/bill-details';

export default function TableDashboardItem({
  data,
  deleteData
}: {
  data: { item: ITable; order: IEmployeeOrder[] | null };
  deleteData?: IDeleteData;
}) {
  const { item, order } = data;
  const [orderData, setOrderData] = useState<IEmployeeOrder[] | null>(null);
  const [visible, setVisible] = useState<Boolean>(false);
  const { t } = useTranslation();
  const changeTableRef = useRef<HTMLDialogElement>(null);
  const [deleteBillDetail] = useDeleteBillDetailMutation();
  const [updateData, setUpdateData] = useState<Partial<IEmployeeOrder>>({});

  const [updateBillDetail, { isLoading: isUpdating }] =
    useUpdateBillDetailCustomerMutation();

  const {
    data: currentData,
    isFetching,
    refetch
  } = useGetBillDetailQuery({
    table_name: item.name,
    branch_id: item.branch_id
  });

  const [selectedTable, setSelectedTable] = useState<string>('');

  const { data: selectData } = useGetTablesQuery({
    status: '0',
    branch_id: item.branch_id
  });

  const [openTable, { isLoading }] = useOpenTableMutation();
  const { data: status, isFetching: isStatusFetching } =
    useCheckStatusTableQuery({
      branch_id: item.branch_id,
      table_id: item._id
    });

  const toggleVisible = useCallback(() => {
    setVisible(visible => !visible);
  }, []);

  const handleQrcode = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      changeTableRef.current?.showModal();
    },
    [changeTableRef]
  );

  const [changeTable, resultChangeTable] = useChangeTableMutation();

  const handleConfirmChangeTable = () => {
    if (!selectedTable || !item._id) {
      Toastify(t('employeeDashboard.not_full_fied'), 400);
      return;
    }

    if (selectedTable === item._id) {
      Toastify(t('employeeDashboard.duplicateId'), 400);
      return;
    }

    changeTable({ from: item._id, to: selectedTable })
      .unwrap()
      .then(res => {
        if (res) {
          Toastify(res?.message, res?.statusCode);
        }
      })
      .catch(error => {
        Toastify(error?.message, error?.statusCode);
      });
  };

  const handleOpenTable = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      openTable(item._id)
        .unwrap()
        .then(res => {
          if (res) {
            Toastify(res?.message, res?.statusCode);
          }
        })
        .catch(error => {
          Toastify(error?.message, error?.statusCode);
        });
    },
    [openTable]
  );

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(e.target.value);
  };

  const handleDelete = async (items: IEmployeeOrder) => {
    try {
      if (items.status !== StatusEnum.INACTIVE) {
        toast.error(t('BillPages.DeleteBillStatusError'));
        return;
      }

      if (!item._id || !item.name || !item.branch_id) {
        throw new Error(t('BillPages.MissingRequiredFields'));
      }

      await deleteBillDetail({
        id: items._id,
        branch_id: item.branch_id,
        table_name: item.name
      }).unwrap();
      toast.success(t('BillPages.DeleteBillSuccess', { foodName: items.name }));
      refetch();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          t('BillPages.DeleteBillError', { errorMessage: error.message })
        );
      } else {
        toast.error(
          t('BillPages.DeleteBillError', { errorMessage: 'Unknown error' })
        );
      }
    }
  };

  useEffect(() => {
    if (!isFetching && currentData && !order) {
      setOrderData(currentData.data as IEmployeeOrder[]);
    }
    if (order) {
      setOrderData(order);
    }
    return () => {
      setOrderData(null);
    };
  }, [currentData, order, isFetching]);

  useEffect(() => {
    if (deleteData) {
      refetch();
    }
  }, [deleteData, refetch]);

  useEffect(() => {
    if (order) {
      refetch();
    }
  }, [order, refetch]);

  useEffect(() => {
    if (!isFetching && currentData) {
      setOrderData(currentData.data as IEmployeeOrder[]);
    }
  }, [currentData, isFetching]);

  const refs = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    refs.current?.showModal();
  }, [refs]);

  const handleQuantityChange = (amount: number) => {
    setUpdateData(prevData => {
      const newQuantity = (prevData.quantity || 0) + amount;
      const newSubTotal = newQuantity * (prevData.price || 0);
      return {
        ...prevData,
        quantity: newQuantity,
        sub_total: newSubTotal
      };
    });
  };

  const handleUpdate = async () => {
    try {
      const { _id, quantity, note, status } = updateData;
      if (!_id || !item.branch_id || !item.name) {
        throw new Error(t('BillPages.MissingRequiredFields'));
      }

      if (!orderData) {
        throw new Error(t('BillPages.ItemNotFound'));
      }

      const oldItem = orderData.find(item => item._id === _id);
      if (!oldItem) {
        throw new Error(t('BillPages.ItemNotFound'));
      }

      if (status !== StatusEnum.INACTIVE) {
        toast.error(t('BillPages.CanUpdate'));
        return;
      }

      if (quantity === undefined) {
        throw new Error(t('BillPages.MissingRequiredFields'));
      }

      const payload: UpdateBillQuantity = {
        branch_id: item.branch_id,
        table_name: item.name,
        updates: [
          {
            _id,
            old_quantity: oldItem.quantity,
            new_quantity: quantity,
            note: note || ''
          }
        ]
      };

      const result = await updateBillDetail(payload).unwrap();
      if (result && result.data && result.data.length > 0) {
        const updatedItem = result.data[0];
        toast.success(
          t('BillPages.UpdateBillSuccess', { foodName: updatedItem.name })
        );
      } else {
        toast.error(t('BillPages.UpdateBillUnknownError'));
      }
      refetch();
      refs.current?.close();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          t('BillPages.UpdateBillError', { errorMessage: error.message })
        );
      } else {
        toast.error(
          t('BillPages.UpdateBillError', { errorMessage: 'Unknown error' })
        );
      }
    }
  };

  const handleCloseDrawer = useCallback(() => {
    setVisible(false);
  }, []);

  const getStatusText = (status: StatusEnum): JSX.Element | string => {
    switch (status) {
      case StatusEnum.ACTIVE:
        return (
          <p className="rounded-md bg-secondary px-2 py-1 text-white">
            {t('ChefPages.chefDetail.preparing')}...
          </p>
        );
      case StatusEnum.SERVED:
        return (
          <p className="rounded-md bg-success px-2 py-1 text-white">
            {t('ChefPages.chefDetail.served')}
          </p>
        );
      default:
        return '';
    }
  };

  return (
    <div
      onClick={toggleVisible}
      className="relative h-32 w-full flex-grow cursor-pointer rounded-lg border-2 border-solid border-gray-100 p-3 px-5 "
    >
      <div className="flex items-center justify-between">
        <div className="flex justify-center gap-5">
          <div
            className={`flex items-center justify-center rounded-lg px-2 py-1  ${
              !isStatusFetching &&
              status &&
              status?.data.status == StatusEnum.ACTIVE
                ? ' bg-primary'
                : 'bg-gray-100'
            }`}
          >
            <h1 className="text-center text-2xl font-bold text-base-100">
              {item.name}
            </h1>
          </div>
          {orderData && orderData?.length > 0 && (
            <span className="relative flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-primary"></span>
            </span>
          )}
        </div>
        <h3 className="text-xl font-medium text-primary">
          {!isStatusFetching &&
          status?.data?.status === StatusEnum.ACTIVE &&
          orderData &&
          !isFetching ? (
            t('shared.count_dish', { count: orderData.length })
          ) : (
            <Button
              size="sm"
              color="primary"
              loading={isLoading}
              disabled={isLoading}
              onClick={handleOpenTable}
              className="relative text-white"
            >
              {t('employeeDashboard.open_table')}
            </Button>
          )}
        </h3>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-normal text-gray-50 md:text-base">
            {item.createdAt
              ? format(new Date(item.createdAt), t('dateFormat'))
              : ''}
          </span>
          <span className="text-xl font-normal text-gray-50 md:text-base">
            {item.createdAt
              ? format(new Date(item.createdAt), t('timeFormat'))
              : ''}
          </span>
        </div>
        {!isStatusFetching &&
          status &&
          status?.data.status == StatusEnum.ACTIVE && (
            <Button
              size="sm"
              color="primary"
              variant="outline"
              onClick={e => handleQrcode(e)}
              className="relative  text-white"
            >
              {t('employeeDashboard.change_table')}
            </Button>
          )}
      </div>
      <>
        <Drawer
          open={visible as boolean}
          end
          className="z-20"
          side={
            <Menu
              onClick={toggleVisible}
              className="block h-dvh w-[80%] overflow-y-hidden bg-white p-4 text-base-content md:w-[350px]"
            >
              <div className="my-5">
                <div className="flex items-center justify-center">
                  <p className="justify-center text-[1.4rem] font-bold text-primary">
                    {t('shared.table_name', {
                      tableName: item.name
                    })}
                  </p>
                  <Button
                    size="sm"
                    shape="circle"
                    onClick={handleCloseDrawer}
                    className="absolute right-2 top-2"
                  >
                    <AiOutlineClose className="h-1/2 w-1/2 text-[#333333]" />
                  </Button>
                </div>
              </div>
              {orderData && orderData.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center ">
                  <TbShoppingBagSearch className=" text-[4rem]" />
                  <p className="font-bold text-primary">
                    {t('message.emptyFood')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-[10px]">
                    <p className="text-[1.1rem] font-bold">
                      {t('shared.dish_count', {
                        tableName: item.name,
                        dishesCount: orderData ? orderData.length : 0
                      })}
                    </p>
                  </div>

                  <Menu.Item className="my-5 block h-[65%] overflow-y-auto bg-white">
                    {orderData &&
                      orderData.map((item: IEmployeeOrder, index: number) => (
                        <div
                          key={index}
                          className="mb-[20px] block overflow-y-auto  bg-white p-3 shadow-md"
                        >
                          <div className=" flex  w-full cursor-pointer items-center gap-[10px] rounded-[10px]">
                            <div className="w-full">
                              <div className="flex items-center justify-between gap-[10px]">
                                <div className="flex gap-1 ">
                                  <h2 className=" line-clamp-1 text-[1rem] font-semibold capitalize">
                                    {item.name}
                                  </h2>
                                  <p className="text-[.9rem]  text-black">
                                    x{item.quantity}
                                  </p>
                                </div>
                                {item.status == StatusEnum.INACTIVE ? (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      color="primary"
                                      size="sm"
                                      className=" text-white"
                                      onClick={() => handleDelete(item)}
                                    >
                                      {t('shared.delete')}
                                    </Button>
                                    <Button
                                      color="accent"
                                      size="sm"
                                      className=" text-white"
                                      onClick={() => {
                                        handleShow();
                                        setUpdateData({ ...item });
                                      }}
                                    >
                                      {t('shared.update')}
                                    </Button>
                                    <Modal ref={refs}>
                                      <form method="dialog">
                                        <form method="dialog">
                                          <Button
                                            color="primary"
                                            className="absolute right-2 top-2 text-white"
                                          >
                                            x
                                          </Button>
                                        </form>
                                      </form>
                                      <Modal.Header className="pt-8 font-bold text-primary">
                                        {t('BillPages.food_name')}:{' '}
                                        {updateData.name}
                                      </Modal.Header>
                                      <Modal.Body>
                                        <div>
                                          <p className="mb-2 text-[1rem] font-bold">
                                            {t('orderPage.updateCart.notes')}
                                          </p>
                                          <Textarea
                                            className="w-full text-[.9rem]"
                                            placeholder={
                                              updateData.note !== ''
                                                ? updateData.note
                                                : t(
                                                    'orderPage.updateCart.example_placeholder'
                                                  )
                                            }
                                            value={updateData.note || ''}
                                            onChange={e =>
                                              setUpdateData({
                                                ...updateData,
                                                note: e.target.value
                                              })
                                            }
                                          />
                                        </div>
                                        <div className="my-4 flex items-center justify-center gap-4">
                                          <Button
                                            color="primary"
                                            className="text-white"
                                            onClick={() =>
                                              handleQuantityChange(-1)
                                            }
                                          >
                                            <LuMinus />
                                          </Button>
                                          <div>
                                            <p>
                                              {updateData.quantity &&
                                              updateData.quantity >= 0
                                                ? updateData.quantity
                                                : 1}
                                            </p>
                                          </div>

                                          <Button
                                            color="primary"
                                            className="text-white"
                                            onClick={() =>
                                              handleQuantityChange(1)
                                            }
                                          >
                                            <GoPlus />
                                          </Button>
                                        </div>
                                        <Button
                                          onClick={handleUpdate}
                                          color="success"
                                          className="mt-2 w-full text-white"
                                          disabled={isUpdating}
                                        >
                                          {t('BillPages.update')}
                                        </Button>
                                      </Modal.Body>
                                    </Modal>
                                  </div>
                                ) : (
                                  <p>{getStatusText(item.status)}</p>
                                )}
                              </div>
                              <div className="mt-[10px] flex items-center justify-between text-sm text-primary">
                                <div className="line-clamp-1 flex items-center gap-[4px]  text-[.9rem] text-black">
                                  <GrNotes />
                                  {item.note ? (
                                    <p>{item.note}</p>
                                  ) : (
                                    <p className="text-gray-300">
                                      {t('shared.note')}
                                    </p>
                                  )}
                                </div>
                                <p className="font-bold">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-light">
                                  ({' '}
                                  {formatDistanceToNow(
                                    new Date(item.updatedAt),
                                    {
                                      addSuffix: true
                                    }
                                  )}
                                  )
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </Menu.Item>
                  <div className="mt-[10px] flex items-center justify-between text-[1.1rem] font-bold">
                    <p>{t('shared.total')}</p>
                    <p>
                      {formatCurrency(
                        orderData
                          ? (orderData.reduce(
                              (total: number, item: IEmployeeOrder) => {
                                return total + item.price * item.quantity;
                              },
                              0
                            ) as number)
                          : 0
                      )}
                    </p>
                  </div>
                  <Button
                    color="primary"
                    className="mt-[20px] w-full text-white"
                  >
                    {t('shared.confirm')}
                  </Button>
                </>
              )}
            </Menu>
          }
        />
      </>

      <Modal
        backdrop
        className="min-h-[250px] max-w-[360px] "
        onClick={e => e.stopPropagation()}
        ref={changeTableRef}
      >
        <form method="dialog">
          <Button color="primary" className="absolute right-2 top-2">
            <AiOutlineClose className="text-white" />
          </Button>
        </form>
        <Modal.Body className="grid place-items-center gap-4 p-4">
          <h1 className="text-center text-2xl font-bold text-primary">
            {item.name}
          </h1>

          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">
                {t('employeeDashboard.select_table_please')}
              </span>
            </label>
            <Select
              value={selectedTable}
              onChange={handleTableChange}
              className="mt-2 w-full rounded-md border border-gray-300 p-2"
            >
              <option value={''} disabled>
                {t('employeeDashboard.select_table')}
              </option>
              {selectData &&
                selectData?.data.map(
                  (table: ITable) =>
                    status &&
                    table._id !== item._id && (
                      <option key={table._id} value={table._id}>
                        {table.name}
                      </option>
                    )
                )}
            </Select>
          </div>

          <div className="flex w-full justify-center gap-2">
            <form className="w-full" method="dialog">
              <Button
                size="md"
                fullWidth
                variant="outline"
                color="primary"
                className="text-white"
              >
                {t('shared.cancel')}
              </Button>
            </form>
            <form className="w-full" method="dialog">
              <Button
                size="md"
                color="primary"
                fullWidth
                loading={resultChangeTable.isLoading}
                disabled={!selectedTable || resultChangeTable.isLoading}
                className="text-white"
                onClick={handleConfirmChangeTable}
              >
                {t('shared.confirm')}
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
