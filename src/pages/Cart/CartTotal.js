import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {
    clone,
    createUniqueStore,
    getLocalSettings,
    numberFormat, placeOrder,
    retrieveData,
    sessionStore,
    storeData
} from "../../lib/functions";
import {resetCart, setCartData, setUpdateCart} from "../../lib/redux-store/reducer/cart-data";
import {itemTotalCalculation} from "../../lib/item-calculation";

import {device} from "../../lib/static";
import CartSummary from "./CartSummary";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useNavigate} from "react-router-dom";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "./ItemDetails";
import Login from "../Login"; // Import css

const Index = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const {cartData,page,cartData:{vouchertotaldisplay,invoiceitems}} = props;

    const [summary,setSummary] = useState(false)

    const options = {
        title: 'Confirm',
        message: 'Are you sure to place order?',
        buttons: [
            {
                label: 'Yes',
                onClick: () =>  {
                    console.log('cartData',JSON.stringify(cartData))
                    dispatch(resetCart())
                }
            },
            {
                label: 'No',
                onClick: () => {

                }
            }
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
        keyCodeForClose: [8, 32],
        overlayClassName: "overlay-custom-confirmation"
    };


    const accessAuth = () => {
        retrieveData('token').then((token)=>{
            if(token){
                placeOrder()
            }
            else {
                dispatch(setModal({
                    show: true,
                    title: '',
                    height: '80%',
                    component: () => <><Login/></>
                }))
            }
        })
    }


    ////// STORE CART
    sessionStore(createUniqueStore(),cartData).then();

    if(Boolean(invoiceitems.length === 0)){
        return <></>
    }

    return (
        <div className={'position-fixed '} style={{zIndex:9999,bottom:5,left:0,right:0}}>

            <div className={'container'}>

                <div className={'shadow bg-white rounded-3  p-4'}>

                {summary && <CartSummary />}

                <div className={'d-flex  justify-content-between align-items-center'}>
                    <div className={'cursor-pointer'} onClick={()=>setSummary(!summary)}>
                        <div><small className={'text-muted'}>Items : {invoiceitems?.length}</small></div>
                        <h4 className={'mb-0'}> {numberFormat(vouchertotaldisplay)}</h4>
                    </div>
                    <div className={'p-4  text-center w-100  cursor-pointer'} onClick={()=>setSummary(!summary)}><i className={`fa fa-chevron-${summary?'down':'up'}`}></i></div>
                    <div>
                        <button className="w-100 custom-btn custom-btn--medium custom-btn--style-1" onClick={()=>{
                            if(page === 'final'){
                                accessAuth()
                                //confirmAlert(options);
                            }
                            else {
                                navigate(`/location/${device.locationid}/cartdetail`);
                            }
                        }} type="button" role="button">
                            {page === 'final'?'Place Order':'Next'}
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

