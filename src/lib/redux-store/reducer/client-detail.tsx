import {createSlice} from '@reduxjs/toolkit'
import {sessionStore, storeData} from "../../functions";

export const clientDetail = createSlice({
    name: 'clientDetail',
    initialState: {token:'',verifymobile:''},
    reducers: {
        setClientDetail: (state: any, action) => {
            sessionStore('client', action.payload).then(r => {

            })
            return {...action.payload}
        },
    },
})

export const {setClientDetail} = clientDetail.actions

export default clientDetail.reducer
