import { createSlice } from '@reduxjs/toolkit';
import { ICategoryMenu } from '~/types/category';
import { MenuDetail } from '~/types/menu';
interface IinitState {
  data: MenuDetail[];
  editMenuDetail: {
    value: MenuDetail;
    status: boolean;
  };
  deleteMenuDetailId: string;
  fillterData: MenuDetail[];
}
const initValueEdit = {
  _id: '',
  category_id: '',
  description: '',
  name: '',
  image: '',
  menu_id: '',
  price: 0
};

const initialState: IinitState = {
  editMenuDetail: {
    value: initValueEdit,
    status: false
  },
  deleteMenuDetailId: '',
  data: [],
  fillterData: []
};
const menuDetailSlice = createSlice({
  name: 'menuDetail',
  initialState,
  reducers: {
    setMenuDetail: (state, action) => ({
      ...state,
      data: [...action.payload],
      fillterData: [...action.payload]
    }),
    setFillterData: (state, action) => {
      if (action.payload === 'All')
        return { ...state, fillterData: state.data };
      const dataFind = state.data.filter(
        item => (item.category_id as ICategoryMenu)._id == action.payload
      );
      return dataFind.length > 0
        ? { ...state, fillterData: dataFind }
        : { ...state, fillterData: [] };
    },
    addMenuDetail: (state, action) => ({
      ...state,
      data: [...state.data, ...action.payload]
    }),
    setEdit: (state, action) => ({
      ...state,
      editMenuDetail: {
        value:
          state.data.find(item => item._id === action.payload) || initValueEdit,
        status: true
      }
    }),
    setCancelEdit: state => ({
      ...state,
      editMenuDetail: {
        value: initValueEdit,
        status: false
      }
    }),
    setDelete: (state, action) => ({
      ...state,
      deleteMenuDetailId: action.payload
    }),
    setCancelDelete: state => ({
      ...state,
      deleteMenuDetailId: ''
    })
  }
});

const { reducer, actions } = menuDetailSlice;
export const {
  setMenuDetail,
  setCancelEdit,
  setEdit,
  setDelete,
  setCancelDelete,
  setFillterData
} = actions;
export default reducer;
