import {createSlice} from '@reduxjs/toolkit'
import {v4 as uuidv4} from "uuid";
import {device} from "../../static";
import moment from "moment";


export const component = createSlice({
    name        : 'component',
    initialState: {
        dialog     : {
            visible  : false,
            title    : '',
            component: () => {
                return <></>
            }
        },
        modal      : [{
            modalkey:moment().unix(),
            show     : false,
            visible  : false,
            title    : '',
            component: () => {
                return <></>
            }
        }],
        page       : {
            visible  : false,
            title    : '',
            component: () => {
                return <></>
            }
        },
        bottomsheet: {
            visible  : false,
            title    : '',
            component: () => {
                return <></>
            }
        },
        pagesheet  : {
            visible  : false,
            title    : '',
            component: () => {
                return <></>
            }
        },
        alert      : {
            message: '',
            variant: 'success',
            visible: false
        },
        itemLoading: false,
        loader     : false
    },
    reducers    : {
        openDialog    : (state: any, action) => {
            state.dialog = action.payload
            return state
        },
        closeDialog   : (state: any, action) => {
            state.dialog[action.payload].isOpen = false
            return state
        },
        closedDialog  : (state: any, action) => {
            state.dialog[action.payload] = undefined
            return state
        },
        showLoader    : (state: any) => {
            state.loader = true
            return state
        },
        hideLoader    : (state: any) => {
            state.loader = false
            return state
        },
        setModal: (state,action) => {
            state.modal = action.payload
            return state
        },
        removeModal: (state,action) => {
            state.modal = state.modal.filter((value:any)=>{
                return value.modalkey !== action.payload
            })
            return state
        },
        setDialog     : (state: any, action) => {
            state.dialog = action.payload
            return state
        },
        setBottomSheet: (state: any, action) => {
            if (!Boolean(action?.payload?.component)) {
                action.payload.component = () => <></>
            }
            state.bottomsheet = action.payload
            return state
        },
        setPageSheet  : (state: any, action) => {
            if (!Boolean(action?.payload?.component)) {
                action.payload.component = () => <></>
            }
            state.pagesheet = action.payload
            return state
        },
        setAlert      : (state: any, action) => {
            state.alert = action.payload
            return state
        },
        contentLoader : (state: any, action) => {
            state.loading = action.payload
            return state
        },
        openPage : (state: any, action) => {
            device.lastmodal = uuidv4();
            state.page[device.lastmodal] = action.payload
            return state
        },
        closePage: (state: any, action) => {

            state.page[action.payload].visible = false
            return state
        },
        itemLoadingEnable    : (state: any) => {
            state.itemLoading = true
            return state
        },
        itemLoadingDisabled    : (state: any) => {
            state.itemLoading = false
            return state
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    openDialog,
    closeDialog,
    closedDialog,
    showLoader,
    hideLoader,
    setAlert,
    setDialog,
    openPage,
    closePage,
    setBottomSheet,
    setModal,
    removeModal,
    setPageSheet,
    contentLoader,
    itemLoadingEnable,
    itemLoadingDisabled
} = component.actions

export default component.reducer
