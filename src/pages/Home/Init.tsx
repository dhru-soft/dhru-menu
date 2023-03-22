import React from "react";
import {createUniqueStore, getInit, getWorkspaceName, retrieveData, sessionRetrieve} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import {setCartData} from "../../lib/redux-store/reducer/cart-data";
import {device} from "../../lib/static";


const Index = (props: any) => {

    const dispatch = useDispatch()
    const legalname: any = props?.general?.legalname

    if (!Boolean(legalname)) {
        getInit(getWorkspaceName()).then(()=>{ })
    }

    ////// RETRIVE CART AND INIT FOR STATE
    sessionRetrieve(createUniqueStore()).then((data)=>{
        device.tableid = data.tableid
        dispatch(setCartData(data));
    })

    return (
        <>
            <div></div>
        </>
    )
}


const mapStateToProps = (state: any) => {
    return {
        general: state.restaurantDetail?.general
    }
}

export default connect(mapStateToProps)(Index);
