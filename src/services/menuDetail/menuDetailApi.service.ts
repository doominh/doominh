import { MenuDetail, MenuDetailResponse } from '~/types/menu';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/authApi.service';

export const menuDetailApi = createApi({
  reducerPath: 'menuDetailApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 10,
  endpoints: builder => ({
    createMenuDetail: builder.mutation<
      MenuDetailResponse,
      Omit<MenuDetail, '_id'>
    >({
      query: body => {
        return {
          url: '/api/v1/menu-detail',
          method: 'POST',
          body
        };
      }
    }),
    updateMenuDetail: builder.mutation<
      MenuDetailResponse,
      { _id: string; data: Omit<MenuDetail, '_id'> }
    >({
      query: body => ({
        url: `/api/v1/menu-detail/${body._id}`,
        method: 'PATCH',
        body: body.data
      })
    }),
    deleteMenuDetail: builder.mutation<MenuDetailResponse, string>({
      query: _id => ({
        url: `/api/v1/menu-detail/${_id}`,
        method: 'DELETE'
      })
    }),
    getMenuDetailById: builder.query<MenuDetailResponse, string>({
      query: id => `/api/v1/menu-detail/${id}`
    })
  })
});

export const {
  useCreateMenuDetailMutation,
  useUpdateMenuDetailMutation,
  useDeleteMenuDetailMutation,
  useGetMenuDetailByIdQuery
} = menuDetailApi;
