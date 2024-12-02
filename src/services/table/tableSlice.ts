import { createSlice } from '@reduxjs/toolkit';
import { ITable } from '../../types/table';

const initialState = {
  data: [] as ITable[]
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTable: (state, action) => ({
      ...state,
      data: action.payload
    }),
    deleteTableItem: (state, action) => ({
      ...state,
      data: state.data.filter(item => item._id !== action.payload)
    }),
    createTableItem: (state, action) => ({
      ...state,
      data: [...state.data, action.payload]
    }),
    patchTableItem: (state, action) => ({
      ...state,
      data: state.data.map(item =>
        item._id === action.payload._id ? action.payload : item
      )
    })
  }
  // extraReducers: builder => {
  //   builder.addMatcher(
  //     isAnyOf(tableApi.endpoints.getTables.matchFulfilled),
  //     (state, action) => {
  //       const response = action.payload;
  //       if (response?.statusCode === 200) {
  //         state.data = response?.data;
  //       } else {
  //         state.data = [];
  //       }
  //     }
  //   );
  // }
});

const { reducer, actions } = tableSlice;
export const { setTable, deleteTableItem, createTableItem, patchTableItem } =
  actions;
export default reducer;
