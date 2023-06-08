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
import {setDefaultAddress} from "../../lib/functions";

const Index = ({clientDetail,cart}) => {


    const dispatch = useDispatch()

    console.log('clientDetail',clientDetail)

    const {addresses} = clientDetail;

    const [addedit,setAddEdit] = useState(false);
    const [address,setAddress] = useState({});

    const addEditAddress = (address,key) => {
        setAddEdit(true);
        setAddress({...address,addressid:key})
    }

    if(addedit){
        return <AddEditAddress address={address} setAddEdit={setAddEdit}/>
    }


    return (

        <>
            <div className={'container'}>

                <div className={'d-flex flex-wrap'}>
                {
                    Object.keys(addresses)?.map((key,index)=>{

                        if(!Boolean(addresses[key])){
                            return <></>
                        }

                        const {address1, address2,city,pin,state,country,displayname} =  addresses[key] ;

                        if(!Boolean(address1)){
                            return <></>
                        }

                        return (
                            <div className={`addresses position-relative border p-3 rounded-3 me-2 cursor-pointer mb-3 ${addresses[key].default?'selected':''}`} key={index} >

                                <div  onClick={()=>{
                                    setDefaultAddress(key)
                                }}>
                                    <div className={'mb-2'}><strong>{displayname}</strong></div>
                                    <div style={{opacity:0.7}}>
                                        <div>{address1}</div>
                                        <div>{address2}</div>
                                        <div>{country} {state}</div>
                                        <div>{city} {pin}</div>
                                    </div>
                                </div>

                                {Boolean(addresses[key].default) &&  <div  style={{marginTop:10}} className={'text-primary'}>
                                        Default Shipping address
                                    </div>}

                                {!cart &&    <div className={'justify-content-between on-hover mt-3'}>
                                    {<div className={'position-absolute p-3'} style={{top:0,right:0}} onClick={()=>{
                                        addEditAddress(addresses[key],key)
                                    }}>
                                        <i className={'fa fa-pencil'}></i>
                                    </div>}
                                </div>}

                            </div>
                        )
                    })
                }

                    {!cart &&  <div className={`addresses  border p-3 rounded-3 me-2 cursor-pointer mb-3 d-flex justify-content-center align-items-center`}  >

                        <div  onClick={()=>{
                            addEditAddress({})
                        }}>
                            <div className={'mb-2'}><strong>+ Add New Address</strong></div>

                        </div>
                    </div>}

                </div>


                {!cart &&  <div className={'d-flex justify-content-between'}>

                    <button
                        className="w-100 custom-btn custom-btn--medium custom-btn--style-1"
                        onClick={()=>{
                             dispatch(setModal({visible:false}))
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
