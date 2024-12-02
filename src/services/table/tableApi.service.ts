/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ICheckStatusTable,
  ICreateTable,
  IPatchTable,
  IResponseOpenTable,
  ITableOverviewResponse
} from '~/types/table';
import { baseQueryWithReauth } from '../auth/authApi.service';

export const tableApi = createApi({
  reducerPath: 'tableApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 5,
  tagTypes: ['table'],
  endpoints: builder => ({
    getTables: builder.query<any, { status: string | null; branch_id: string }>(
      {
        query: ({ status, branch_id }) => {
          let url = `/api/v1/table/all?branch_id=${branch_id}`;
          if (status && status !== 'all') {
            url += `&status=${status}`;
          }

          return { url };
        },
        providesTags: ['table']
      }
    ),
    createTable: builder.mutation<any, Partial<ICreateTable>>({
      query: body => ({
        url: '/api/v1/table',
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body
      })
    }),
    getDetailTable: builder.query<any, string>({
      query: id => ({
        url: `/api/v1/table/${id}`
      })
    }),
    updateTable: builder.mutation<
      any,
      { id: string; body: Partial<IPatchTable> }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/table/${id}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json'
        },
        body
      })
    }),
    deleteTable: builder.mutation<any, string>({
      query: id => ({
        url: `/api/v1/table/${id}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json'
        }
      })
    }),
    checkStatusTable: builder.query<
      ICheckStatusTable,
      { branch_id: string; table_id: string }
    >({
      query: ({ branch_id, table_id }) => ({
        url: `/api/v1/table/check-status-table?branch_id=${branch_id}&table_id=${table_id}`
      }),
      providesTags: ['table']
    }),
    openTable: builder.mutation<IResponseOpenTable, string>({
      query: table_id => ({
        url: `/api/v1/table/status/${table_id}`,
        method: 'PATCH',
        headers: {
          Accept: 'application/json'
        },
        body: { status: 1 }
      }),
      invalidatesTags: ['table']
    }),
    changeTable: builder.mutation<IPatchTable, { from: string; to: string }>({
      query: ({ from, to }) => ({
        url: `/api/v1/table/change`,
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: { from, to }
      }),
      invalidatesTags: ['table']
    }),
    getOverviewTable: builder.query<ITableOverviewResponse, void>({
      query: () => ({
        url: `/api/v1/table/overview`
      })
    })
  })
});

export const {
  useGetTablesQuery,
  useLazyGetTablesQuery,
  useLazyGetDetailTableQuery,
  useCreateTableMutation,
  useDeleteTableMutation,
  useCheckStatusTableQuery,
  useOpenTableMutation,
  useChangeTableMutation,
  useGetOverviewTableQuery
} = tableApi;
