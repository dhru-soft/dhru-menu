import {createSlice} from '@reduxjs/toolkit'

export const itemList = createSlice({
  name: 'itemList',
  initialState: {},
  reducers: {
    setItemList: (state: any, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {setItemList} = itemList.actions

export default itemList.reducer
