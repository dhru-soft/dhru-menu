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
    resetItemList: (state: any, action) => {
      return {}
    },
  },
})

// Action creators are generated for each case reducer function
export const {setItemList,resetItemList} = itemList.actions

export default itemList.reducer
