import QRCode from 'qrcode';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { ITable } from '~/types/table';
import { Button, Modal } from 'react-daisyui';
import { AiOutlineClose } from 'react-icons/ai';
import { FiAlertTriangle } from 'react-icons/fi';
import { useDeleteTableMutation } from '../../../../services/table/tableApi.service';
import { deleteTableItem } from '../../../../services/table/tableSlice';
import { useAppDispatch } from '~/hooks/hooks';
import { useTranslation } from 'react-i18next';
import { Toastify } from '~/helper/Toastify';
import { format } from 'date-fns';

export const TableItem = ({ data }: { data: ITable }) => {
  const [selectedItem, setSelectedItem] = useState<ITable | null>(null);
  const [currentQrcode, setCurrentQrcode] = useState<string>('');
  const [deleteTable, deleteResult] = useDeleteTableMutation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLDialogElement>(null);
  const qrRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selectedItem) {
      ref.current?.showModal();
      QRCode.toDataURL(selectedItem.qr_code).then(setCurrentQrcode);
    }
  }, [selectedItem]);

  const handleQrcode = useCallback(() => {
    ref.current?.close();
    qrRef.current?.showModal();
  }, [qrRef]);

  const handleShow = useCallback(
    (data: ITable) => {
      setSelectedItem(data);
      ref.current?.showModal();
      if (qrRef.current?.open) {
        qrRef.current?.close();
      }
    },
    [ref]
  );

  const handleConfirmDelete = useCallback(() => {
    setSelectedItem(data);
    deleteRef.current?.showModal();
    if (ref.current?.open) {
      ref.current?.close();
    }
  }, [deleteRef, data]);

  const handleDeleteTable = async (table_id: string) => {
    deleteTable(table_id)
      .unwrap()
      .then(res => {
        deleteRef.current?.close();
        setSelectedItem(null);
        dispatch(deleteTableItem(table_id));

        if (res?.statusCode === 200) {
          Toastify(res?.message, res?.statusCode);
        }
      })
      .catch(error => {
        deleteRef.current?.close();
        setSelectedItem(null);
        Toastify(error.message, error.statusCode);
      });
  };

  const handleEdit = () => {
    console.log('Chỉnh sửa');
  };

  return (
    <>
      <div className="">
        {/* table  */}
        <div className="mb-1  w-full items-center rounded-xl bg-white p-[10px] shadow-tableItem">
          <div className=" items-center  overflow-hidden rounded-lg ">
            <div className="flex items-center justify-between gap-[10px]  p-4">
              <div className="flex w-[53px] items-center justify-center rounded-lg bg-primary p-4">
                <p className="font-bold text-white">{data.name} </p>
              </div>
              {data && Object.keys(data).length > 0 && (
                <>
                  <div className="text-base font-medium">
                    {data.updatedAt && (
                      <p>
                        {t('shared.createdAt', {
                          time: data.createdAt
                            ? format(new Date(data.createdAt), t('dateFormat'))
                            : ''
                        })}
                      </p>
                    )}
                    {data.updatedAt && (
                      <p>
                        {t('shared.updatedAt', {
                          time: data.updatedAt
                            ? format(new Date(data.updatedAt), t('dateFormat'))
                            : ''
                        })}
                      </p>
                    )}
                  </div>
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => handleShow(data)}
                  >
                    <FaRegEdit />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className=""></div>
      </div>

      {selectedItem && (
        <>
          <Modal
            backdrop
            className="w-11/12 max-w-[16rem] bg-[#fef9f5] p-8"
            ref={ref}
          >
            <Modal.Body className="flex flex-col gap-2 rounded-lg bg-base-100 text-center">
              <Button
                size="sm"
                className="text-white"
                color="accent"
                fullWidth
                onClick={handleQrcode}
              >
                {t('shared.detail')}
              </Button>
              <Button
                size="sm"
                className="text-white"
                color="accent"
                fullWidth
                onClick={handleEdit}
              >
                {t('shared.edit')}
              </Button>
              <Button
                size="sm"
                color="primary"
                fullWidth
                onClick={handleConfirmDelete}
                className="text-white"
              >
                {t('shared.delete')}
              </Button>
              <form method="dialog">
                <Button
                  size="sm"
                  color="primary"
                  fullWidth
                  className="text-white"
                >
                  {t('shared.cancel')}
                </Button>
              </form>
            </Modal.Body>
          </Modal>

          <Modal backdrop className="p-4" ref={qrRef}>
            <form method="dialog">
              <Button color="primary" className="absolute right-2 top-2">
                <AiOutlineClose className="text-white" />
              </Button>
            </form>
            <Modal.Body className="flex flex-col items-center py-8">
              <div className="flex h-[80%] w-[80%] rounded-lg border border-black">
                <img
                  className="w-full rounded-lg"
                  src={currentQrcode}
                  alt="qrCode"
                />
              </div>
              <div className="my-[10px] text-xl font-bold text-primary">
                {t('shared.currentTable', { tableName: selectedItem.name })}
              </div>
              <div className="text-base font-semibold">
                {data.updatedAt && (
                  <p>
                    {t('shared.createdAt', {
                      time: data.createdAt
                        ? format(new Date(data.createdAt), t('dateFormat'))
                        : ''
                    })}
                  </p>
                )}
                {data.updatedAt && (
                  <p>
                    {t('shared.updatedAt', {
                      time: data.updatedAt
                        ? format(new Date(data.updatedAt), t('dateFormat'))
                        : ''
                    })}
                  </p>
                )}
              </div>
            </Modal.Body>
          </Modal>

          <Modal
            backdrop
            className="min-h-[250px] max-w-[360px] p-4 "
            ref={deleteRef}
          >
            <form method="dialog">
              <Button color="primary" className="absolute right-2 top-2">
                <AiOutlineClose className="text-white" />
              </Button>
            </form>
            <Modal.Body className="grid place-items-center gap-4 p-4">
              <FiAlertTriangle className="text-red-600" size={70} />
              <span className="text-start text-base font-semibold">
                <span className="text-red-600">*</span>
                {t('message.table_confirm_delete')} {selectedItem.name}
              </span>

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
                    fullWidth
                    className="flex cursor-pointer items-center  text-white"
                    loading={deleteResult.isLoading}
                    color="primary"
                    disabled={deleteResult.isLoading}
                    onClick={() => handleDeleteTable(selectedItem?._id)}
                  >
                    {t('shared.confirm')}
                  </Button>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};
