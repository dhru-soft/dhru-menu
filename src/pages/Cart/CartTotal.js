import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {clone, numberFormat} from "../../lib/functions";
import {setCartData, setUpdateCart} from "../../lib/redux-store/reducer/cart-data";
import {itemTotalCalculation} from "../../lib/item-calculation";
import {useNavigate} from "react-router-dom";

const Index = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const {cartData,cartData:{vouchertotaldisplay,invoiceitems}} = props;

   /* useEffect(()=>{
        let data = itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
        dispatch(setCartData(clone(data)));
        dispatch(setUpdateCart());
    },[cartData])

    console.log('vouchertotaldisplay',vouchertotaldisplay)*/

    if(Boolean(invoiceitems.length === 0)){
        return <></>
    }

    return (
        <div className={'position-fixed'} style={{zIndex:9999,bottom:5,left:5,right:5}}>
            <div className={'d-flex shadow justify-content-between align-items-center rounded-3 bg-white py-3 px-4 mt-3'}>
                <div>
                    <div><small className={'text-muted'}>Items : {invoiceitems?.length}</small></div>
                    <h4 className={'mb-0'}> {numberFormat(vouchertotaldisplay)}</h4>
                </div>
                <div>
                    <button className="w-100 custom-btn custom-btn--medium custom-btn--style-1" onClick={()=>{
                        navigate('/cartdetail');
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

