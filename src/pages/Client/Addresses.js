import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {setModal} from "../../lib/redux-store/reducer/component";
import AddEditAddress from "./AddEditAddress";
import {setDefaultAddress} from "../../lib/functions";
import store from "../../lib/redux-store/store";
import Login from "../Login";

const Index = ({clientDetail, cart}) => {


    const dispatch = useDispatch()

    const {addresses} = clientDetail;

    const [addedit, setAddEdit] = useState(false);
    const [address, setAddress] = useState({});

    const addEditAddress = (address, key) => {

        store.dispatch(setModal({
            show: true,
            title: '',
            height: '80%',
            component: () => <><AddEditAddress address={address} addressid={key} setAddEdit={setAddEdit}/></>
        }))

       // setAddEdit(true);
        //setAddress({...address, addressid: key})
    }



    if (addedit) {
        return <AddEditAddress address={address} setAddEdit={setAddEdit}/>
    }


    return (

        <>
            <div className={'container'}>

                <div className={'d-flex flex-wrap 123'}>
                    {
                        Object.keys(addresses)?.map((key, index) => {

                            if (!Boolean(addresses[key])) {
                                return <div key={index}></div>
                            }

                            const {address1, address2, city, pin, state, country, displayname} = addresses[key];

                            if (!Boolean(address1)) {
                                return <div key={index}></div>
                            }

                            return (
                                <div
                                    className={`addresses position-relative border p-3 rounded-3 me-2 cursor-pointer mb-3 ${addresses[key].default ? 'selected' : ''}`}
                                    key={index}>

                                    <div onClick={() => {
                                        setDefaultAddress(key)
                                    }}>
                                        <div className={'mb-2'}><strong>{displayname}</strong></div>
                                        <div style={{opacity: 0.7}}>
                                            <div>{address1}</div>
                                            <div>{address2}</div>
                                            <div>{country} {state}</div>
                                            <div>{city} {pin}</div>
                                        </div>
                                    </div>

                                    {Boolean(addresses[key].default) &&
                                        <div style={{marginTop: 10}} className={'text-primary'}>
                                            Default Shipping address
                                        </div>}

                                    {!cart && <div className={'justify-content-between on-hover mt-3'}>
                                        {<div className={'position-absolute p-3'} style={{top: 0, right: 0}}
                                              onClick={() => {
                                                  addEditAddress(addresses[key], key)
                                              }}>
                                            <i className={'fa fa-pencil'}></i>
                                        </div>}
                                    </div>}

                                </div>
                            )
                        })
                    }

                    {<div
                        className={`addresses  border p-3 rounded-3 me-2 cursor-pointer mb-3 d-flex justify-content-center align-items-center`}>

                        <div onClick={() => {
                            addEditAddress({})
                        }}>
                            <div className={'mb-2'}><strong>+ Add New Address</strong></div>

                        </div>
                    </div>}

                </div>


                {!cart && <div className={'d-flex justify-content-between'}>

                    <button
                        className="w-100 custom-btn custom-btn--medium custom-btn--style-1"
                        onClick={() => {
                            dispatch(setModal({visible: false}))
                        }} type="button" role="button">
                        Close
                    </button>


                </div>}

            </div>
        </>

    );
}

const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail,
        visitorcountry: state.restaurantDetail?.settings?.visitorcountry
    }
}

export default connect(mapStateToProps)(Index);
