import React from "react";
import {connect} from "react-redux";

import CompanyDetail from "../Navigation/CompanyDetail";
import {useNavigate} from "react-router-dom";
import {device} from "../../lib/static";
import CartTotal from "./CartTotal";
import AddButton from "./AddButton";
import {numberFormat} from "../../lib/functions";
import {v4 as uuid} from "uuid";
import ItemDetails from "./ItemDetails";
import BodyClassName from 'react-body-classname';
import {useModal} from "../../use/useModal";

const Index = (props) => {


    const navigate = useNavigate()

    const {invoiceitems} = props;
    const {openModal} = useModal()


    return (<BodyClassName className="cartdetail">
            <section>


                <div className="">

                    <CompanyDetail/>

                    <div className={'col-12'}>

                        <div>
                            <div className="container">

                                {<div className={'pt-3  mt-3'}>
                                    <nav>
                                        <ol className="breadcrumb mb-0">
                                            <>
                                                <li className="breadcrumb-item"><span onClick={() => {
                                                    navigate(-1);
                                                }}><i className={'fa fa-chevron-left'}></i> Back </span></li>
                                            </>
                                        </ol>
                                    </nav>
                                </div>}


                                <div className={'bg-white rounded-3 mt-3'}>

                                    {Boolean(invoiceitems?.length > 0) && invoiceitems?.map((item) => {
                                        const {itemname, productratedisplay, productqnt, itemaddon, notes} = item || {};

                                        return <div className="col-12    item-hover  p-2 py-4" key={uuid()}>
                                            <div className="d-flex p-2 h-100">
                                                <div className={'w-100'} onClick={() => {
                                                    openModal({
                                                        show: true,
                                                        title: itemname,
                                                        disableclose: true,
                                                        height: '80%',
                                                        backdrop:true,
                                                        component: () => <><ItemDetails itemDetail={item}
                                                                                        cart={true}/></>
                                                    })
                                                }}>

                                                    <div className={'p-2 mt-auto'}>
                                                        <div>
                                                            <h4 style={{fontSize: '1.8rem'}}>{itemname} </h4>
                                                            <small
                                                                className={'mb-2'}> {productqnt} x {numberFormat(productratedisplay)} = {numberFormat(productqnt * productratedisplay)} </small>
                                                        </div>

                                                        {Boolean(itemaddon?.length > 0) && <div>
                                                            {itemaddon?.map((addon, key) => {
                                                                const {
                                                                    itemname,
                                                                    productqnt,
                                                                    productratedisplay
                                                                } = addon;
                                                                return (<div key={key}><small
                                                                        className={'mb-2'}> {productqnt} x {itemname} = {numberFormat(productqnt * productratedisplay)} </small>
                                                                    </div>)
                                                            })}
                                                        </div>}

                                                        <div>
                                                            <i className={'mb-2 text-danger'}> {notes} </i>
                                                        </div>


                                                    </div>
                                                </div>
                                                <div className={'border-light'} style={{width: 150}}>
                                                    <AddButton item={item} fromCart={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    })}

                                    {!Boolean(invoiceitems?.length) && <div className={'p-5'}>
                                        <div className={'p-5 text-center'}>Order Placed Successfully</div>
                                        <div className={'text-center'}>
                                            <button className="custom-btn btn-primary btn" onClick={() => {
                                                navigate(`/l/${device.locationid}/t/${device.tableid}`);
                                            }} type="button" role="button">
                                                Back to Menu
                                            </button>
                                        </div>
                                    </div>}

                                </div>

                                <CartTotal page={'final'} hidesearch={true}/>


                            </div>


                        </div>

                    </div>

                </div>

            </section>
        </BodyClassName>)
}


const mapStateToProps = (state) => {
    return {
        invoiceitems: state.cartData.invoiceitems
    }
}

export default connect(mapStateToProps)(Index);

