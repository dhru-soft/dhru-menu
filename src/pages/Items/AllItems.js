import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {connect} from "react-redux";
import {device} from "../../lib/static";

import {getCompanyDetails, getGroups, groupBy, isEmpty, toArray} from "../../lib/functions";
import Loader3 from "../../components/Loader/Loader3";
import BodyClassName from "react-body-classname";
import Theme from "../Home/Theme";
import CompanyDetail from "../Navigation/CompanyDetail";
import CartTotal from "../Cart/CartTotal";
import {useParams} from "react-router-dom";
import {Card, CardBody, UncontrolledCollapse} from "reactstrap";
import {ItemBox} from "./ItemsbyGroup";
import {Element, Events, scroller} from 'react-scroll'
import CartHeader from "../Cart/CartHeader";


export const mergeCart = (items, invoiceitems) => {

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

    const {itemList, groupList, groupids, selectedtags, searchitem, invoiceitems, options,search, refGroups} = props

    const params2 = useParams()

    device.tableid = params2?.tableid;
    device.locationid = params2?.locationid;
    device.groupid = params2?.groupid;

    getCompanyDetails()

    const [items, setItems] = useState()
    const [groups, setGroups] = useState()
    const [loader, setLoader] = useState(false)

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const multioptions = Object.keys(options).length !== 1;

    const {tableorder, online} = device?.order || {};

    const hasAdd = (tableorder && params.table) || ((online || tableorder) && !params.table)

    useImperativeHandle(ref, () => ({loader}))

    const scrollTo = () => {
        scroller.scrollTo('scroll-to-element', {
            duration: 800, delay: 0, smooth: 'easeInOutQuart'
        })
    }

    useEffect(() => {
        Events.scrollEvent.register('begin', function () {

        });

        Events.scrollEvent.register('end', function () {

        });
    }, []);

    useEffect(() => {
        setLoader(false)
        getGroups().then((flag) => {
            setLoader(true)
        })
    }, [device.locationid])

    useEffect(() => {

        let groups = {}
        Object.values(groupList).map((item) => {
            groups[item.itemgroupid] = item
        })
        setGroups(groups);

        setItems(groupBy(toArray(mergeCart(itemList, invoiceitems),'id'),'itemgroupid'))

        //setLoader(true)
    }, [itemList,invoiceitems]);


    if (!loader) {
        return <Loader3/>
    }


    if (isEmpty(itemList)) {
        return <div className={'text-center bg-white rounded-4 text-muted p-5'}>No items found</div>
    }

    const tagoptions  = selectedtags?.filter((item)=>{
        return item.selected
    })?.map((item)=>{
       return item.value
    })


    return (<BodyClassName className="groups">
        <section>
            <Theme/>

            <div className="container p-0">
                <CompanyDetail/>


                <div className={''}>
                    <div>
                        <div>
                            <div>
                                <CartHeader/>

                                {Object.keys(items).filter((keys) => {
                                    return true
                                    return device.groupid ? device.groupid === keys : true
                                }).map((key, index) => {

                                    return <Card key={index} className={'mb-3 border-0'}>
                                        <CardBody  >
                                            <Element name={key}>
                                                <div id={`toggle${key}`}>
                                                   <div className={'d-flex justify-content-between align-items-center'}>
                                                       <h4  className={'p-2 m-0'}> {groups[key]?.itemgroupname}</h4>
                                                       <div className={'me-3'}><i className={'fa fa-chevron-down'}></i></div>
                                                   </div>
                                                </div>
                                            </Element>


                                            <UncontrolledCollapse toggler={`#toggle${key}`} defaultOpen >
                                                <div className={'py-4'}>
                                                    <div className="row">
                                                        {items[key].filter((item)=>{
                                                            return !isEmpty(tagoptions) ? tagoptions.includes(item.veg) : true
                                                        }).map((item, indd) => {
                                                            return <ItemBox key={indd}
                                                                            item={{
                                                                                ...item,
                                                                                itemid: item.id,
                                                                                multioptions:multioptions,
                                                                                addbutton: hasAdd
                                                                            }}/>
                                                        })}
                                                    </div>
                                                </div>
                                            </UncontrolledCollapse>


                                        </CardBody>
                                    </Card>
                                })}

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
        options: state.restaurantDetail?.settings?.options,
        itemList: state.itemList, ...state.selectedData
    }
}

export default connect(mapStateToProps)(AllItems);


/*
<UncontrolledAccordion
    defaultOpen={[
        '1',
    ]}
    stayOpen
    toggle={'1'}
>
    <AccordionItem>
        <AccordionHeader targetId="1">
            Accordion Item 1
        </AccordionHeader>
        <AccordionBody accordionId="1">
            <strong>
                This is the first item's accordion body.
            </strong>
            You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the{' '}
            <code>
                .accordion-body
            </code>
            , though the transition does limit overflow.
        </AccordionBody>
    </AccordionItem>

</UncontrolledAccordion>*/
