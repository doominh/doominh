import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal, Table, Textarea } from 'react-daisyui';
import { useLocation } from 'react-router-dom';
import LoadingLocal from '~/components/Loading/LoadingLocal';
import { formatCurrency } from '~/helper/formatCurrency';
import {
  useUpdateBillDetailCustomerMutation,
  useDeleteBillDetailMutation,
  useUpdateNoteMutation
} from '~/services/bill/billApi.service';
import { useGetBillDetailQuery } from '~/services/chef/chefApi.services';
import { Link } from 'react-router-dom';
import { useSocketConnection } from '~/libs/socketio/useSocketConnection';
import { socket } from '~/libs/socketio/socket';
import { useJoinTable } from '~/libs/socketio/joinRoom-hooks';
import { useOrderUpdate } from '~/libs/socketio/useGetOrder';
import {
  IChef,
  StatusEnums,
  UpdateBillPayload,
  UpdateBillQuantity
} from '~/types/order';
import { useTranslation } from 'react-i18next';
import { LuMinus } from 'react-icons/lu';
import { GoPlus } from 'react-icons/go';
import { MdOutlineEditNote } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { useGetDeleteBill } from '~/libs/socketio/useGetDeleteBill';
import { formatDistanceToNow } from 'date-fns';
import { Toastify } from '~/helper/Toastify';

