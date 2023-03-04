import {configureStore} from "@reduxjs/toolkit";

import component from "./reducer/component";

import itemDetail from "./reducer/item-detail";
import restaurantDetail from "./reducer/restaurant-data";

import groupList from "./reducer/group-list";
import itemList from "./reducer/item-list";

import selectedData from "./reducer/selected-data";

export default configureStore({
    reducer: {

        itemDetail,

        component,
        restaurantDetail,
        selectedData,

        groupList,
        itemList,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
