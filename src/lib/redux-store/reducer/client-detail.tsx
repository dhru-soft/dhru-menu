import {createSlice} from '@reduxjs/toolkit'

export const clientDetail = createSlice({
    name: 'clientDetail',
    initialState: {},
    reducers: {
        setClientDetail: (state: any, action) => {
            return {...action.payload}
        },
    },
})

export const {setClientDetail} = clientDetail.actions

export default clientDetail.reducer
