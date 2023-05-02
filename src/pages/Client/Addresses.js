import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch} from "react-redux";

import {ACTIONS, composeValidators, countryList, device, METHOD, required, STATUS, urls} from "../../lib/static";

import apiService from "../../lib/api-service";

import {Field, Form} from 'react-final-form';

import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import {setModal} from "../../lib/redux-store/reducer/component";
import Select from 'react-select'
import AddEditAddress from "./AddEditAddress";
import store from "../../lib/redux-store/store";

const Index = ({clientDetail}) => {


    const dispatch = useDispatch()
    const {addresses} = clientDetail;

    const addEditAddress = (address) => {
        store.dispatch(setModal({
            show: true,
            title: '',
            height: '80%',
            component: () => <><AddEditAddress address={address}/></>
        }))
    }


    return (

        <>
            <div className={'container'}>

                {
                    Object.values(addresses)?.map((address,index)=>{
                        const {address1, address2,city,pin,state,country,displayname} = address;
                        return (
                            <div className={`addresses border p-3 rounded-3 me-2 cursor-pointer mb-3`} key={index} >

                                <div style={{marginTop:3}} >
                                    <div className={'mb-2'}><strong>{displayname}</strong></div>
                                    <div style={{opacity:0.7}}>
                                        <div>{address1}</div>
                                        <div>{address2}</div>
                                        <div>{city} {pin}</div>
                                    </div>
                                </div>
                                <div className={'d-flex justify-content-between'}>
                                    <span style={{display:"inline-block",marginTop:10}} className={'link'}  onClick={()=>{
                                        dispatch(setClientDetail({...clientDetail}))
                                    }}>
                                    Default
                                </span>

                                    <div>

                                    <button
                                        className="w-100 custom-btn custom-btn--medium custom-btn--style-2"
                                        onClick={()=>{
                                            addEditAddress(address)
                                        }} type="button" role="button">
                                        Edit
                                    </button>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }


                <div>

                    <button
                        className="custom-btn custom-btn--medium custom-btn--style-4"
                        onClick={()=>{
                            addEditAddress({})
                        }} type="button" role="button">
                        + Add New Address
                    </button>

                </div>

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
