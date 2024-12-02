/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import { Button, Modal } from 'react-daisyui';

import { useAppDispatch, useAppSelector } from '~/hooks/hooks';
import { RootState } from '~/redux/store';
import { StatusEnum } from '~/constants';
import { ICreateTable, ITable } from '~/types/table';
import { TableItem } from '~/pages/employee/EmployeeTableManager/components/TableManagerItem';
import { createTableSchema } from '~/libs/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import {
  useCreateTableMutation,
  useGetOverviewTableQuery,
  useGetTablesQuery
} from '../../../services/table/tableApi.service';
import { createTableItem, setTable } from '../../../services/table/tableSlice';
import { Toastify } from '~/helper/Toastify';
import HeaderEmployees from '~/components/employee/HeaderEmployees';
import { useTranslation } from 'react-i18next';

const EmployeeTableManager: React.FC = () => {
  const [status, setStatus] = useState('all');
  const dispatch = useAppDispatch();
  const tables = useAppSelector((state: RootState) => state.table.data);
  const branch = useAppSelector((state: RootState) => state.branch.data);

  const { data: overviewData, isFetching: isFetchingOverview } =
    useGetOverviewTableQuery();
  const { t } = useTranslation();

  const {
    data: tablesData,
    isFetching,
    error
  } = useGetTablesQuery({
    status: status,
    branch_id: branch._id
  });

  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const [createTable, createdResult] = useCreateTableMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ICreateTable>({
    resolver: zodResolver(createTableSchema)
  });

  const onSubmitCreate = async (data: ICreateTable) => {
    if (!data.name) {
      Toastify(t('message.empty_table_name'), 300);
      return;
    }
    createTable({
      name: data.name,
      branch_id: branch._id
    })
      .unwrap()
      .then(res => {
        reset();
        if (res) {
          Toastify(res?.message, res?.statusCode);
          dispatch(createTableItem(res.data));
        }
      })
      .catch(error => {
        Toastify(
          error?.data?.message || t('message.error'),
          error?.data?.statusCode || 400
        );
      });
    ref.current?.close();
  };

  useEffect(() => {
    if (tablesData && !isFetching) {
      dispatch(setTable(tablesData.data));
    } else {
      dispatch(setTable([]));
    }
  }, [status, isFetching, error]);

  return (
    <div className="mx-[10px]">
      <HeaderEmployees title={t('routes.tableManager')} />
      <div className="block items-center justify-between md:flex">
        <div className="mb-3 w-full  md:mt-[20px] md:w-[40%]">
          {!isFetchingOverview && overviewData ? (
            <div role="tablist" className="tabs">
              <button
                onClick={() => setStatus('all')}
                className={`tab ${status === 'all' ? ' tab-active rounded-[5px] bg-primary text-white' : ''} text-base font-bold `}
              >
                {t('employeeTableManager.all', {
                  count: overviewData.data.totalTables
                })}
              </button>
              <button
                onClick={() => setStatus(StatusEnum.ACTIVE.toString())}
                className={`tab ${status === StatusEnum.ACTIVE.toString() ? 'tab-active  rounded-[5px] bg-primary text-white' : ''} text-base font-bold`}
              >
                {t('employeeTableManager.active', {
                  count: overviewData.data.totalActiveTables
                })}
              </button>
              <button
                onClick={() => setStatus(StatusEnum.INACTIVE.toString())}
                className={`tab ${status === StatusEnum.INACTIVE.toString() ? 'tab-active  rounded-[5px] bg-primary text-white' : ''} text-base font-bold`}
              >
                {t('employeeTableManager.empty', {
                  count: overviewData.data.totalInactiveTables
                })}
              </button>
            </div>
          ) : (
            <div className="btn skeleton flex items-center shadow-tableItem "></div>
          )}
        </div>
        <Button
          className="flex cursor-pointer items-center rounded-lg bg-accent p-3 text-white"
          color="accent"
          startIcon={<IoMdAdd />}
          disabled={createdResult.isLoading}
          loading={createdResult.isLoading}
          onClick={handleShow}
        >
          {t('employeeTableManager.add_new_table')}
        </Button>
      </div>
      <div className="flex w-full items-center justify-between gap-2 py-3">
        <Modal backdrop className="min-h-[250px] max-w-[360px]  " ref={ref}>
          <form method="dialog">
            <Button color="primary" className="absolute right-2 top-2">
              <AiOutlineClose className="text-white" />
            </Button>
          </form>
          <Modal.Body className="p-4 text-center">
            <p className="text-base font-bold">{branch.name}</p>
            <p className="mb-3 font-bold text-primary">
              {' '}
              {t('employeeTableManager.availabelTable', {
                count: tables.length
              })}
            </p>
            <form onSubmit={handleSubmit(onSubmitCreate)}>
              <input
                type="text"
                placeholder={t('message.table_please_input')}
                {...register('name')}
                className={`input input-bordered w-full max-w-xs ${errors.name && 'border-red-500'}`}
              />
              <Button
                type="submit"
                fullWidth
                disabled={createdResult.isLoading}
                color="accent"
                loading={createdResult.isLoading}
                className="mt-3  rounded-lg  py-2 text-white"
              >
                {createdResult.isLoading ? '' : t('message.add_table')}
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      {tables.length == 0 && !isFetching ? (
        <h4 className="my-2 w-full text-center text-sm font-semibold">
          {t('message.emptyData')}
        </h4>
      ) : (
        <div className=" grid w-full grid-cols-1 gap-[10px] py-3 md:grid-cols-2 xl:grid-cols-3">
          {isFetching
            ? Array.from(new Array(12)).map((item, index) => (
                <div
                  key={index}
                  className="skeleton mb-2 h-32 w-full p-[10px] shadow-tableItem"
                >
                  {item}
                </div>
              ))
            : tables.map((item: ITable, index: number) => (
                <TableItem key={index} data={item} />
              ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTableManager;
