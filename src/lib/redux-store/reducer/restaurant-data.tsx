import {createSlice} from '@reduxjs/toolkit'

export const restaurantData = createSlice({
  name: 'restaurantData',
  initialState: {location:{},settings:{},general:{},tabledetail:{}},
  reducers: {
    setrestaurantData: (state: any, action) => {
      return {...state, ...action.payload}
    },
  },
})

// Action creators are generated for each case reducer function
export const {setrestaurantData} = restaurantData.actions

export default restaurantData.reducer
