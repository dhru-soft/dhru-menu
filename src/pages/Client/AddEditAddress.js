import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch} from "react-redux";

import {ACTIONS, composeValidators, countryList, device, METHOD, required, STATUS, urls} from "../../lib/static";

import apiService from "../../lib/api-service";

import {Field, Form} from 'react-final-form';

import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import {setModal} from "../../lib/redux-store/reducer/component";
import Select from 'react-select'
import {clone} from "../../lib/functions";

const Index = ({clientDetail,address,visitorcountry}) => {


    const dispatch = useDispatch()

    const initdata = {displayname: clientDetail.clientname,...address,country:(visitorcountry || 'IN')}

    const tableorder = Boolean(device.tableid !== '0');

    const country_options = useMemo(() => countryList, [])
    const state_options = ([])

    const defaultcountry = countryList.filter((country)=>{
        return country.code === (visitorcountry || 'IN')
    })


    const [country, setCountry] = useState(defaultcountry[0])
    const [state, setState] = useState({})

/*    useEffect(()=>{
        apiService({
            method: METHOD.GET,
            action: 'getstate',
            queryString:{country:country.code},
            showalert: true,
            workspace: device.workspace,
            token: device.token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                setState(result.data)
            }
        });
    },[country])*/


    const updateDetail = (values) => {

        values = {
            ...values,
            clientid:clientDetail.clientid
        }

        apiService({
            method: METHOD.PUT,
            action: ACTIONS.CLIENT,
            body: values,
            showalert: true,
            workspace: device.workspace,
            token: device.token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                let address = clone(clientDetail?.addresses) || [];
                address.push(values)
                values = {
                    ...values,
                    addresses:address
                }
                dispatch(setClientDetail({...clientDetail,  clientname: values.displayname, ...values}));
                dispatch(setModal({show: false}))
            }
        });

    }
    const changeHandlerCountry = value => {
        setCountry(value)
    }
    const changeHandlerState = value => {
        setCountry(value)
    }

    return (

        <>
            <div className={'container'}>

                <h4>{initdata?.address1?'Edit':'New'} Address</h4>

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


                                                <Field name="country">
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <Select isDisabled={true} options={country_options} defaultValue={country} onChange={changeHandlerCountry} className={'react-select'}/>
                                                        </div>
                                                    )}
                                                </Field>


                                            </div>


                                            <div className={'mb-3'}>

                                                <Field name="state"  validate={composeValidators(required)}>
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <input className="textfield textfield2" {...input}
                                                                   type="text" placeholder="State"/>
                                                            {meta.touched && meta.error &&  <div   className={'text-danger  mt-2'}>State {meta.error}</div>}
                                                        </div>
                                                    )}
                                                </Field>

                                                {/*<Field name="state" validate={composeValidators(required)}>
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <Select options={state_options} defaultValue={state} onChange={changeHandlerState} className={'react-select'}/>
                                                        </div>
                                                    )}
                                                </Field>*/}


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


                            <div className={'my-3'}>
                                <button
                                    className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                    onClick={() => {
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
