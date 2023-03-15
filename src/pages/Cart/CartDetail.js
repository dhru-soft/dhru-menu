import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Search from "./Search";
import Bredcrumb from "./Bredcrumb";
import Diet from "./Diet";
import {useParams} from "react-router-dom";
import Init from "../Home/Init";
import {device} from "../../lib/static";
import CartTotal from "./CartTotal";
import AddButton from "./AddButton";
import {clone, numberFormat} from "../../lib/functions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import {cartData, setCartData, setUpdateCart} from "../../lib/redux-store/reducer/cart-data";
import {itemTotalCalculation} from "../../lib/item-calculation";
import CartSummary from "./CartSummary";



const Index = (props) => {

    const params = useParams()
    device.locationid = params?.locationid;

    const {invoiceitems} = props;


    return (
        <section>

            <Init/>

            <div className="">

                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div className={'bg-white rounded-3 mt-3'} style={{marginBottom:200}}>

                            {
                                invoiceitems.map((item,index)=>{
                                    const {itemname,productratedisplay,productqnt} = item
                                    return  <div className="col-12    item-hover  p-2 py-4" key={index}>
                                        <div className="d-flex p-2 h-100">
                                            <div className={'w-100'}>

                                                <div className={'p-2 mt-auto '}>
                                                    <div className={'flex-nowrap'}>
                                                        <h4 style={{fontSize:'1.8rem'}}>{itemname} </h4>
                                                        <div className={'mb-2 text-muted'}> {productqnt} x {numberFormat(productratedisplay)} = {numberFormat(productqnt * productratedisplay)} </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className={'border-light'} style={{width: 150}}>
                                                <AddButton item={item}  />
                                            </div>
                                        </div>
                                    </div>
                                })
                            }

                            </div>


                            <CartTotal/>


                        </div>


                    </div>

                </div>

            </div>

        </section>
    )
}


const mapStateToProps = (state) => {
    return {
        restaurantDetail: state.restaurantDetail,
        invoiceitems:state.cartData.invoiceitems
    }
}

export default connect(mapStateToProps)(Index);

