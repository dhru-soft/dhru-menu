import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch} from "react-redux";

import {ACTIONS, composeValidators, countryList, device, METHOD, required, STATUS, urls} from "../../lib/static";

import apiService from "../../lib/api-service";

import {Field, Form} from 'react-final-form';

import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import {setModal} from "../../lib/redux-store/reducer/component";
import Select from 'react-select'
import {clone} from "../../lib/functions";

let countryIndex = -1;
let stateIndex = 0;
const Index = ({clientDetail,address,visitorcountry,setAddEdit}) => {


    const dispatch = useDispatch()

    const tableorder = Boolean(device.tableid !== '0');

    let [initdata,setInitdata] = useState({displayname: clientDetail.clientname,...address})



    const country_options = useMemo(() => countryList.map((country)=>{
        return {label:country.label,value:country.code}
    }), [])

    const defaultcountry = country_options.filter((country,index)=>{
        if(country.value === (visitorcountry || 'IN')){
            countryIndex = index
            return true
        }
    })



    const [state_options, setstate_options] = useState()

    const getStateList = (country) => {
        apiService({
            method: METHOD.GET,
            action: 'getstate',
            queryString:{country:country},
            showalert: false,
            workspace: device.workspace,
            token: device.token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                if(result?.data) {

                    const states = Object.keys(result.data).map((state) => {
                        return {label: result.data[state].name, value: state};
                    })

                    const defaultstate = states.filter((state,index)=>{
                        if(initdata.state === state.value){
                            stateIndex = index
                            return true
                        }
                    })

                    setstate_options(states);

                    let data = clone(initdata);
                    data = {
                        ...data,
                        country:country_options[countryIndex],
                        state:states[stateIndex],
                    }

                    setInitdata(data)


                }
            }
        });
    }

    useEffect(()=>{
        getStateList(defaultcountry[0].value)
    },[defaultcountry[0]])


    const updateDetail = (values) => {


        values = {
            ...values,
            clientid:clientDetail?.clientid,
            state:values?.state?.value,
            country:values?.country?.value,
        }

        apiService({
            method: Boolean(initdata?.addressid) ? METHOD.PUT : METHOD.POST,
            action: ACTIONS.ADDRESS,
            body: values,
            showalert: true,
            workspace: device.workspace,
            token: device.token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {

                let addresses = result?.data?.addresses;
                let clientDetails = clone(clientDetail)

                Object.keys(addresses).forEach((key)=>{
                    clientDetails.addresses[key] = addresses[key]
                })

                dispatch(setClientDetail(clientDetails));
                setAddEdit(false)
                //dispatch(setModal({show: false}))
            }
        });

    }

    if(!state_options?.length){
        return <></>
    }


    return (

        <>
            <div className={'container'}>

                <h4>{initdata?.addressid?'Edit':'New'} Address</h4>

            <Form
                initialValues={initdata}
                onSubmit={updateDetail}
                render={({handleSubmit,form, values}) => (
                    <form onSubmit={handleSubmit}>

                        <div className={'form'}>

                            <div className={'mt-3'}>
                                <div className={'d-flex justify-content-between align-items-center'}>
                                    <div className="w-100">

                                        <div className={'mb-3'}>
                                            <Field name="displayname" validate={composeValidators(required)}>
                                                {({input, meta}) => (
                                                    <div className="">
                                                        <input className="textfield textfield2" {...input} type="text"
                                                               placeholder="Full Name"/>
                                                        {meta.touched && meta.error &&
                                                            <div className={'text-danger  mt-2'}>Full
                                                                name {meta.error}</div>}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>


                                        {!tableorder  && <>

                                           <div className={'mb-3'}>
                                                <Field name="address1" validate={composeValidators(required)}>
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <input className="textfield textfield2" {...input}
                                                                   type="text" placeholder="Address 1"/>
                                                            {meta.touched && meta.error &&
                                                                <div className={'text-danger  mt-2'}>Address
                                                                    1 {meta.error}</div>}
                                                        </div>
                                                    )}
                                                </Field>
                                            </div>

                                            <div className={'mb-3'}>
                                                <Field name="address2">
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <input className="textfield textfield2" {...input}
                                                                   type="text" placeholder="Address 2"/>

                                                        </div>
                                                    )}
                                                </Field>
                                            </div>


                                            <div className={'mb-3'}>


                                                <Field name="country"  validate={composeValidators(required)}>
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <Select isDisabled={Boolean(initdata.addressid)} options={country_options} defaultValue={country_options[countryIndex]}  onChange={(value)=>{
                                                                form.change('country',value);
                                                                getStateList(value.value)
                                                            }} className={'react-select'}/>
                                                            {meta.touched && meta.error &&
                                                                <div className={'text-danger  mt-2'}>Country  {meta.error}</div>}
                                                        </div>
                                                    )}
                                                </Field>

                                            </div>


                                            <div className={'mb-3'}>

                                                <Field name="state"  validate={composeValidators(required)}>
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <Select options={state_options}  defaultValue={state_options[stateIndex]}  onChange={(value)=>{
                                                                form.change('state',value)
                                                            }} className={'react-select'}/>

                                                            {meta.touched && meta.error &&
                                                                <div className={'text-danger  mt-2'}>State  {meta.error}</div>}

                                                        </div>
                                                    )}
                                                </Field>

                                            </div>


                                            <div className={'mb-3 d-flex justify-content-between'}>

                                                <Field name="city" validate={composeValidators(required)}>
                                                    {({input, meta}) => (
                                                        <div className="w-100">
                                                            <input className="textfield textfield2" {...input}
                                                                   type="text" placeholder="City"/>
                                                            {meta.touched && meta.error &&
                                                                <div
                                                                    className={'text-danger  mt-2'}>City {meta.error}</div>}
                                                        </div>
                                                    )}
                                                </Field>

                                                <div style={{width:10}}></div>

                                                <Field name="pincode"  >
                                                    {({input, meta}) => (
                                                        <div className="w-100">
                                                            <input className="textfield textfield2" {...input}
                                                                   type="text" placeholder="Pincode"/>

                                                        </div>
                                                    )}
                                                </Field>

                                            </div>

                                        </>}

                                    </div>
                                </div>
                            </div>

                            {/*<pre>
                                {JSON.stringify(values,0,2)}
                            </pre>*/}


                            <div className={'my-3 d-flex justify-content-between'}>

                                <button
                                    className="w-100 custom-btn custom-btn--medium custom-btn--style-1"
                                    onClick={() => {
                                        setAddEdit(false)
                                    }} type="button" role="button">
                                    Cancel
                                </button>

                                <div style={{width:10}}></div>

                                <button
                                    className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                    onClick={() => {
                                        console.log('helo')
                                        handleSubmit(values)
                                    }} type="button" role="button">
                                    Save
                                </button>

                            </div>


                        </div>

                    </form>
                )}
            />

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
