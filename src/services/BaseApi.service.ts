import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBranchDetailResponse, IBranchesResponse } from '~/types/branch';
import { MenuDetailResponse } from '~/types/menu';

export const baseApi = createApi({
  reducerPath: 'base',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  keepUnusedDataFor: 60,
  endpoints: builder => ({
    getBranches: builder.query<IBranchesResponse, void>({
      query: () => '/api/v1/branches'
    }),
    getBranchById: builder.query<IBranchDetailResponse, string>({
      query: id => `/api/v1/branches/${id}`
    }),
    getAllMenuDetailByIdMenu: builder.query<MenuDetailResponse, string>({
      query: (menuId: string) => ({
        url: `/api/v1/menu-detail/get-by-menu-id/${menuId}`,
        method: 'GET'
      })
    })
  })
});

export const {
  useGetBranchByIdQuery,
  useGetBranchesQuery,
  useGetAllMenuDetailByIdMenuQuery
} = baseApi;
