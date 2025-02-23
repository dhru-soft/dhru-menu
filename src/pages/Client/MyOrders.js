import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import CompanyDetail from "../Navigation/CompanyDetail";
import Init from "../Home/Init";
import {numberFormat} from "../../lib/functions";
import apiService from "../../lib/api-service";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import OrderDetail from "./OrderDetail";
import {useModal} from "../../use/useModal";


const Index = ({clientDetail}) => {


    const dispatch = useDispatch()
    const [orders, setOrders] = useState()
    const {openModal} = useModal()

    const getorders = async () => {

        if (clientDetail?.clientid) {
            await apiService({
                method: METHOD.GET,
                action: ACTIONS.ORDER,
                queryString: {clientid: clientDetail?.clientid},
                token: device.token,
                other: {url: urls.posUrl},
            }).then(async (result) => {
                if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                    setOrders(result.data)
                }
            });
        }
    }

    const orderDetail = (data) => {
        openModal({
            show: true, title: '',backdrop:true, height: '80%', component: () => <><OrderDetail data={data}/></>
        })
    }

    useEffect(() => {
        getorders()
    }, [clientDetail?.clientid])

    if (!Boolean(clientDetail?.clientid)) {
        return <> <Init/></>
    }


    return (

        <section>

            <CompanyDetail/>

            <>
                <div className={'container'}>
                    <div className="m-auto">

                        <div className={'mt-4'}>
                            <h4>My Orders</h4>

                            <div className={'bg-white p-4 rounded-4 mt-3'}>
                                <table className={'table table-bordered'}>
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Order Type</th>
                                        <th style={{textAlign: 'right'}}>Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Boolean(orders) && Object.keys(orders).map((key) => {

                                        const {data, date, ordertype, status} = orders[key];
                                        const {clientname, vouchertotaldisplay, invoiceitems, payments} = data || {};

                                        return <tr className={'cursor-pointer'} key={key} onClick={() => {
                                            orderDetail(data)
                                        }}>
                                            <td>{date}</td>
                                            <td>
                                                <div className={'badge'} style={{
                                                    textTransform: 'uppercase',
                                                    fontWeight: 'normal',
                                                    backgroundColor: status === 'reject' ? 'red' : '#409df9'
                                                }}>{status}</div>
                                            </td>
                                            <td>
                                                <div className={'text-capitalize'}>{ordertype}</div>
                                            </td>
                                            <td>
                                                <div
                                                    style={{textAlign: 'right'}}>{numberFormat(vouchertotaldisplay)}</div>
                                            </td>
                                        </tr>
                                    })}
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
