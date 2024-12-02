import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import { rtkQueryLogger } from './middleware';
import storage from 'redux-persist/lib/storage';

import { authApi } from '~/services/auth/authApi.service';
import { employeeApi } from '~/services/employee/employeeApi.service';
import { branchApi } from '~/services/branch/branchApi.service';
import { tableApi } from '~/services/table/tableApi.service';
import { menuApi } from '~/services/menu/menu.service';
import { categoryMenuApi } from '~/services/categoryMenu/categoryApi.service';
import { menuDetailApi } from '~/services/menuDetail/menuDetailApi.service';
import { baseApi } from '~/services/BaseApi.service';
import { billApi } from '~/services/bill/billApi.service';
import { chefApi } from '~/services/chef/chefApi.services';

import authSlice from '~/services/auth/authSlice';
import employeeSlice from '~/services/employee/employeeSlice';
import historySlice from '~/services/history/historySlice';
import tableSlice from '~/services/table/tableSlice';
import menuDetailSlice from '~/services/menuDetail/menuDetailSlice';
import branchSlice from '~/services/branch/branchSlice';
import billSlice from '~/services/bill/billSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'history']
};

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [branchApi.reducerPath]: branchApi.reducer,
  [tableApi.reducerPath]: tableApi.reducer,
  [menuApi.reducerPath]: menuApi.reducer,
  [categoryMenuApi.reducerPath]: categoryMenuApi.reducer,
  [menuDetailApi.reducerPath]: menuDetailApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [billApi.reducerPath]: billApi.reducer,
  [chefApi.reducerPath]: chefApi.reducer,

  auth: authSlice,
  employee: employeeSlice,
  branch: branchSlice,
  bill: billSlice,
  table: tableSlice,
  menuDetail: menuDetailSlice,
  history: historySlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(
      authApi.middleware,
      employeeApi.middleware,
      branchApi.middleware,
      tableApi.middleware,
      menuApi.middleware,
      categoryMenuApi.middleware,
      menuDetailApi.middleware,
      baseApi.middleware,
      billApi.middleware,
      chefApi.middleware,
      rtkQueryLogger
    ),
  devTools: import.meta.env.MODE !== 'production'
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
