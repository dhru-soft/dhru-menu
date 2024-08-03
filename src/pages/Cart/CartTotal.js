import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {createUniqueStore, numberFormat, placeOrder, sessionStore} from "../../lib/functions";

import {device} from "../../lib/static";
import CartSummary from "./CartSummary";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useNavigate} from "react-router-dom";
import useStore from "../../hooks/useStore";
import {toast} from "react-toastify";
import Search from "./Search";

const Index = (props) => {

    const navigate = useNavigate();

    const {cartData, page,hidesearch, cartData: {vouchertotaldisplay, invoiceitems, tableid}} = props;

    const store = useStore()
    const [summary, setSummary] = useState(false)

    ////// STORE CART
    sessionStore(createUniqueStore(), cartData).then();



    let btnLabel = 'Next'
    if (page === 'final') {
        btnLabel = 'Send To Kitchen';
        if (!Boolean(tableid) || tableid === '0') {
            btnLabel = 'Place Order';
        }
    }

    const totalOrderQnt = (invoiceitems) => {
        let totalqnt = 0;
        invoiceitems.filter((item) => {
            return item?.treatitem !== 'charges'
        }).map((item) => {
            totalqnt += +item.productqnt
        })
        return totalqnt
    }



    return (<div className={'position-fixed '} style={{zIndex: 999, bottom:  0, left: 0, right: 0}}>

        <div className={''}>

            {!hidesearch &&  <div>
                <Search/>
            </div>}

            {Boolean(invoiceitems.length) &&  <div className={'  rounded-3  p-4 cart-total company-detail'}>


                {summary && <CartSummary/>}

                <div className={'d-flex  justify-content-between align-items-center'}>
                    <div className={'cursor-pointer invert-effect'} onClick={() => setSummary(!summary)}>
                        <div><h6>Items : {totalOrderQnt(invoiceitems)}</h6></div>
                        <h4 className={'mb-0'}> {numberFormat(vouchertotaldisplay)}</h4>
                    </div>
                    <div className={'  invert-effect'}>
                        <h6 className={'p-4 m-0 text-center w-100  cursor-pointer'}
                            onClick={() => setSummary(!summary)}>
                            <i className={`fa fa-chevron-${summary ? 'down' : 'up'}`}></i>
                        </h6>
                    </div>
                    <div>

                        <button
                            className="w-100 custom-btn custom-btn--medium custom-btn--style-5"
                            style={{padding: 5}}
                            onClick={() => {
                                if (store.isOpen) {
                                    if (page === 'final') {
                                        if (+cartData?.vouchertotaldisplay < store?.onlineminamount) {
                                            toast.error(`minimum amount should be ${numberFormat(store?.onlineminamount)}  to place online order`)
                                        } else {
                                            placeOrder()
                                        }
                                    } else {
                                        navigate(`/l/${device.locationid}/t/${device.tableid}/cartdetail`);
                                    }
                                }
                            }}
                            type="button"
                            role="button"
                        >
                            {store.isOpen ? btnLabel : store.message}
                        </button>

                    </div>
                </div>

            </div>}

        </div>

    </div>)
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData,
    }
}

export default connect(mapStateToProps)(Index);

