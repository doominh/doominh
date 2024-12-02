import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IBranch,
  IBranchDetailResponse,
  IBranchesResponse,
  ICreateBranch
} from '~/types/branch';
import { baseQueryWithReauth } from '../auth/authApi.service';

export const branchApi = createApi({
  reducerPath: 'branchApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    updateBranch: builder.mutation<
      IBranchesResponse,
      { id: string; data: Partial<IBranch> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/branches/${id}`,
        method: 'PATCH',
        body: data
      })
    }),
    createBranch: builder.mutation<IBranchDetailResponse, ICreateBranch>({
      query: ({ data }) => ({
        url: '/api/v1/branches',
        method: 'POST',
        body: data
      })
    }),
    getBranchByName: builder.query<IBranch | undefined, string>({
      query: name => `/api/v1/branches/name/${name}`
    }),
    getBranchByAddress: builder.query<IBranch | undefined, string>({
      query: address => `/api/v1/branches/address/${address}`
    })
  })
});

export const {
  useUpdateBranchMutation,
  useCreateBranchMutation,
  useGetBranchByNameQuery,
  useGetBranchByAddressQuery
} = branchApi;
