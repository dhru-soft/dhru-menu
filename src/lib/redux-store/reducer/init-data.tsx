import {createSlice} from '@reduxjs/toolkit'

export const initData = createSlice({
  name: 'initData',
  initialState: {ordersources:{}},
  reducers: {
    setInitData: (state: any, action) => {
      return {...state, ...action.payload}
    },
    setInitDataWithKeyValue: (state: any, action) => {
      const {key, data} = action.payload;
      return {...state, [key]: {data}}
    },
  },
})

// Action creators are generated for each case reducer function
export const {setInitData, setInitDataWithKeyValue} = initData.actions

export default initData.reducer
