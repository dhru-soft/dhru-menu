import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch} from "react-redux";
import CompanyDetail from "../Navigation/CompanyDetail";
import BodyClassName from 'react-body-classname';
import Init from "../Home/Init";
import {getInit, getWorkspaceName, numberFormat} from "../../lib/functions";
import apiService from "../../lib/api-service";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import Search from "../Cart/Search";
import Diet from "../Cart/Diet";

const Index = ({clientDetail}) => {


    const dispatch = useDispatch()
    const [orders,setOrders] = useState()

    const getorders = async () => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ORDER,
            queryString: {clientid:clientDetail.clientid},
            token: device.token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                setOrders(result.data)
            }
        });
    }

    useEffect(()=>{
        getorders()
    },[])


    return (

        <section>
            <Init/>

            <CompanyDetail/>

            <>
                <div className={'container'}>
                    <div className="m-auto" >

                        <div className={'mt-4'}>
                        <h4>My Orders</h4>

                            <div className={'bg-white p-4 rounded-4 mt-3'}>
                                <table className={'table table-bordered'}>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Order Type</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        Boolean(orders) && Object.keys(orders).map((key)=>{

                                            const {data,date,ordertype,status} = orders[key];
                                            const {clientname,vouchertotaldisplay,invoiceitems,payments} = data || {};

                                            return  <tr key={key}>
                                                <td>{date}</td>
                                                <td><badge>{status}</badge></td>
                                                <td><div className={'text-capitalize'}>{ordertype}</div></td>
                                                <td><div  className={'text-right'}>{numberFormat(vouchertotaldisplay)}</div> </td>
                                            </tr>
                                        })
                                    }
                                    </tbody>
                                </table>
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
