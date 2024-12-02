import { createApi } from '@reduxjs/toolkit/query/react';
import { CartDetails, MenuDetailResponse } from '~/types/menu';
import { baseQueryWithReauth } from '../auth/authApi.service';
import { IOrder, IOrderResponse } from '~/types/order';

export const billApi = createApi({
  reducerPath: 'billApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['table', 'bill'],
  endpoints: builder => ({
    createBill: builder.mutation<
      MenuDetailResponse,
      {
        branch_id: string;
        tableName: string;
        cartItems: CartDetails[];
      }
    >({
      query: ({ branch_id, tableName, cartItems }) => ({
        url: `/api/v1/bill-detail?branch_id=${branch_id}&table_name=${tableName}`,
        method: 'POST',
        body: cartItems
      }),
      invalidatesTags: ['bill']
    }),
    getBillDetail: builder.query<
      IOrderResponse,
      { table_name: string; branch_id: string }
    >({
      query: ({ table_name, branch_id }) =>
        `/api/v1/bill-detail/get-by-customers?branch_id=${branch_id}&table_name=${table_name}`,
      keepUnusedDataFor: 0,
      providesTags: ['table']
    }),
    getBillDetailById: builder.query<IOrderResponse, { id: string }>({
      query: ({ id }) => `/api/v1/bill-detail/${id}`,
      keepUnusedDataFor: 0,
      providesTags: ['bill']
    }),
    updateBillDetail: builder.mutation<
      IOrderResponse,
      {
        branch_id: string;
        table_name: string;
        updates: Partial<IOrder>[];
      }
    >({
      query: ({ branch_id, table_name, updates }) => ({
        url: `/api/v1/bill-detail?branch_id=${branch_id}&table_name=${table_name}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: ['bill']
    }),
    updateBillDetailCustomer: builder.mutation<
      IOrderResponse,
      {
        branch_id: string;
        table_name: string;
        updates: {
          _id: string;
          old_quantity: number;
          new_quantity: number;
          note: string;
        }[];
      }
    >({
      query: ({ branch_id, table_name, updates }) => ({
        url: `/api/v1/bill-detail/update-quantity-note?branch_id=${branch_id}&table_name=${table_name}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: ['bill']
    }),
    updateNote: builder.mutation<
      IOrderResponse,
      {
        branch_id: string;
        table_name: string;
        updates: Partial<IOrder>[];
      }
    >({
      query: ({ branch_id, table_name, updates }) => ({
        url: `/api/v1/bill-detail/update-quantity-note?branch_id=${branch_id}&table_name=${table_name}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: ['bill']
    }),
    deleteBillDetail: builder.mutation<
      void,
      { id: string; branch_id: string; table_name: string }
    >({
      query: ({ id, branch_id, table_name }) => ({
        url: `/api/v1/bill-detail/${id}?branch_id=${branch_id}&table_name=${table_name}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['bill']
    })
  })
});

export const {
  useCreateBillMutation,
  useGetBillDetailQuery,
  useGetBillDetailByIdQuery,
  useUpdateBillDetailMutation,
  useUpdateBillDetailCustomerMutation,
  useUpdateNoteMutation,
  useDeleteBillDetailMutation
} = billApi;
