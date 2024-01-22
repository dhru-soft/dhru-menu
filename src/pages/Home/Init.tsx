import React, {useEffect} from "react";
import {
    clone,
    createUniqueStore,
    getAddonList,
    getInit,
    getWorkspaceName,
    isEmpty,
    sessionRetrieve,
    voucherData
} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import {setCartData} from "../../lib/redux-store/reducer/cart-data";
import {device} from "../../lib/static";
import {useParams} from "react-router-dom";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import store from "../../lib/redux-store/store";
import {setAddonList} from "../../lib/redux-store/reducer/addon-list";


const Index = (props: any) => {


    const params = useParams()

    device.tableid = params?.tableid;
    device.locationid = params?.locationid;
    device.groupid = params?.groupid;

    const dispatch = useDispatch()
    const legalname: any = props?.general?.legalname

    if (!Boolean(legalname)) {
        getInit(getWorkspaceName()).then(() => {
        })
    }

    ////// RETRIVE CART AND INIT FOR STATE
    sessionRetrieve(createUniqueStore()).then((data) => {
        if (!isEmpty(data)) {
            dispatch(setCartData({...data, ...voucherData()}));
        }
    })


    useEffect(() => {

        const {groupids} = props || []

        const index = groupids?.findIndex(function (key: any) {
            return key === device.groupid
        });

        if (Boolean(device.groupid)) {

            if (index === 0) {
                const newgroupids = groupids?.slice(0, index + 1);
                dispatch(setSelected({groupids: newgroupids}))

            } else {
                let groups = clone(groupids) || []
                const find = groups?.filter((key: any) => {
                    return key === device.groupid
                });
                if (!Boolean(find?.length)) {
                    groups?.push(device.groupid)
                }
                if (Boolean(device?.groupid)) {
                    dispatch(setSelected({groupids: groups}))
                }
            }
        } else {
            // dispatch(setSelected({groupids: ''})) 123
        }


    }, [params?.groupid])


    useEffect(() => {
        if (isEmpty(store.getState().addonList)) {
            getAddonList().then((data) => {
                store.dispatch(setAddonList(data))
            })
        }
    }, []);


    return (<>
        <div></div>
    </>)
}


const mapStateToProps = (state: any) => {
    return {
        general: state.restaurantDetail?.general, ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);
