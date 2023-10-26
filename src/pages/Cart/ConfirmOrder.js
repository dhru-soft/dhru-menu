import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import { getCompanyDetails, isEmpty, postOrder} from "../../lib/functions";

import {Field, Form} from 'react-final-form';
import {device} from "../../lib/static";

import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import Login from "../Login";
import {resetCart} from "../../lib/redux-store/reducer/cart-data";
import Addresses from "../Client/Addresses";

const Index = ({clientDetail,vouchertotaldisplay,paymentgateways,cartData,location}) => {

    const dispatch = useDispatch()
    const {addresses} = clientDetail;
    const {tablename, locationname} = getCompanyDetails();
    const [codlabel,setCodlabel] = useState('Cash on delivery')

    const defaultaddress = Boolean(addresses) && Object.values(addresses).filter((address)=>{
        return address?.default
    })[0]


    const takeorder = location[device?.locationid]?.cantakeorder || {delivery:false,pickup:false,qsr:false};
    const maxamountforcod = location[device?.locationid]?.maxamountforcod

    const confirmOrder = (values) => {

        let payments = []

        if(values.paymentgateway === 'Pay Later'){
            payments = [
                {
                    "remainingamount": vouchertotaldisplay,
                    "totalamount": vouchertotaldisplay,
                    "paymentgateways": [
                        {
                            "gatewayname": "Pay later",
                            "gatewaytype": "paylater",
                            "pay": vouchertotaldisplay
                        }
                    ]
                }
            ]
        }
        else{
            const b = getGatewayDetailByKey(values?.paymentgateway, 'displayname');
            payments = [
                {
                    "remainingamount": 0,
                    "totalamount": vouchertotaldisplay,
                    "paymentgateways": [
                        {
                            "gid": values.paymentgateway,
                            "gatewayname": b.value,
                            "pay": vouchertotaldisplay,
                            "paysystem": vouchertotaldisplay,
                            "receipt": "",
                            "phone": "",
                            "otp": "",
                            "gatewaytype": "cash",
                            "isupi": false
                        }
                    ]
                }
            ]
        }


        postOrder({...values,payments,address:defaultaddress}).then((data)=>{
            store.dispatch(setModal({show:false}))
            if(!data){
                store.dispatch(setModal({
                    show: true,
                    title: '',
                    height: '80%',
                    component: () => <><Login/></>
                }))
            }
            else{
                store.dispatch(resetCart())
            }
        })
    }

    const getGatewayDetailByKey = (key, value) => {
        const gatewayname = Object.keys(paymentgateways[key]).filter((key) => key !== "settings");
        let displayname = paymentgateways[key] && paymentgateways[key][gatewayname] && paymentgateways[key][gatewayname].find((a) => a.input === value)
        let gatewaytype = paymentgateways[key] && paymentgateways[key][gatewayname] && paymentgateways[key][gatewayname].find((a) => a.input === 'type');
        return {...displayname,online:Boolean(gatewaytype?.value === 'online'), type: gatewayname[0]}
    }


    const getPaymentgateways = () => {

        return Object.keys(paymentgateways).map((key) => {
            const b = getGatewayDetailByKey(key, 'displayname');
            let item = {label: b.value, value: key,online:b.online, type: b.type, paymentby: b.value, paymentmethod: key};
            return item

        })
    }

    let gateways = getPaymentgateways().filter((item)=>{
        return item.online
    })



    const [paymentMethods, setPaymentMethods] = useState(gateways);
    const [initData,setInitData] = useState({paymentgateway:paymentMethods[0]['value'],tablename:'Online Order',ordertype: Boolean(device.tableid !== '0')?'tableorder': takeorder.delivery?'homedelivery':''})


    useEffect(()=>{
        if(!cartData?.invoiceitems?.length){
            dispatch(setModal({visible:false}))
        }
    },[])


    /*if(update){
        return (<NameAddress/>)
    }*/

    return (
        <div>

            <div className={'container'}>


                <Form
                    initialValues={initData}
                    onSubmit={confirmOrder}
                    render={({handleSubmit,form, values}) => (
                        <form onSubmit={handleSubmit}>

                            <div className={'form'}>



                                <h5>Confirm Order Type</h5>


                                <div className={'mt-3'}>
                                    <div>
                                        <div className={'justify-content-between align-items-center'}>
                                        <div className="w-100">

                                            <div className={'mb-3'}>
                                                <Field name="ordertype">
                                                    {({input, meta}) => (
                                                        <>

                                                            {Boolean(device.tableid === '0') && <div>

                                                                {takeorder.delivery &&  <div className="mb-4    align-items-center" >
                                                                    <div className={'justify-content-between align-items-start'}>
                                                                        <div>

                                                                            <input className="form-check-input" {...input}
                                                                                   checked={values.ordertype === 'homedelivery'} onChange={(e) => {
                                                                                form.change('ordertype',e.target.value)
                                                                                setCodlabel('Cash on delivery')
                                                                            }} id="radio1" type="radio"
                                                                                   value={'homedelivery'}/>
                                                                            <label className="form-check-label"
                                                                                   htmlFor="radio1">
                                                                                Home Delivery
                                                                            </label>


                                                                            {values.ordertype === 'homedelivery' && <div className={'mt-3'}>

                                                                                <Addresses cart={true}/>


                                                                            </div>}
                                                                        </div>
                                                                    </div>

                                                                </div>}






                                                                {takeorder.pickup && <div className="mb-4 d-flex align-items-center">
                                                                    <input className="form-check-input"  checked={values.ordertype === 'takeaway'}  {...input}
                                                                           onChange={(e) => {
                                                                               form.change('ordertype',e.target.value)
                                                                               setCodlabel('Pay on counter')
                                                                           }} id="radio2" type="radio"
                                                                           value={'takeaway'}/>
                                                                    <label className="form-check-label"
                                                                           htmlFor="radio2">
                                                                        Take away
                                                                    </label>
                                                                </div>}

                                                            </div>}

                                                            {(Boolean(device.tableid) && device.tableid !== '0')  && <div>
                                                                <div className="d-flex align-items-center">
                                                                    <input className="form-check-input"  {...input}
                                                                           checked={values.ordertype === 'tableorder'}   onChange={(e) => {
                                                                        form.change('ordertype',e.target.value)
                                                                    }} id="radio3" type="radio"
                                                                           value={'tableorder'}/>
                                                                    <label className="form-check-label"
                                                                           htmlFor="radio3">
                                                                        Table order
                                                                    </label>
                                                                </div>
                                                                <div  style={{marginLeft: 25,opacity:0.7}}>
                                                                    <div>{locationname}</div>
                                                                    <div>{tablename}</div>
                                                                </div>
                                                            </div>}
                                                        </>
                                                    )}
                                                </Field>
                                            </div>

                                        </div>
                                    </div>
                                    </div>
                                </div>


                                {!isEmpty(paymentMethods) && <>

                                    <hr/>

                                    <h5  className={'py-3'}>Payment Detail</h5>
                                    {
                                        paymentMethods.map((item,index)=>{

                                            return (
                                                <div className={'mb-3'} key={index}>
                                                    <Field name="paymentgateway">
                                                        {({input, meta}) => (
                                                            <>
                                                                {Boolean(item.value) &&  <div className="mb-4  align-items-center">
                                                                    <input className="form-check-input"  {...input} checked={values.paymentgateway === item.value}
                                                                           onChange={(e) => {
                                                                               form.change('paymentgateway',e.target.value)
                                                                           }} id={`payment-${index}`} type="radio"
                                                                           value={item.value}/>
                                                                    <label className="form-check-label"
                                                                           htmlFor={`payment-${index}`}>
                                                                        {item.label}
                                                                    </label>
                                                                </div>}
                                                            </>
                                                        )}
                                                    </Field>
                                                </div>
                                            )
                                        })
                                    }

                                    {((+maxamountforcod >= +vouchertotaldisplay && values.ordertype === 'homedelivery') || (values.ordertype !== 'homedelivery') || !Boolean(maxamountforcod))  &&  <div className={'mb-3'} >
                                        <Field name="paymentgateway">
                                            {({input, meta}) => (
                                                <>
                                                    <div className="mb-4  align-items-center">
                                                        <input className="form-check-input"  {...input} checked={values.paymentgateway === 'Pay Later'}
                                                               onChange={(e) => {
                                                                   form.change('paymentgateway',e.target.value)
                                                               }} id={`payment-1000`} type="radio"
                                                               value={'Pay Later'}/>
                                                        <label className="form-check-label"
                                                               htmlFor={`payment-1000`}>
                                                            {values.ordertype === 'takeaway'?'Pay on counter':'Cash on delivery'}

                                                        </label>
                                                    </div>
                                                </>
                                            )}
                                        </Field>
                                    </div>}

                                </>}



                                {((values.ordertype === 'homedelivery' && Boolean(defaultaddress)) || (values.ordertype !== 'homedelivery'))  &&  values.ordertype && <div className={'my-3'}>
                                    <button
                                        className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                        onClick={() => {
                                            handleSubmit(values)
                                        }} type="button" role="button">
                                        Confirm
                                    </button>
                                </div>}


                            </div>

                        </form>
                    )}
                />


            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail,
        location:state.restaurantDetail.location,
        paymentgateways:state.restaurantDetail.settings.payment,
        vouchertotaldisplay:state.cartData.vouchertotaldisplay,
        cartData:state.cartData
    }
}

export default connect(mapStateToProps)(Index);

