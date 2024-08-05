import React, {forwardRef, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {device} from "../../lib/static";

import SearchBox from "../../components/SearchBox";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {ItemBox} from "./ItemsbyGroup";
import {mergeCart} from "./AllItems";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import {getCompanyDetails} from "../../lib/functions";
import CartTotal from "../Cart/CartTotal";


const SearchItems = forwardRef((props, ref) => {

    const {itemList, groupList, groupids, selectedtags, searchitem, invoiceitems, search, refGroups} = props

    const dispatch = useDispatch()

    let {locationname} = getCompanyDetails();

    const handleSearch = (value) => {
        dispatch(setSelected({searchitem: value}))
    }

    const [items, setItems] = useState(itemList)
    const [filteritems, setFilteritems] = useState([])

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());


    const {tableorder, online} = device?.order || {};

    const hasAdd = (tableorder && params.table) || ((online || tableorder) && !params.table)


    useEffect(() => {
        setItems(mergeCart(itemList, invoiceitems));
    }, [itemList]);

    useEffect(() => {
        let filteritems = []
        Object.values(items).map((item)=>{
            filteritems = [
                ...filteritems,
                ...item
            ]
        })
        setFilteritems(filteritems.filter((item) => {
            return searchitem ? item.itemname.toLowerCase().includes(searchitem.toLowerCase()) : true
        }))
    }, [items,searchitem]);


    return <>

        <div className={'form mb-4'}>
            <div className="mb-3 d-flex w-100 align-items-center">
                <div className={'p-4'} onClick={() => {
                    store.dispatch(setModal({
                        show: false,
                    }))
                }}>
                    <i className="fa fa-chevron-down"></i>
                </div>
                <div className={'flex-grow-1'}>
                    <SearchBox handleSearch={handleSearch} placeholder={`Search in ${locationname}`} autoFocus={true}/>
                </div>
            </div>
        </div>

        {filteritems.length ? <div>
            {filteritems?.map((item, indd) => {
                return <ItemBox key={indd}
                                item={{
                                    ...item, itemid: item.id, addbutton: hasAdd
                                }}/>
            })}
        </div> : <h5 className={'text-center'}>No Result Found for "{searchitem}"</h5>}

        <CartTotal page={'detailview'} hidesearch={true}/>

    </>

})

const mapStateToProps = (state) => {
    return {
        invoiceitems: state.cartData.invoiceitems, itemList: state.itemList, ...state.selectedData
    }
}

export default connect(mapStateToProps)(SearchItems);


