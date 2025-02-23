import React, {forwardRef, memo, useEffect, useImperativeHandle, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {device} from "../../lib/static";

import {clone, getItemList, isEmpty, numberFormat} from "../../lib/functions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import Loader3 from "../../components/Loader/Loader3";
import AddButton from "../Cart/AddButton";
import store from "../../lib/redux-store/store";
import {itemLoadingDisabled, itemLoadingEnable, setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "../Cart/ItemDetails";
import {setItemList} from "../../lib/redux-store/reducer/item-list";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {v4 as uuid} from "uuid";
import {useModal} from "../../use/useModal";


export const AddonAction = ({item, updateQnt, action}) => {
    const dispatch = useDispatch();

    const {closeModal,openModal} = useModal()
    const {invoiceitems} = store.getState().cartData

    let filtered = invoiceitems?.filter((value, key) => {
        return item.itemid === value.itemid
    })



    return (<div>

        {Boolean(filtered?.length > 1) && filtered?.map((item) => {

            const {itemname, productratedisplay, productqnt, itemaddon, notes} = item || {};

            return <div className="col-12    item-hover  p-2 py-4" key={uuid()}>
                <div className="d-flex p-2 h-100">
                    <div className={'w-100'}>

                        <div className={'p-2 mt-auto '}>
                            <div>
                                <h4 style={{fontSize: '1.8rem'}}>{itemname} </h4>
                                <small
                                    className={'mb-2'}> {productqnt} x {numberFormat(productratedisplay)} = {numberFormat(productqnt * productratedisplay)} </small>
                            </div>

                            {Boolean(itemaddon?.length > 0) && <div>
                                {itemaddon?.map((addon, key) => {
                                    const {itemname, productratedisplay} = addon;
                                    return (<div key={key}><small
                                        className={'mb-2'}> {productqnt} x {itemname} = {numberFormat(productqnt * productratedisplay)} </small>
                                    </div>)
                                })}
                            </div>}

                            <div>
                                <i className={'mb-2 text-danger'}> {notes} </i>
                            </div>

                        </div>
                    </div>
                    <div className={'border-light'} style={{width: 150}}>
                        <AddButton item={item} minqnt={action === 'add' && 1} fromCart={true}/>
                    </div>
                </div>
            </div>
        })}

        {(filtered?.length === 1) && <h5 className={'mb-5'}>{item.itemname}</h5>}

        <div className={'d-flex justify-content-between align-items-center mt-3'}>
            {action === 'add' && <div className={'w-100 me-3'}>

                <button className="w-100 custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {
                    openModal({
                        show: true,
                        title: item.itemname,
                        height: '80%',
                        backdrop:true,
                        component: () => <><ItemDetails itemDetail={{...item, productqnt: 1, key: ''}}/></>
                    })
                }} type="button" role="button">
                    Add New
                </button>
            </div>}

            {filtered?.length > 1 && <div className={'w-100'}>
                <button className="w-100 custom-btn custom-btn--medium custom-btn--style-2" onClick={() => {
                    closeModal()
                }} type="button" role="button">
                    Update Qnt
                </button>
            </div>}

            {filtered?.length === 1 && <div className={'w-100'}>
                <button className="w-100 custom-btn custom-btn--medium custom-btn--style-2" onClick={() => {
                    updateQnt('add', true);
                    closeModal()
                }} type="button" role="button">
                    Repeat
                </button>
            </div>}
        </div>
    </div>)
}

export const ItemBox = memo(({item}) => {


    const [updateItem, setUpdateItem] = useState(item);

    useEffect(() => {
        setUpdateItem(item)
    }, [item])

    const {itemname, itemimage, price, itemdescription, veg, addbutton,multioptions} = updateItem;


    const diat = {
        veg: {color: '#659a4a', icon: 'leaf'},
        nonveg: {color: '#ee4c4c', icon: 'meat'},
        egg: {color: 'gray', icon: 'egg'}
    }

    return (<div className="col-12 col-sm-6 col-md-4  col-lg-3   item-hover ">
        <div className="d-flex p-2 py-4 h-100">
            <div className={'w-100'}>

                <div className={'mt-auto '}>
                    <div className={'flex-nowrap'}>
                        {veg && multioptions && <div><i style={{fontSize:12,color: diat[veg]?.color}} className={`fa fa-${diat[veg]?.icon}`} ></i>
                        </div>}
                        <h5 >{itemname} </h5>
                        <div style={{fontSize:15}}> {numberFormat(price)} </div>
                    </div>
                    {Boolean(itemdescription) &&  <div style={{color:'#999',fontSize:14}} className={'mt-3 me-3'}>
                        <ReactReadMoreReadLess
                            charLimit={50}
                            readMoreText={"Read more"}
                            readLessText={""}
                            readMoreStyle={{color: '#222'}}
                        >
                           {itemdescription}
                        </ReactReadMoreReadLess>
                    </div>}
                </div>
            </div>
            <div className={'border-light  rounded-3'}  >
                <div>

                    {itemimage && <LazyLoadImage
                        alt={''}
                        src={`https://${itemimage}`}
                        style={{maxWidth: '100%', borderRadius: 5,backgroundColor:'#eee'}}
                    />}
                </div>
                {addbutton && <AddButton item={updateItem} merger={true} updateItem={setUpdateItem}/>}
            </div>
        </div>
    </div>)
}, (r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.mergeqnt === r2.item.mergeqnt) && (r1.item.itemid === r2.item.itemid));
})


