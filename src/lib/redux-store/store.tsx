import {configureStore} from "@reduxjs/toolkit";

import component from "./reducer/component";

import itemDetail from "./reducer/item-detail";

import groupList from "./reducer/group-list";
import itemList from "./reducer/item-list";

export default configureStore({
    reducer: {

        itemDetail,

        component,

        groupList,
        itemList,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
