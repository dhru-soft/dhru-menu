import {createSlice} from '@reduxjs/toolkit'

export const restaurantData = createSlice({
  name: 'restaurantData',
  initialState: {legalname:'',logo:{download_url:''},tabledetail:{tablename:'',locationid:''},location:{}},
  reducers: {
    setrestaurantData: (state: any, action) => {
      return {...state, ...action.payload}
    },
  },
})

// Action creators are generated for each case reducer function
export const {setrestaurantData} = restaurantData.actions

export default restaurantData.reducer
