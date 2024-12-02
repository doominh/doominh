import { createSlice } from '@reduxjs/toolkit';
import { MenuDetailResponse } from '~/types/menu';

const initialState: MenuDetailResponse = {
  statusCode: 0,
  message: '',
  data: []
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setMenuDetailResponse: (state, action) => {
      state.statusCode = action.payload.statusCode;
      state.message = action.payload.message;
      state.data = action.payload.data;
    }
  }
});

export const { setMenuDetailResponse } = billSlice.actions;
export default billSlice.reducer;
