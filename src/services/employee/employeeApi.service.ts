/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/authApi.service';

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 5,
  tagTypes: ['employee'],
  endpoints: builder => ({
    getUsers: builder.query<any, void>({
      query: () => ({
        url: `/api/v1/users`
      })
    }),
    getUserById: builder.query<any, string>({
      query: id => ({
        url: `/api/v1/users/${id}`
      })
    }),
    deleteUser: builder.mutation<void, string>({
      query: id => ({
        url: `/api/v1/users/${id}`,
        method: 'DELETE'
      })
    }),
    updateUser: builder.mutation<void, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/users/${id}`,
        method: 'PATCH',
        body: data
      })
    }),
    postUser: builder.mutation<void, any>({
      query: userData => ({
        url: `/api/v1/users`,
        method: 'POST',
        body: userData
      })
    }),
    getPendingUsers: builder.query<any, void>({
      query: () => ({
        url: `/api/v1/users/pending-list`
      })
    }),
    approveUser: builder.mutation<void, { id: string; status: number }>({
      query: ({ id, status }) => ({
        url: `/api/v1/users/update-status/${id}`,
        method: 'PATCH',
        body: { status }
      })
    })
  })
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  usePostUserMutation,
  useGetPendingUsersQuery,
  useApproveUserMutation
} = employeeApi;
