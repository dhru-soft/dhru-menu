import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch} from "react-redux";
import CompanyDetail from "../Navigation/CompanyDetail";
import BodyClassName from 'react-body-classname';
import Init from "../Home/Init";
import {getInit, getWorkspaceName} from "../../lib/functions";
import apiService from "../../lib/api-service";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";

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

                        <h4>My Orders</h4>

                        <table>
                            <tbody>
                                {
                                   Boolean(orders) && Object.keys(orders).map((key)=>{

                                       const {data,date,ordertype,status} = orders[key];
                                        const {clientname,vouchertotaldisplay,invoiceitems,payments} = data || {};

                                        return  <tr key={key}>
                                            <td>{date}</td>
                                            <td>{status}</td>
                                            <td>{ordertype}</td>
                                            <td>{clientname}</td>
                                            <td>{vouchertotaldisplay}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>


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
