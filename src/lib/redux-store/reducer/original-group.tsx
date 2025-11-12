import {createSlice} from '@reduxjs/toolkit'

export const originalGroup = createSlice({
    name: 'originalGroup',
    initialState: {},
    reducers: {
        setOriginalGrList: (state: any, action) => {
            return {...action.payload}
        },
        setOriginalGroup: (state: any, action) => {
            const data = action.payload;

            return {
                ...state,
                [data.itemgroupid]:data
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const {setOriginalGrList, setOriginalGroup} = originalGroup.actions

export default originalGroup.reducer
