// chefApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/authApi.service';
import { IChef, IChefResponse } from '~/types/order';

export const chefApi = createApi({
  reducerPath: 'chefApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['bill'],
  endpoints: builder => ({
    getBillDetail: builder.query<
      IChefResponse,
      { table_name: string; branch_id: string }
    >({
      query: ({ table_name, branch_id }) =>
        `/api/v1/bill-detail/get-by-customers?branch_id=${branch_id}&table_name=${table_name}`,
      keepUnusedDataFor: 0
    }),
    updateBillStatus: builder.mutation<
      IChef,
      {
        branch_id: string;
        table_name: string;
        updates: { _id: string; old_status: number; new_status: number }[];
      }
    >({
      query: ({ branch_id, table_name, updates }) => ({
        url: `/api/v1/bill-detail/update-status/?branch_id=${branch_id}&table_name=${table_name}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: ['bill']
    })
  })
});

export const { useGetBillDetailQuery, useUpdateBillStatusMutation } = chefApi;
