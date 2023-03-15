import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {clone, createUniqueStore, numberFormat, retrieveData, sessionStore, storeData} from "../../lib/functions";
import {setCartData, setUpdateCart} from "../../lib/redux-store/reducer/cart-data";
import {itemTotalCalculation} from "../../lib/item-calculation";
import {useNavigate} from "react-router-dom";
import {device} from "../../lib/static";
import CartSummary from "./CartSummary";

const Index = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const {cartData,cartData:{vouchertotaldisplay,invoiceitems}} = props;

    const [summary,setSummary] = useState(false)


    ////// STORE CART
    sessionStore(createUniqueStore(),cartData).then();

    if(Boolean(invoiceitems.length === 0)){
        return <></>
    }

    return (
        <div className={'position-fixed shadow bg-white rounded-3  p-4'} style={{zIndex:9999,bottom:5,left:5,right:5}}>

            {summary && <CartSummary />}

            <div className={'d-flex  justify-content-between align-items-center'}>
                <div  onClick={()=>setSummary(!summary)}>
                    <div><small className={'text-muted'}>Items : {invoiceitems?.length}</small></div>
                    <h4 className={'mb-0'}> {numberFormat(vouchertotaldisplay)}</h4>
                </div>
                <div onClick={()=>setSummary(!summary)}><i className={`fa fa-chevron-${summary?'down':'up'}`}></i></div>
                <div>
                    <button className="w-100 custom-btn custom-btn--medium custom-btn--style-1" onClick={()=>{
                        navigate(`/location/${device.locationid}/cartdetail`);
                    }} type="button" role="button">
                        Place Order
                    </button>
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

