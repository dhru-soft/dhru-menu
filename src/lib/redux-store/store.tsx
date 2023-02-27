import {configureStore} from "@reduxjs/toolkit";

import component from "./reducer/component";

import itemDetail from "./reducer/item-detail";
import restaurantDetail from "./reducer/restaurant-data";

import groupList from "./reducer/group-list";
import itemList from "./reducer/item-list";

export default configureStore({
    reducer: {

        itemDetail,

        component,
        restaurantDetail,

        groupList,
        itemList,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
