import React, {useEffect, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {clone, getCompanyDetails, getFloatValue, isEmpty, numberFormat, postOrder} from "../../lib/functions";

import {Field, Form} from 'react-final-form';
import {device, METHOD, STATUS, urls} from "../../lib/static";

import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import Login from "../Login";
import {resetCart, setCartData, setUpdateCart} from "../../lib/redux-store/reducer/cart-data";
import Addresses from "../Client/Addresses";
import DiscountCouponItem from "./DiscountCouponItem";
import useRazorpay from "react-razorpay";
import apiService from "../../lib/api-service";
import CouponCode from "./CouponCode";
import {itemTotalCalculation, resetDiscountData} from "../../lib/item-calculation";
import {useModal} from "../../use/useModal";

const Index = ({clientDetail, vouchertotaldisplay, paymentgateways, cartData, location}) => {

    const dispatch = useDispatch()
    const {closeModal,openModal} = useModal()
    const [Razorpay] = useRazorpay();
    const {addresses} = clientDetail;
    const {tablename, locationname} = getCompanyDetails();
    const [codlabel, setCodlabel] = useState('Cash on delivery')

    const [visibleCoupon, setVisibleCoupon] = useState(false)

    const coupon = useSelector((state) => state?.restaurantDetail?.coupon)

    const defaultaddress = Boolean(addresses) && Object.values(addresses).filter((address) => {
        return address?.default
    })[0]


    const takeorder = location[device?.locationid]?.cantakeorder || {delivery: false, pickup: false, qsr: false};
    const maxamountforcod = location[device?.locationid]?.maxamountforcod


    const confirmOrder = (values) => {

        let payments = []

        if (values.paymentgateway === 'Pay Later') {
            payments = [{
                "remainingamount": vouchertotaldisplay, "totalamount": vouchertotaldisplay, "paymentgateways": [{
                    "gatewayname": "Pay later", "gatewaytype": "paylater", "pay": vouchertotaldisplay
                }]
            }]
        } else {
            const b = getGatewayDetailByKey(values?.paymentgateway, 'displayname');
            payments = [{
                "remainingamount": 0, "totalamount": vouchertotaldisplay, "paymentgateways": [{
                    "gid": values.paymentgateway,
                    "gatewayname": b.value,
                    "pay": vouchertotaldisplay,
                    "paysystem": vouchertotaldisplay,
                    "receipt": "",
                    "phone": "",
                    "otp": "",
                    "gatewaytype": "cash",
                    "isupi": false
                }]
            }]
        }


        postOrder({...values, payments, address: defaultaddress}).then((data) => {
            closeModal()
            if (!data) {
                openModal({
                    show: true, title: '', height: '80%', component: () => <><Login/></>
                })
            } else {
                store.dispatch(resetCart())
            }
        })
    }

    const getGatewayDetailByKey = (key, value) => {
        if (Boolean(paymentgateways) && !isEmpty(paymentgateways[key])) {
            const gatewayname = Object.keys(paymentgateways?.[key]).filter((key) => key !== "settings");
            let displayname = paymentgateways[key] && paymentgateways[key][gatewayname] && paymentgateways[key][gatewayname].find((a) => a.input === value)
            let gatewaytype = paymentgateways[key] && paymentgateways[key][gatewayname] && paymentgateways[key][gatewayname].find((a) => a.input === 'type');
            return {...displayname, online: Boolean(gatewaytype?.value === 'online'), type: gatewayname[0]}
        }
        return {}
    }


    const getPaymentgateways = () => {

        return Object.keys(paymentgateways).map((key) => {
            const b = getGatewayDetailByKey(key, 'displayname');
            let item = {
                label: b.value, value: key, online: b.online, type: b.type, paymentby: b.value, paymentmethod: key
            };
            return item

        })
    }

    let gateways = getPaymentgateways().filter((item) => {
        return item.online
    })


    const [paymentMethods, setPaymentMethods] = useState(gateways);

    let pm = (paymentMethods[0] && paymentMethods[0]['value'] && paymentMethods[0]['value']) || [];

    const [initData, setInitData] = useState({
        paymentgateway: pm,
        tablename: 'Online Order',
        ordertype: Boolean(device.tableid !== '0') ? 'tableorder' : takeorder.delivery ? 'homedelivery' : ''
    })


    useEffect(() => {
        if (!cartData?.invoiceitems?.length) {
            closeModal()
        }
    }, [])


    /*if(update){
        return (<NameAddress/>)
    }*/

    const couponToggleHandler = () => {
        setVisibleCoupon((prevState) => !prevState)
    }


    if (visibleCoupon) {
        return (<div>
            <div className={'container'}>
                <div className={'my-3'}>
                    <div>
                        {Object.values(coupon).map((couponItem) => {
                            return <DiscountCouponItem
                                key={couponItem?.couponid}
                                coupon={couponItem}
                                couponToggleHandler={couponToggleHandler}
                            />
                        })}
                    </div>
                    <button
                        className="w-100 custom-btn custom-btn--medium "
                        onClick={couponToggleHandler}
                        type="button"
                        role="button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>)
    }

    const onRazorPayment = async (key, paymentmethod) => {
        return new Promise((resolve) => {
            apiService({
                action: 'onlineorder', method: METHOD.POST, body: {
                    "amount": getFloatValue(cartData?.vouchertotaldisplay).toFixed(2),
                    "clientid": cartData?.clientid,
                    paymentmethod,
                    "data": cartData
                }, workspace: device.workspace, token: device.token, other: {url: urls.posUrl},
            }).then((getOrderIdResponse) => {
                if (getOrderIdResponse.status === STATUS.SUCCESS && Boolean(getOrderIdResponse?.data?.orderid)) {
                    const rzpay = new Razorpay({
                        key, amount: (+cartData?.vouchertotaldisplay) * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                        currency: cartData?.currency, order_id: getOrderIdResponse?.data?.orderid, handler: (res) => {
                            if (res?.razorpay_order_id && res?.razorpay_payment_id) {
                                apiService({
                                    action: 'razorpay', method: METHOD.POST, body: {
                                        razorpay_order_id: res?.razorpay_order_id,
                                        razorpay_payment_id: res?.razorpay_payment_id
                                    }, workspace: device.workspace, token: device.token, other: {url: urls.posUrl},
                                }).then((response) => resolve(response));
                            }
                        },
                    });
                    rzpay.open();
                }
            });

        })
    }

    const onClickClearCoupon = () => {
        const newCartData = resetDiscountData(cartData)
        let data = itemTotalCalculation(clone(newCartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
        dispatch(setCartData(clone(data)));
        dispatch(setUpdateCart());
    }

    return (<div>
        <div className={'container'}>
            <Form
                initialValues={initData}
                onSubmit={confirmOrder}
                render={({handleSubmit, form, values}) => (<form onSubmit={handleSubmit}>

                    <div className={'form'}>

                        <h5>Confirm Order Type</h5>

                        <div className={'mt-3'}>
                            <div>
                                <div className={'justify-content-between align-items-center'}>
                                    <div className="w-100">

                                        <div className={'mb-3'}>
                                            <Field name="ordertype">
                                                {({input, meta}) => (<>

                                                    {Boolean(device.tableid === '0') && <div>

                                                        {takeorder.delivery &&
                                                            <div className="mb-4    align-items-center">
                                                                <div
                                                                    className={'justify-content-between align-items-start'}>
                                                                    <div>

                                                                        <input
                                                                            className="form-check-input" {...input}
                                                                            checked={values.ordertype === 'homedelivery'}
                                                                            onChange={(e) => {
                                                                                form.change('ordertype', e.target.value)
                                                                                setCodlabel('Cash on delivery')
                                                                            }} id="radio1" type="radio"
                                                                            value={'homedelivery'}/>
                                                                        <label className="form-check-label"
                                                                               htmlFor="radio1">
                                                                            Home Delivery
                                                                        </label>


                                                                        {values.ordertype === 'homedelivery' &&
                                                                            <div className={'mt-3'}>

                                                                                <Addresses cart={true}/>


                                                                            </div>}
                                                                    </div>
                                                                </div>

                                                            </div>}


                                                        {takeorder.pickup &&
                                                            <div className="mb-4 d-flex align-items-center">
                                                                <input className="form-check-input"
                                                                       checked={values.ordertype === 'takeaway'}  {...input}
                                                                       onChange={(e) => {
                                                                           form.change('ordertype', e.target.value)
                                                                           setCodlabel('Pay on counter')
                                                                       }} id="radio2" type="radio"
                                                                       value={'takeaway'}/>
                                                                <label className="form-check-label"
                                                                       htmlFor="radio2">
                                                                    Take away
                                                                </label>
                                                            </div>}

                                                    </div>}

                                                    {(Boolean(device.tableid) && device.tableid !== '0') && <div>
                                                        <div className="d-flex align-items-center">
                                                            <input
                                                                className="form-check-input"  {...input}
                                                                checked={values.ordertype === 'tableorder'}
                                                                onChange={(e) => {
                                                                    form.change('ordertype', e.target.value)
                                                                }} id="radio3" type="radio"
                                                                value={'tableorder'}/>
                                                            <label className="form-check-label"
                                                                   htmlFor="radio3">
                                                                Table order
                                                            </label>
                                                        </div>
                                                        <div style={{marginLeft: 25, opacity: 0.7}}>
                                                            <div>{locationname}</div>
                                                            <div>{tablename}</div>
                                                        </div>
                                                    </div>}
                                                </>)}
                                            </Field>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>


                        {!isEmpty(paymentMethods) && <>


                            <hr/>

                            <h5 className={'py-3'}>Payment Detail</h5>
                            {paymentMethods.map((item, index) => {

                                return (<div className={'mb-3'} key={index}>
                                    <Field name="paymentgateway">
                                        {({input, meta}) => (<>
                                            {Boolean(item.value) && <div className="mb-4  align-items-center">
                                                <input className="form-check-input"  {...input}
                                                       checked={values.paymentgateway === item.value}
                                                       onChange={(e) => {
                                                           form.change('paymentgateway', e.target.value)
                                                       }} id={`payment-${index}`} type="radio"
                                                       value={item.value}/>
                                                <label className="form-check-label"
                                                       htmlFor={`payment-${index}`}>
                                                    {item.label}
                                                </label>
                                            </div>}
                                        </>)}
                                    </Field>
                                </div>)
                            })}

                            {((+maxamountforcod >= +vouchertotaldisplay && values.ordertype !== 'tableorder') || !Boolean(maxamountforcod)) &&
                                <div className={'mb-3'}>
                                    <Field name="paymentgateway">
                                        {({input, meta}) => (<>
                                            <div className="mb-4  align-items-center">
                                                <input className="form-check-input"  {...input}
                                                       checked={values.paymentgateway === 'Pay Later'}
                                                       onChange={(e) => {
                                                           form.change('paymentgateway', e.target.value)
                                                       }} id={`payment-1000`} type="radio"
                                                       value={'Pay Later'}/>
                                                <label className="form-check-label"
                                                       htmlFor={`payment-1000`}>
                                                    {(values.ordertype === 'takeaway' || values.ordertype === 'tableorder') ? 'Pay on counter' : 'Cash on delivery'}

                                                </label>
                                            </div>
                                        </>)}
                                    </Field>
                                </div>}


                            <div className={"d-flex align-items-center justify-content-between"}>
                                <div></div>

                                <div className={"text-align-right d-flex align-items-baseline"}>
                                    {!isEmpty(coupon) && <h5
                                        className={"m-0 cursor-pointer link link-danger"}
                                        onClick={couponToggleHandler}
                                    >
                                        View Offers -
                                    </h5>}
                                    <h3 className={"m-0"}>{numberFormat(cartData?.vouchertotaldisplay)}</h3>
                                </div>

                            </div>

                            {
                                !isEmpty(cartData?.coupons) && <div>
                                    Applied Coupon :&nbsp;&nbsp;
                                    {cartData?.coupons.map((c) => {
                                        return <CouponCode key={c?.campaignid}>
                                            <div className={"d-flex"}>
                                                <div>{c?.name}</div>
                                            </div>
                                        </CouponCode>
                                    })}
                                    <span onClick={onClickClearCoupon} className={"text-danger cursor-pointer"}>Clear Coupon</span>
                                </div>
                            }


                            {((values.ordertype === 'homedelivery' && Boolean(defaultaddress)) || (values.ordertype !== 'homedelivery')) && values.ordertype &&
                                <div className={'my-3'}>
                                    <button
                                        className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                        onClick={() => {
                                            const apilink = getGatewayDetailByKey(values?.paymentgateway, 'apilink')
                                            const apikey = getGatewayDetailByKey(values?.paymentgateway, 'apikey')
                                            const apisecret = getGatewayDetailByKey(values?.paymentgateway, 'apisecret')
                                            if (apilink?.value && apikey?.value && apisecret?.value) {
                                                onRazorPayment(apikey?.value, values?.paymentgateway).then((response) => {
                                                    if (response.status === STATUS.SUCCESS && Boolean(response?.data?.transactionid)) {
                                                        form.change("transactionid", response?.data?.transactionid)
                                                        handleSubmit(values)
                                                    }
                                                })
                                            } else {
                                                handleSubmit(values)
                                            }
                                        }} type="button" role="button">
                                        Confirm
                                    </button>
                                </div>}

                        </>}


                        {isEmpty(paymentMethods) && <>
                            <div className={'p-4'}>No any online payment gateway found</div>
                        </>}


                    </div>

                </form>)}
            />
        </div>
    </div>)
}

const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail,
        location: state.restaurantDetail.location,
        paymentgateways: state.restaurantDetail.settings.payment,
        vouchertotaldisplay: state.cartData.vouchertotaldisplay,
        cartData: state.cartData
    }
}

export default connect(mapStateToProps)(Index);

