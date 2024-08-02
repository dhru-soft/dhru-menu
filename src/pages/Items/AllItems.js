import React, {forwardRef, memo, useEffect, useImperativeHandle, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {device} from "../../lib/static";

import {clone, getGroups, isEmpty, numberFormat} from "../../lib/functions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import Loader3 from "../../components/Loader/Loader3";
import AddButton from "../Cart/AddButton";
import store from "../../lib/redux-store/store";
import {itemLoadingDisabled, itemLoadingEnable, setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "../Cart/ItemDetails";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {v4 as uuid} from "uuid";
import BodyClassName from "react-body-classname";
import Theme from "../Home/Theme";
import CompanyDetail from "../Navigation/CompanyDetail";
import CartTotal from "../Cart/CartTotal";
import {useParams} from "react-router-dom";
import {Card, CardBody} from "reactstrap";
import CartHeader from "../Cart/CartHeader";
import Search from "../Cart/Search";
import Init from "../Home/Init";
import {ItemBox} from "./ItemsbyGroup";
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'




export const   mergeCart = (items,invoiceitems) => {

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

    return items

}

const AllItems = forwardRef((props, ref) => {

    const {itemList, groupList,groupids, selectedtags, searchitem, invoiceitems,search, refGroups} = props

    const params2 = useParams()

    device.tableid = params2?.tableid;
    device.locationid = params2?.locationid;
    device.groupid = params2?.groupid;

    const [items, setItems] = useState(itemList)
    const [groups, setGroups] = useState()
    const [loader, setLoader] = useState(false)

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());


    const {tableorder, online} = device?.order || {};

    const hasAdd = (tableorder && params.table) || ((online || tableorder) && !params.table)

    useImperativeHandle(ref, () => ({loader}))

    const scrollTo = () => {
        scroller.scrollTo('scroll-to-element', {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart'
        })
    }

    useEffect(() => {
        Events.scrollEvent.register('begin', function () {

        });

        Events.scrollEvent.register('end', function () {

        });
    }, []);

    useEffect(() => {
        //setLoader(false)
         getGroups().then((flag) => {
             //setLoader(true)
         })
    }, [device.locationid])

    useEffect(() => {

        let groups = {}
        Object.values(groupList).map((item) => {
            groups[item.itemgroupid] = item
        })

        setGroups(groups)
        setItems(mergeCart(itemList,invoiceitems));

        setLoader(true)
    }, [itemList]);


    if (!loader) {
        return <Loader3/>
    }


    if (isEmpty(itemList)) {
        return <div className={'text-center bg-white rounded-4 text-muted p-5'}>No items found</div>
    }


    return (<BodyClassName className="groups">
        <section>
            <Theme/>

            <div className="">
                <CompanyDetail/>











                <div className={'col-12 mt-3'}>
                    <div>
                        <div className="container">
                            <div>
                                {/*<CartHeader/>*/}

                                {Object.keys(items).filter((keys) => {
                                    return true
                                    return device.groupid ? device.groupid === keys : true
                                }).map((key, index) => {

                                    return <Card key={index} className={'mb-3'}>
                                        <CardBody className={'pb-0'}>
                                            <Element name={key}>
                                                <div><h3> {groups[key]?.itemgroupname}</h3></div>
                                            </Element>
                                            <div className="row">
                                                {items[key].map((item, indd) => {
                                                    return <ItemBox key={indd}
                                                                    item={{
                                                                        ...item,
                                                                        itemid: item.id,
                                                                        addbutton: hasAdd
                                                                    }}/>
                                                })}
                                            </div>
                                        </CardBody>
                                    </Card>
                                })}

                            </div>

                            <div className={'position-fixed bg-white shadow radius-5px'}
                                 style={{zIndex: 999, left: 0, right: 0, bottom: 0}}>
                                <div className={'px-3 pt-3 '}>
                                    <Search/>
                                </div>
                            </div>

                            <CartTotal page={'detailview'}/>
                        </div>
                    </div>
                </div>



            </div>
        </section>
    </BodyClassName>)


})

const mapStateToProps = (state) => {
    return {
        invoiceitems: state.cartData.invoiceitems,
        groupList: state.groupList,
        itemList: state.itemList,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(AllItems);