const ItemsbyGroup = forwardRef((props, ref) => {


    const dispatch = useDispatch()

    const [items, setItems] = useState({})
    const [loader, setLoader] = useState(false)

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const {tableorder, online} = device?.order || {};
    const {groupids, selectedtags, searchitem, invoiceitems, refGroups} = props;

    const hasAdd = (tableorder && params.table) || ((online || tableorder) && !params.table)

    useImperativeHandle(ref, () => ({loader}))

    const getItems = async () => {

        const itemList = store.getState().itemList

        const selectedDiat = Boolean(selectedtags?.length > 0) && selectedtags.filter((tag) => {
            return tag.selected
        })?.map((tag) => {
            return tag.value
        })?.toString() || '';
        let queryString = {locationid: device.locationid};
        let itemgroupid = Boolean(groupids) ? groupids[groupids?.length - 1] : device.groupid;


        if (Boolean(searchitem)) {
            queryString = {
                ...queryString, search: searchitem
            }
        } else if (Boolean(itemgroupid)) {
            queryString = {
                ...queryString, itemgroupid: itemgroupid
            }
        }
        if (Boolean(selectedDiat)) {
            queryString = {
                ...queryString, tags: selectedDiat
            }
        }


        const {tags, search} = queryString;

        const mergeCart = (items) => {

            //////// SAVE FOR LOCAL REDUX BY GROUP
            if (!Boolean(tags) && !Boolean(search)) {
                dispatch(setItemList({[itemgroupid]: items}))
            }

            /////// MERGE CART ITEM AND NORMAL ITEM
            if (!isEmpty(items)) {

                let qntbyitem = {}
                invoiceitems.map((item) => {
                    if (!Boolean(qntbyitem[item.itemid])) {
                        qntbyitem[item.itemid] = 0
                    }
                    qntbyitem[item.itemid] += item.productqnt
                    return item
                })

                invoiceitems?.map((item) => {
                    if (Boolean(items[item?.itemid])) {
                        items = {
                            ...items, [item?.itemid]: {...item, mergeqnt: qntbyitem[item?.itemid] || 0},
                        }
                    }
                })
            }
            setItems(clone(items));
        }


        if (!itemList.hasOwnProperty(itemgroupid) || (Boolean(tags) || Boolean(search))) {
            //////// CHECK IF NOT IN REDUX AND GET FROM REMOTE
            getItemList(queryString).then((items) => {
                setLoader(true)
                mergeCart(items)
            })
        } else {
            //////// MERGE ITEMS IF EXISTS IN LOCAL REDUX
            setLoader(true)
            mergeCart(itemList[itemgroupid])
        }

    }

    // OLD CODE START
    // useEffect(() => {
    //     getItems().then()
    // }, [groupids, selectedtags, invoiceitems, searchitem])
    // OLD CODE END


    useEffect(() => {
        if (loader) {
            dispatch(itemLoadingEnable())
        } else {
            dispatch(itemLoadingDisabled())
        }
    }, [loader])

    // NEW CODE START
    useEffect(() => {
        if (!isEmpty(groupids)) {
            getItems().then()
        }
    }, [groupids])

    useEffect(() => {
        if (!isEmpty(selectedtags)) {
            getItems().then()
        }
    }, [selectedtags])

    useEffect(() => {
        if (!isEmpty(invoiceitems)) {
            getItems().then()
        }
    }, [invoiceitems])

    useEffect(() => {
        if (!isEmpty(searchitem)) {
            getItems().then()
        }
    }, [searchitem])
    // NEW CODE END

    if (!loader) {
        return <Loader3/>
    }

    if (isEmpty(items)) {
        return <div className={'text-center bg-white rounded-4 text-muted p-5'}>No items found</div>
    }


    return (<>
        <section>

            <div className="container bg-white rounded-4">
                <div className="row">
                    {Object.keys(items).map((key) => {
                        return <ItemBox key={key} item={{...items[key], itemid: key, addbutton: hasAdd}}/>
                    })}
                </div>
            </div>
        </section>
    </>);
})

const mapStateToProps = (state) => {
    return {
        invoiceitems: state.cartData.invoiceitems, ...state.selectedData
    }
}

export default connect(mapStateToProps)(ItemsbyGroup);


