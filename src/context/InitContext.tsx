import React, {createContext, useContext, useEffect, useState,} from 'react';
import {Spinner} from "reactstrap";
import {
    createUniqueStore,
    getAddonList,
    getInit,
    getWorkspaceName,
    isEmpty,
    sessionRetrieve,
    voucherData
} from "../lib/functions";
import {setCartData} from "../lib/redux-store/reducer/cart-data";
import {useDispatch} from "react-redux";
import store from "../lib/redux-store/store";
import {setAddonList} from "../lib/redux-store/reducer/addon-list";
import Loader3 from "../components/Loader/Loader3";


const defaultData: any = {};

const Index = createContext<any>(defaultData);

export const InitProvider = (props: any) => {
    const {children} = props
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const init = () => {
        getInit(getWorkspaceName()).then(() => {
            ////// RETRIVE CART AND INIT FOR STATE
            sessionRetrieve(createUniqueStore()).then((data) => {
                if (!isEmpty(data)) {
                    dispatch(setCartData({...data, ...voucherData()}));
                }
            })

            if (isEmpty(store.getState().addonList)) {
                getAddonList().then((data) => {
                    store.dispatch(setAddonList(data))
                })
            }

            /*const {groupids} = props || []

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
            }*/

            setLoading(true)
        })


    }

    useEffect(() => {
        if (!window) {
            return;
        }
        init()
    }, []);


    if (!loading) {
        return <><Loader3/></>
    }

    return <Index.Provider value={{loading}}>
        {children}
    </Index.Provider>;
};


const useInitContext = () => useContext(Index)
export default useInitContext;
export const InitConsumer = Index.Consumer


//   const values = useInitContext()

/*    <InitProvider>
        <InitConsumer>
            {(props: any) => {
                return <Component {...props}></Component>
        }}
    </InitConsumer>
</InitProvider>*/
