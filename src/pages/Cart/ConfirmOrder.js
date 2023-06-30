import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {getCompanyDetails, postOrder,setDefaultAddress} from "../../lib/functions";

import {Field, Form} from 'react-final-form';
import {device} from "../../lib/static";

import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import Login from "../Login";
import {resetCart} from "../../lib/redux-store/reducer/cart-data";
import Addresses from "../Client/Addresses";

const Index = ({clientDetail,vouchertotaldisplay,paymentgateways,cartData}) => {

    const dispatch = useDispatch()
    const {addresses} = clientDetail;
    const {tablename, locationname} = getCompanyDetails();

    const defaultaddress = Object.values(addresses).filter((address)=>{
        return address.default
    })[0]


    const confirmOrder = (values) => {

        let payments = [
            {
                "remainingamount": 0,
                "totalamount": vouchertotaldisplay,
                "paymentgateways": [
                    {
                        "gid": values.paymentgateway,
                        "gatewayname": paymentgateways[values.paymentgateway].name,
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
                    initialValues={{paymentgateway:'c02fc4ca-8d89-4c91-bd66-2dd29bc34e43',ordertype: Boolean(device.tableid !== '0')?'table':'homedelivery'}}
                    onSubmit={confirmOrder}
                    render={({handleSubmit,form, values}) => (
                        <form onSubmit={handleSubmit}>


                            <div className={'form'}>

                                <h5>Payment Detail</h5>


                                {
                                    Object.keys(paymentgateways).map((key,index)=>{
                                        const {name,account} = paymentgateways[key]
                                        return (
                                            <div className={'mb-3'} key={index}>
                                                <Field name="paymentgateway">
                                                    {({input, meta}) => (
                                                        <>

                                                            <div className="mb-4  align-items-center">
                                                                <input className="form-check-input"  {...input} checked={values.paymentgateway === key}
                                                                       onChange={(e) => {
                                                                           form.change('paymentgateway',e.target.value)
                                                                       }} id={`payment-${key}`} type="radio"
                                                                       value={key}/>
                                                                <label className="form-check-label"
                                                                       htmlFor={`payment-${key}`}>
                                                                    {name}
                                                                </label>
                                                            </div>
                                                        </>
                                                    )}
                                                </Field>
                                            </div>
                                        )
                                    })
                                }

                                <br/>

                                <hr/>



                                <h5 className={'mt-5'}>Confirm Order Type</h5>


                                <div className={'mt-3'}>
                                    <div>
                                        <div className={'justify-content-between align-items-center'}>
                                        <div className="w-100">

                                            <div className={'mb-3'}>
                                                <Field name="ordertype">
                                                    {({input, meta}) => (
                                                        <>

                                                            {Boolean(device.tableid === '0') && <div>
                                                                <div className="mb-4    align-items-center" >



                                                                    <div className={'justify-content-between align-items-start'}>
                                                                        <div>

                                                                            <input className="form-check-input" {...input}
                                                                                   checked={values.ordertype === 'homedelivery'} onChange={(e) => {
                                                                                form.change('ordertype',e.target.value)
                                                                            }} id="radio1" type="radio"
                                                                                   value={'homedelivery'}/>
                                                                            <label className="form-check-label"
                                                                                   htmlFor="radio1">
                                                                                Home Delivery
                                                                            </label>


                                                                            {values.ordertype === 'homedelivery' && <div className={'mt-3'}>

                                                                                <Addresses cart={true}/>

                                                                                {/*{
                                                                                    Object.keys(addresses)?.map((key)=>{

                                                                                        const {address1, address2,city,pin,state,country,displayname} = addresses[key];
                                                                                        return (
                                                                                            <div className={`addresses border p-3 rounded-3 me-2 ${addresses[key].default === 1?'selected':''}`} key={key}   onClick={()=>{
                                                                                                setDefaultAddress(key)
                                                                                            }}>
                                                                                                <div style={{marginTop:3}} >
                                                                                                    <div className={'mb-2'}><strong>{displayname}</strong></div>
                                                                                                    <div style={{opacity:0.7}}>
                                                                                                        <div>{address1}</div>
                                                                                                        <div>{address2}</div>
                                                                                                        <div>{city} {pin}</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <span style={{display:"inline-block",marginTop:10}} className={'link'}  onClick={()=>{
                                                                                                    dispatch(setClientDetail({...clientDetail,update:true}))
                                                                                                }}>
                                                                                                    Edit
                                                                                                </span>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }*/}

                                                                            </div>}



                                                                        </div>





                                                                    </div>


                                                                </div>






                                                                <div className="mb-4 d-flex align-items-center">
                                                                    <input className="form-check-input"  checked={values.ordertype === 'takeaway'}  {...input}
                                                                           onChange={(e) => {
                                                                               form.change('ordertype',e.target.value)
                                                                           }} id="radio2" type="radio"
                                                                           value={'takeaway'}/>
                                                                    <label className="form-check-label"
                                                                           htmlFor="radio2">
                                                                        Take away
                                                                    </label>
                                                                </div>
                                                            </div>}

                                                            {(Boolean(device.tableid) && device.tableid !== '0')  && <div>
                                                                <div className="d-flex align-items-center">
                                                                    <input className="form-check-input"  {...input}
                                                                           checked={values.ordertype === 'table'}   onChange={(e) => {
                                                                        form.change('ordertype',e.target.value)
                                                                    }} id="radio3" type="radio"
                                                                           value={'table'}/>
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


                                <div className={'my-3'}>
                                    <button
                                        className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                        onClick={() => {
                                            handleSubmit(values)
                                        }} type="button" role="button">
                                        Confirm
                                    </button>
                                </div>


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
        paymentgateways:state.restaurantDetail.settings.payment,
        vouchertotaldisplay:state.cartData.vouchertotaldisplay,
        cartData:state.cartData
    }
}

export default connect(mapStateToProps)(Index);

