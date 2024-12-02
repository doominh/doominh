import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: {}
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setCurrentEmployee: (state, action) => ({
      ...state,
      currentUser: action.payload
    })
  }
});

const { reducer, actions } = employeeSlice;
export const { setCurrentEmployee } = actions;
export default reducer;
