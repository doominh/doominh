import { createSlice } from '@reduxjs/toolkit';
import { IBranch } from '../../types/branch';

const SAVED_BRANCH = localStorage.getItem('branch');

const initialState = {
  data: SAVED_BRANCH ? JSON.parse(SAVED_BRANCH) : ({} as IBranch)
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranch: (state, action) => {
      state.data = action.payload;
      localStorage.setItem('branch', JSON.stringify(action.payload));
    },
    resetBranch: state => {
      state.data = {} as IBranch;
      localStorage.removeItem('branch');
    }
  }
});

const { reducer, actions } = branchSlice;
export const { setBranch, resetBranch } = actions;
export default reducer;
