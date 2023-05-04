import React, {Fragment, useEffect, useMemo, useState} from "react";
import {connect, useDispatch} from "react-redux";
import CompanyDetail from "../Navigation/CompanyDetail";
import BodyClassName from 'react-body-classname';
import Init from "../Home/Init";
import {getInit, getWorkspaceName, numberFormat} from "../../lib/functions";
import apiService from "../../lib/api-service";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import Search from "../Cart/Search";
import Diet from "../Cart/Diet";
import {v4 as uuid} from "uuid";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "../Cart/ItemDetails";
import AddButton from "../Cart/AddButton";
import {TableRow} from "../Cart/CartSummary";

const Index = ({data}) => {

    const {invoiceitems,vouchertotaldisplay,vouchersubtotaldisplay,voucherinlinediscountdisplay,vouchertotaldiscountamountdisplay,globaltax,voucherroundoffdisplay} = data;

    return (

        <section>

            <>
                <div className={'container'}>
                    <div className="m-auto" >

                        <div className={'mt-4'}>
                        <h4>Order Detail</h4>

                            <div className={'bg-white   rounded-4 mt-3'}>

                                <table className={'table'}>
                                    <thead>
                                        <tr>
                                            <th  className={'w-100'}>Item</th>
                                            <th  style={{textAlign:"center"}}>Qnt</th>
                                            <th  style={{textAlign:"right"}}>Price</th>
                                            <th  style={{textAlign:"right"}}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>



                                {
                                    Boolean(invoiceitems?.length > 0) && invoiceitems?.map((item) => {
                                        const {itemname, productratedisplay, productqnt,itemaddon,notes} = item || {};

                                        return <Fragment   key={uuid()}><tr >
                                            <td>
                                                <div>
                                                   <h5>{itemname}</h5>

                                                </div>

                                                <div>
                                                    <i className={'mb-2 text-danger'}> {notes} </i>
                                                </div>

                                            </td>

                                            <td style={{textAlign:"center"}}>
                                                {productqnt}
                                            </td>

                                            <td style={{textAlign:"right"}}>
                                                {numberFormat(productratedisplay)}
                                            </td>

                                            <td style={{textAlign:"right"}}>
                                                {numberFormat(productqnt * productratedisplay)}
                                            </td>
                                        </tr>

                                        {Boolean(itemaddon?.length > 0) && <>
                                            {
                                                itemaddon?.map((addon,key)=>{
                                                    const {itemname, productratedisplay} = addon;
                                                    return (
                                                        <tr  key={key} >
                                                            <td>
                                                                <small>&nbsp;&nbsp; {itemname}  </small>
                                                            </td>
                                                            <td  style={{textAlign:"center"}}>
                                                                {productqnt}
                                                            </td>

                                                            <td style={{textAlign:"right"}}>
                                                                {numberFormat(productratedisplay)}
                                                            </td>

                                                            <td  style={{textAlign:"right"}}>
                                                                {numberFormat(productqnt * productratedisplay)}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </>}

                                        </Fragment>


                                    })
                                }

                                    </tbody>
                                </table>


                                <div className={'order-detail'}>
                                    <TableRow item={{label: 'Subtotal', value: vouchersubtotaldisplay - voucherinlinediscountdisplay}}/>

                                    <TableRow item={{label: 'Discount', value: vouchertotaldiscountamountdisplay}}/>

                                    {
                                        globaltax?.map((tax, key) => {
                                            if (!Boolean(tax.taxpercentage)) {
                                                return <></>
                                            }
                                            return (
                                                <TableRow key={key} item={{
                                                    label: `${tax.taxname} ${tax.taxpercentage}`,
                                                    value: tax.taxpricedisplay
                                                }}/>
                                            )
                                        })
                                    }

                                    <TableRow item={{label: 'Roundoff', value: voucherroundoffdisplay}}/>

                                    <TableRow item={{label: 'Total', value: vouchertotaldisplay}}/>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

        </>
        </section>


    );
}

const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail,
    }
}

export default connect(mapStateToProps)(Index);
