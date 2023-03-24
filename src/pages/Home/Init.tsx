import React, {useEffect} from "react";
import {createUniqueStore, getInit, getWorkspaceName, retrieveData, sessionRetrieve} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import {setCartData} from "../../lib/redux-store/reducer/cart-data";
import {device} from "../../lib/static";
import {useParams} from "react-router-dom";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";


const Index = (props: any) => {


    const params = useParams()

    device.tableid = params?.tableid;
    device.locationid = params?.locationid;
    device.groupid = params?.groupid;

    const dispatch = useDispatch()
    const legalname: any = props?.general?.legalname

    if (!Boolean(legalname)) {
        getInit(getWorkspaceName()).then(()=>{ })
    }

    ////// RETRIVE CART AND INIT FOR STATE
    sessionRetrieve(createUniqueStore()).then((data)=>{
        // device.tableid = data?.tableid
        dispatch(setCartData(data));
    })


    useEffect(()=>{
        if(Boolean(device?.groupid)) {
            dispatch(setSelected({groupids: [device.groupid]}))
        }
    },[])


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
