import React, {useState} from "react";
import {connect, useDispatch} from "react-redux";
import {getCompanyDetails, postOrder} from "../../lib/functions";

import {Field, Form} from 'react-final-form';
import {device} from "../../lib/static";
import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import NameAddress from "../Client/NameAddress";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import Login from "../Login";
import {resetCart} from "../../lib/redux-store/reducer/cart-data";
import Scrollbar from "bootstrap/js/src/util/scrollbar";

const Index = ({clientDetail,vouchertotaldisplay,paymentgateways}) => {

    const dispatch = useDispatch()
    const {clientname,address1, address2,pin,state,country,displayname,addresses, city,update} = clientDetail;
    const {tablename, locationname} = getCompanyDetails();

    let addresss = (Boolean(addresses) && Object.values(addresses)) || [];
    addresss.push({address1, address2,city,pin,state,country,displayname:clientname})



    const defaultAddress = addresss?.findIndex((address,index)=>{
        if(address.default === 1){
            return index
        }
    })

    const [selectedAddress,setSelectedAddress] = useState(defaultAddress >= 0 ?defaultAddress : 0)


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
        postOrder({...values,payments,address:addresss[selectedAddress]}).then((data)=>{
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




    if(update){
        return (<NameAddress  /> )
    }


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

                                                            <div className="mb-4  d-flex align-items-center">
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
                                                                <div className="mb-4  d-flex align-items-center" >



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

                                                                                {
                                                                                    addresss.map((address,index)=>{
                                                                                        const {address1, address2,city,pin,state,country,displayname} = address;
                                                                                        return (
                                                                                            <div className={`addresses border p-3 rounded-3 me-2 ${selectedAddress === index?'selected':''}`} key={index}   onClick={()=>{
                                                                                                setSelectedAddress(index)
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
                                                                                }



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

                                                            {Boolean(device.tableid) && <div>
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
        vouchertotaldisplay:state.cartData.vouchertotaldisplay
    }
}

export default connect(mapStateToProps)(Index);

