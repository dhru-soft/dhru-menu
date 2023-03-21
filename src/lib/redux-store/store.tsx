import {configureStore} from "@reduxjs/toolkit";

import component from "./reducer/component";

import itemDetail from "./reducer/item-detail";
import clientDetail from "./reducer/client-detail";
import restaurantDetail from "./reducer/restaurant-data";

import groupList from "./reducer/group-list";
import cartData from "./reducer/cart-data";
import itemList from "./reducer/item-list";

import selectedData from "./reducer/selected-data";

export default configureStore({
    reducer: {
        itemDetail,
        clientDetail,
        component,
        restaurantDetail,
        selectedData,
        cartData,
        groupList,
        itemList,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