const BillCustomer: React.FC<{}> = () => {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [tableName, setTableName] = useState<string | null>(null);
  const [paramsReady, setParamsReady] = useState<boolean>(false);
  const [queryStarted, setQueryStarted] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<IChef[]>([]);
  const location = useLocation();
  const joinTable = useJoinTable({ socket, tableName: tableName! });
  const dataOrder = useOrderUpdate({ socket });
  const { t } = useTranslation();
  const [billDetailDataStarted, setBillDetailDataStarted] =
    useState<boolean>(false);
  const deleteData = useGetDeleteBill({ socket });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const branch_id = urlParams.get('branch_id');
    const table_name = urlParams.get('table_name');
    if (branch_id && table_name) {
      setBranchId(branch_id);
      setTableName(table_name);
      setParamsReady(true);
    } else {
      toast.error('Thiếu branch_id hoặc table_name trong URL');
    }
  }, [location]);

  const {
    data: billDetailData,
    isLoading,
    isError,
    refetch
  } = useGetBillDetailQuery(
    {
      table_name: tableName ?? '',
      branch_id: branchId ?? ''
    },
    { skip: !paramsReady }
  );

  useEffect(() => {
    if (paramsReady && !queryStarted) {
      refetch();
      setQueryStarted(true);
    }
  }, [paramsReady, queryStarted, refetch]);

  useEffect(() => {
    if (billDetailData?.data) {
      setOrderData(billDetailData?.data);
    }
  }, [billDetailData]);

  useEffect(() => {
    if (
      billDetailDataStarted &&
      Array.isArray(dataOrder) &&
      dataOrder.length > 0
    ) {
      setOrderData(dataOrder as IChef[]);
      refetch();
    }
  }, [billDetailDataStarted, dataOrder, refetch]);

  useEffect(() => {
    if (paramsReady && !queryStarted) {
      refetch();
      setQueryStarted(true);
      setBillDetailDataStarted(true);
    }
  }, [paramsReady, queryStarted, refetch]);

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
      joinTable();
    }
  });

  const totalAmount =
    orderData.reduce((total: number, item: IChef) => {
      return total + item.sub_total;
    }, 0) || 0;

  const ref = useRef<HTMLDialogElement>(null);
  const noteRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (deleteData) {
      refetch();
    }
  }, [deleteData, refetch]);

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const handleNoteShow = useCallback(() => {
    noteRef.current?.showModal();
  }, [noteRef]);

  const [updateData, setUpdateData] = useState<Partial<IChef>>({});
  const [noteData, setNoteData] = useState<Partial<IChef>>({});
  const [updateBillDetail, { isLoading: isUpdating }] =
    useUpdateBillDetailCustomerMutation();
  const [deleteBillDetail] = useDeleteBillDetailMutation();
  const [updateNote, { isLoading: isUpdatingNote }] = useUpdateNoteMutation();

  const handleUpdate = async () => {
    try {
      const { _id, quantity, note } = updateData;
      if (!_id || !branchId || !tableName || quantity == null) {
        throw new Error(t('BillPages.MissingRequiredFields'));
      }
      const oldItem = orderData.find(item => item._id === _id);
      if (!oldItem) {
        throw new Error(t('BillPages.ItemNotFound'));
      }
      const payload: UpdateBillQuantity = {
        branch_id: branchId,
        table_name: tableName,
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
      console.log(result);
      if (result && result.data && result.data.length > 0) {
        const updatedItem = result.data[0];
        toast.success(
          t('BillPages.UpdateBillSuccess', { foodName: updatedItem.name })
        );
      } else {
        toast.error(t('BillPages.UpdateBillUnknownError'));
      }
      refetch();
      ref.current?.close();
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

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteData(prevData => ({
      ...prevData,
      note: e.target.value
    }));
  };

  const handleNoteSave = async () => {
    try {
      const { _id, note } = noteData;
      if (!_id || !branchId || !tableName || note == null) {
        throw new Error(t('BillPages.MissingRequiredFields'));
      }

      const payload: UpdateBillPayload = {
        branch_id: branchId,
        table_name: tableName,
        updates: [
          {
            _id,
            note
          }
        ]
      };

      const result = await updateNote(payload).unwrap();
      if (result && result.data && result.data.length > 0) {
        const updatedItem = result.data[0];
        noteRef.current?.close();
        toast.success(
          t('BillPages.UpdateBillSuccess', { foodName: updatedItem.name })
        );
      } else {
        toast.error(t('BillPages.UpdateBillUnknownError'));
      }
      refetch();
      noteRef.current?.close();
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

  const handleDelete = async (item: IChef) => {
    try {
      if (item.status !== StatusEnums.ORDERED) {
        toast.error(t('BillPages.DeleteBillStatusError'));
        return;
      }

      if (!item._id || !tableName || !branchId) {
        throw new Error(t('BillPages.MissingRequiredFields'));
      }

      await deleteBillDetail({
        id: item._id,
        branch_id: branchId,
        table_name: tableName
      }).unwrap();
      toast.success(t('BillPages.DeleteBillSuccess', { foodName: item.name }));
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

  const getStatusText = (status: StatusEnums): JSX.Element | string => {
    switch (status) {
      case StatusEnums.ORDERED:
        return (
          <p className="text-primary">{t('ChefPages.chefDetail.ordered')}</p>
        );
      case StatusEnums.PREPARING:
        return (
          <p className="text-secondary">
            {t('ChefPages.chefDetail.preparing')}...
          </p>
        );
      case StatusEnums.SERVED:
        return (
          <p className="text-success">{t('ChefPages.chefDetail.served')}</p>
        );
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto">
      <ToastContainer />
      <div className="h-full w-full">
        <img
          src="https://cdn.dribbble.com/userupload/7143226/file/original-0925d800240f43680473c0753133bf0c.png?resize=752x"
          alt=""
          className="h-[150px] w-full rounded-b-[10px] object-cover shadow-md"
        />
      </div>
      {/* item  */}
      <div className="mt-[10px] px-[10px]">
        <h1 className="text-[1.1rem] font-bold text-primary">
          {t('BillPages.table_bill')} {tableName}
        </h1>
        {isLoading ? (
          <p>
            <LoadingLocal />
          </p>
        ) : isError ? (
          <div className="mt-[10px] text-center">
            <p>
              {t('BillPages.fetch_error')} {isError}
            </p>
          </div>
        ) : (
          <div className="mt-[10px] overflow-auto overflow-x-auto pb-[100px] scrollbar-hide md:pb-0">
            {Array.isArray(orderData) && orderData?.length > 0 && (
              <ul>
                <Table zebra>
                  <Table.Head className="bg-primary text-center text-[.9rem] capitalize text-white  md:text-[1.1rem]">
                    <span>SL</span>
                    <span className="px-3">{t('BillPages.food_name')}</span>
                    <span className="px-2">{t('BillPages.info')}</span>
                    <span className="px-2">{t('shared.time')}</span>
                    <span>{t('BillPages.total_amount')}</span>
                    <span>{t('BillPages.status')}</span>
                    <span>{t('shared.note')}</span>
                  </Table.Head>
                  <Table.Body className="zebra text-center text-[.9rem] md:text-[1.1rem]">
                    {orderData?.map((item: IChef, index) => (
                      <Table.Row key={index}>
                        <span>x{item.quantity}</span>
                        <span className="line-clamp-1 capitalize text-primary">
                          {item.name}
                        </span>
                        <span className="">{getStatusText(item.status)}</span>
                        <span>
                          <p className="text-sm font-light">
                            ({' '}
                            {formatDistanceToNow(new Date(item.updatedAt), {
                              addSuffix: true
                            })}
                            )
                          </p>
                        </span>

                        <span>{formatCurrency(item.sub_total)}</span>
                        <span className="flex items-center justify-center gap-[10px]">
                          <Button
                            onClick={() => {
                              handleShow();
                              setUpdateData({ ...item });
                            }}
                            color="success"
                            className="text-white"
                            disabled={item.status != StatusEnums.ORDERED}
                          >
                            {t('BillPages.update')}
                          </Button>
                          <div className="font-sans">
                            <Modal ref={ref}>
                              <form method="dialog">
                                <Button
                                  color="primary"
                                  className="absolute right-2 top-2 text-white"
                                >
                                  x
                                </Button>
                              </form>
                              <Modal.Header className="pt-8 font-bold capitalize text-primary">
                                {t('BillPages.food_name')}: {updateData.name}
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
                                    onClick={() => handleQuantityChange(-1)}
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
                                    onClick={() => handleQuantityChange(1)}
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
                          <Button
                            color="primary"
                            className="text-white"
                            onClick={() => handleDelete(item)}
                            disabled={item.status !== StatusEnums.ORDERED}
                          >
                            {t('BillPages.delete')}
                          </Button>
                        </span>
                        <Button
                          className="flex items-center justify-center border-none bg-transparent"
                          onClick={() => {
                            handleNoteShow();
                            setNoteData({ ...item });
                          }}
                          disabled={item.status !== StatusEnums.ORDERED}
                        >
                          <MdOutlineEditNote
                            className={`cursor-pointer text-[2rem]`}
                          />
                        </Button>
                        <div className="font-sans">
                          <Modal ref={noteRef}>
                            <form method="dialog">
                              <Button
                                color="primary"
                                className="absolute right-2 top-2 text-white"
                              >
                                x
                              </Button>
                            </form>
                            <Modal.Header className="pt-8 font-bold capitalize text-primary">
                              {' '}
                              {t('BillPages.food_name')}: {noteData.name}
                            </Modal.Header>
                            <Modal.Body>
                              <p className="mb-3 text-base font-bold">
                                {' '}
                                {t('BillPages.edit_note')}
                              </p>
                              <Textarea
                                value={noteData.note || ''}
                                placeholder={t(
                                  'orderPage.updateCart.example_placeholder'
                                )}
                                onChange={handleNoteChange}
                                className="w-full rounded-md p-2"
                                rows={4}
                              />
                              <Button
                                onClick={handleNoteSave}
                                color="success"
                                className="mt-2 hidden w-full text-white"
                                disabled={isUpdatingNote}
                              >
                                {t('BillPages.update')}
                              </Button>
                            </Modal.Body>
                          </Modal>
                        </div>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 block w-full justify-center bg-white  p-[10px] md:static md:mt-0 md:block md:w-[200px]">
        <div className="mb-[10px] flex items-center justify-between">
          <p className="font-bold">{t('BillPages.total_amount')}</p>
          <p>{formatCurrency(totalAmount)}</p>
        </div>
        {branchId && tableName && (
          <Link to={`/customer?branch_id=${branchId}&table_name=${tableName}`}>
            <Button color="primary" className="w-full text-white">
              {t('BillPages.add_new_item')}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BillCustomer;
