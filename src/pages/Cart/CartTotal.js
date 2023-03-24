import React, {useState} from "react";
import {connect} from "react-redux";
import {createUniqueStore, numberFormat, placeOrder, sessionStore} from "../../lib/functions";

import {device} from "../../lib/static";
import CartSummary from "./CartSummary";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useNavigate} from "react-router-dom";

const Index = (props) => {

    const navigate = useNavigate();

    const {cartData, page, cartData: {vouchertotaldisplay, invoiceitems, tableid}} = props;

    const [summary, setSummary] = useState(false)


    ////// STORE CART
    sessionStore(createUniqueStore(), cartData).then();

    if (Boolean(invoiceitems.length === 0)) {
        return <></>
    }

    let btnLabel = 'Next'
    if (page === 'final') {
        btnLabel = 'Send To Kitchen';
        if (!Boolean(tableid)) {
            btnLabel = 'Place Order';
        }
    }

    return (
        <div className={'position-fixed '} style={{zIndex: 999, bottom: 5, left: 0, right: 0}}>

            <div className={'container'}>

                <div className={'shadow bg-white rounded-3  p-4'}>

                    {summary && <CartSummary/>}

                    <div className={'d-flex  justify-content-between align-items-center'}>
                        <div className={'cursor-pointer'} onClick={() => setSummary(!summary)}>
                            <div><small className={'text-muted'}>Items : {invoiceitems?.length}</small></div>
                            <h4 className={'mb-0'}> {numberFormat(vouchertotaldisplay)}</h4>
                        </div>
                        <div className={'p-4  text-center w-100  cursor-pointer'} onClick={() => setSummary(!summary)}>
                            <i className={`fa fa-chevron-${summary ? 'down' : 'up'}`}></i>
                        </div>
                        <div>

                            <button className="w-100 custom-btn custom-btn--medium custom-btn--style-1"
                                    style={{padding: 5}} onClick={() => {
                                if (page === 'final') {
                                    placeOrder(tableid)
                                } else {
                                    navigate(`/location/${device.locationid}/cartdetail`);
                                }
                            }} type="button" role="button">
                                {btnLabel}
                            </button>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData,
    }
}

export default connect(mapStateToProps)(Index);

