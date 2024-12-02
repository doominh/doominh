import { createApi } from '@reduxjs/toolkit/query/react';
import { ICategoryMenu, CategoryMenuResponse } from '~/types/category';
import { baseQueryWithReauth } from '../auth/authApi.service';

export const categoryMenuApi = createApi({
  reducerPath: 'categoryMenuApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createCategoryMenu: builder.mutation<
      CategoryMenuResponse,
      Omit<ICategoryMenu, '_id'>
    >({
      query: newCategory => ({
        url: '/api/v1/category-item-menu',
        method: 'POST',
        body: newCategory
      })
    }),
    updateCategoryMenu: builder.mutation<
      void,
      { data: Omit<ICategoryMenu, '_id'>; id: string }
    >({
      query: ({ id, ...updatedCategory }) => ({
        url: `/api/v1/category-item-menu/${id}`,
        method: 'PATCH',
        body: updatedCategory
      })
    }),
    deleteCategoryMenu: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/category-item-menu/${id}`,
        method: 'DELETE'
      })
    }),
    getAllCategoryMenu: builder.query<CategoryMenuResponse, void>({
      query: () => ({
        url: '/api/v1/category-item-menu',
        method: 'GET'
      })
    })
  })
});

export const {
  useCreateCategoryMenuMutation,
  useDeleteCategoryMenuMutation,
  useUpdateCategoryMenuMutation,
  useGetAllCategoryMenuQuery
} = categoryMenuApi;
