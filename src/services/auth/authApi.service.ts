/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '~/redux/store';
import { IRegisterRequest } from '~/types/auth';
import { assignNewToken, logout } from './authSlice';

const refreshTokenFetchQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.loggedIn && state.auth?.currentUser?.refreshToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.loggedIn && state.auth?.currentUser?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { navigate } = window as any;
  const refreshToken = (api.getState() as RootState).auth.currentUser
    ?.refreshToken;
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    api.dispatch(logout());
    navigate('/auth/login');
  }

  if (result.error && result.error.status === 401) {
    const refreshResult = await refreshTokenFetchQuery(
      {
        url: '/api/v1/auth/refresh-token',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${refreshToken}`
        }
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.log('refresh token success ' + refreshResult.data);
      api.dispatch(assignNewToken(refreshResult?.data));
      result = await baseQuery(args, api, extraOptions);
    } else if (refreshResult.error) {
      api.dispatch(logout());
      navigate('/auth/login');
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 5,
  tagTypes: ['User'],
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<void, IRegisterRequest>({
      query: newUser => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: newUser
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST'
      })
    }),
    getTokenFromRefreshToken: builder.mutation({
      query: () => ({
        url: '/api/auth/refresh',
        method: 'POST'
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetTokenFromRefreshTokenMutation
} = authApi;
