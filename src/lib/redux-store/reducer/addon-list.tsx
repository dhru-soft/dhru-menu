import {createSlice} from '@reduxjs/toolkit'

export const addonList = createSlice({
  name: 'addonList',
  initialState: {},
  reducers: {
    setAddonList: (state: any, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {setAddonList} = addonList.actions

export default addonList.reducer
