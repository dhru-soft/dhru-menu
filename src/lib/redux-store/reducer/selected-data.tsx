import {createSlice} from '@reduxjs/toolkit'


export const selectedData = createSlice({
  name: 'selectedData',
  initialState: {},
  reducers: {
    setSelected: (state: any, action) => {
      let data = action.payload;
      return {
        ...state,
        ...data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setSelected} = selectedData.actions

export default selectedData.reducer
