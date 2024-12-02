import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/authApi.service';
import { MenuResponse, IMenu } from '~/types/menu';

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMenus: builder.query<MenuResponse, void>({
      query: () => '/api/v1/menu/all'
    }),
    getMenuDetailById: builder.query<MenuResponse, string>({
      query: id => `/api/v1/menu/detail/${id}`
    }),
    createMenu: builder.mutation<
      MenuResponse,
      Omit<IMenu, '_id' | 'createdAt' | 'updatedAt'>
    >({
      query: body => {
        return {
          url: '/api/v1/menu',
          method: 'POST',
          body
        };
      }
    }),
    updateMenu: builder.mutation<
      MenuResponse,
      {
        _id: string;
        data: Omit<IMenu, '_id' | 'createdAt' | 'updatedAt' | 'user_id'>;
      }
    >({
      query: body => ({
        url: `/api/v1/menu/${body._id}`,
        method: 'PATCH',
        body: body.data
      })
    }),
    deleteMenu: builder.mutation<IMenu, string>({
      query: _id => ({
        url: `/api/v1/menu/${_id}`,
        method: 'DELETE'
      })
    })
  })
});

export const {
  useCreateMenuMutation,
  useGetMenusQuery,
  useGetMenuDetailByIdQuery,
  useUpdateMenuMutation,
  useDeleteMenuMutation
} = menuApi;
