import React, {memo, useCallback, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import apiService from "../../lib/api-service";

import {clone, getItemList, isEmpty, numberFormat} from "../../lib/functions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import Loader3 from "../../components/Loader/Loader3";
import AddButton from "./AddButton";
import store from "../../lib/redux-store/store";
import {setItemDetail} from "../../lib/redux-store/reducer/item-detail";
import {setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "./ItemDetails";
import {setItem, setItemList} from "../../lib/redux-store/reducer/item-list";

export const ItemBox = memo(({item})=>{

    const [updateItem,setUpdateItem] = useState(item);

    const {itemname, itemimage, price, itemdescription, veg, addbutton} = updateItem;

    const diat = {
        veg: {color: '#659a4a', icon: 'leaf'},
        nonveg: {color: '#ee4c4c', icon: 'meat'},
        egg: {color: 'gray', icon: 'egg'}
    }

    return (
        <div className="col-12 col-sm-6 col-md-4  col-lg-3    item-hover  p-2 py-4">
            <div className="d-flex p-2 h-100">
                <div className={'w-100'}>

                    <div className={'p-2 mt-auto '}>
                        <div className={'flex-nowrap'}>
                            {veg && <div><i style={{color: diat[veg].color}} className={`fa fa-${diat[veg].icon}`}></i>
                            </div>}
                            <h4 style={{fontSize:'1.8rem'}}>{itemname} </h4>
                            <h6 className={'mb-2'}> {numberFormat(price)} </h6>
                        </div>
                        <div className={'text-muted mt-3'}>
                            <ReactReadMoreReadLess
                                charLimit={50}
                                readMoreText={"Read more"}
                                readLessText={""}
                                readMoreStyle={{color: 'black'}}
                            >
                                {itemdescription}
                            </ReactReadMoreReadLess>
                        </div>
                    </div>
                </div>
                <div className={'border-light  rounded-3 p-2'} style={{width: 150}}>
                    <div>
                        {itemimage && <img className={'w-100 rounded-3'} src={`https://${itemimage}`}/>}
                    </div>
                    {addbutton &&  <AddButton item={updateItem} updateItem={setUpdateItem}/>}
                </div>
            </div>
        </div>
    )
},(r1,r2)=>{
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})


const Items = (props) => {


    const dispatch = useDispatch()

    const [items, setItems] = useState({})
    const [loader, setLoader] = useState(false)

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const {tableorder,online} = device.order;
    const {groupids, selectedtags, searchitem,invoiceitems,itemList} = props;

    const hasAdd = (tableorder && params.table) || ((online || tableorder) && !params.table)


    const getItems = async () => {

        const selectedDiat = Boolean(selectedtags?.length > 0) && selectedtags?.map((tag) => {
            return tag.value
        })?.toString() || '';
        let queryString = {locationid: device.locationid};
        let itemgroupid = Boolean(groupids) && groupids[groupids?.length - 1];


        if (Boolean(searchitem)) {
            queryString = {
                ...queryString,
                search: searchitem
            }
        }
        if (Boolean(selectedDiat)) {
            queryString = {
                ...queryString,
                tags: selectedDiat
            }
        }
        if (Boolean(itemgroupid)) {
            queryString = {
                ...queryString,
                itemgroupid: itemgroupid
            }
        }

        const {tags,search} = queryString;

        const mergeCart = (items) => {

            //////// SAVE FOR LOCAL REDUX BY GROUP
            if(!Boolean(tags) && !Boolean(search)) {
                dispatch(setItemList({[itemgroupid]: items}))
            }

            /////// MERGE CART ITEM AND NORMAL ITEM
            if (!isEmpty(items)) {
                invoiceitems?.map((item) => {
                    if (Boolean(items[item?.itemid])) {
                        items = {
                            ...items,
                            [item?.itemid]: item,
                        }
                    }
                })
            }

            setItems(clone(items));

        }


        if(!itemList.hasOwnProperty(itemgroupid) || (Boolean(tags) || Boolean(search))){
            //////// CHECK IF NOT IN REDUX AND GET FROM REMOTE
            getItemList(queryString).then((items) => {
                setLoader(true)
                mergeCart(items)
            })
        }
        else {

            //////// MERGE ITEMS IF EXISTS IN LOCAL REDUX
            setLoader(true)
            mergeCart(itemList[itemgroupid])
        }



    }

    useEffect(() => {
        getItems().then()
    }, [groupids, selectedtags, searchitem])

    if (!loader) {
        return <Loader3/>
    }

    if (isEmpty(items)) {
        return <div className={'text-center bg-white rounded-4 text-muted p-5'}>No items found</div>
    }



    return (
        <>
            <section>
                <div className="container bg-white rounded-4">
                    <div className="row">
                        {
                            Object.keys(items).map((key) => {
                                return <ItemBox key={key} item={{...items[key], itemid: key,addbutton : hasAdd}}/>
                            })
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        invoiceitems:state.cartData.invoiceitems,
        itemList:state?.itemList || {},
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Items);


