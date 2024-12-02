import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { authApi } from './authApi.service';
import { IAuth, IUser } from '~/types/auth';

const initialState: IAuth = {
  loggedIn: false,
  errorMessage: null,
  currentUser: {} as IUser
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
    clearLoginErrorMessage: state => ({
      ...state,
      errorMessage: null
    }),
    assignNewToken: (state, action) => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        token: action.payload
      }
    }),
    setAuthCurrentUser: (state, action) => ({
      ...state,
      currentUser: action.payload
    }),
    setBrandCurrentUser: (state, action) => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        branchId: action.payload
      }
    })
  },
  extraReducers: builder => {
    // Xử lý logic khi endpoint login account & login Google được fulfilled
    builder.addMatcher(
      isAnyOf(authApi.endpoints.login.matchFulfilled),
      (state, action) => {
        // Lưu thông tin user vào state khi login
        const response = action.payload;
        if (response?.statusCode === 200) {
          state.loggedIn = true;
          state.errorMessage = null;
          if (state.currentUser) {
            state.currentUser = response?.data.userData;
          }
        } else {
          state.loggedIn = false;
          state.errorMessage = response?.data?.status;
          state.currentUser = {} as IUser;
        }
      }
    );
  }
});

const { reducer, actions } = authSlice;
export const {
  logout,
  clearLoginErrorMessage,
  assignNewToken,
  setAuthCurrentUser,
  setBrandCurrentUser
} = actions;
export default reducer;
