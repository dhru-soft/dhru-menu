import {createSlice} from '@reduxjs/toolkit'
import {storeData} from "../../functions";

export const clientDetail = createSlice({
    name: 'clientDetail',
    initialState: {token:'',verifymobile:''},
    reducers: {
        setClientDetail: (state: any, action) => {
            storeData('client', action.payload).then(r => {

            })
            return {...action.payload}
        },
    },
})

export const {setClientDetail} = clientDetail.actions

export default clientDetail.reducer
