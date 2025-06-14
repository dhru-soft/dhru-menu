import React, {useMemo, useRef, useState} from "react";
import {connect} from "react-redux";

import {composeValidators, countryList, mustBeNumber, required} from "../../lib/static";
import {requestOTP} from "../../lib/functions";
import {Field, Form} from 'react-final-form';

import Select from 'react-select'

const Index = ({clientDetail,visitorcountry}) => {

    const countryRef = useRef()
    const [mobile, setMobile] = useState(clientDetail?.mobile)

     const defaultcountry = countryList.filter((country)=>{
        return country.code === (clientDetail?.countrylabel || visitorcountry || 'VA')
    })

    const [country, setCountry] = useState(defaultcountry[0])
    const options = useMemo(() => countryList, [])

    const changeHandler = value => {
        setCountry(value)
    }

    const sendOTP = async (values) => {
         requestOTP(values.mobile, country?.value, country?.code)
    }


    return (

        <>
            <div className={'container'}>
            <Form
                initialValues={{mobile: mobile}}
                onSubmit={sendOTP}

                render={({handleSubmit, values}) => (
                    <form onSubmit={handleSubmit}>

                        <div className={'form m-auto'} style={{maxWidth:360}}>


                            <div className={'my-3 toggle'} ref={countryRef}>

                                <div className={'py-3 show'}>
                                    We are think you are from {country.label}. <label className ={'text-muted'} onClick={() => {
                                    countryRef.current?.classList.toggle('inverse')
                                }}> Change Country</label>
                                </div>

                                <div className={'hide'}>
                                    <Select options={options} defaultValue={country} onChange={changeHandler} className={'react-select'}/>
                                </div>

                            </div>


                            <div>
                                <div className={''}>
                                    <div className={'d-flex justify-content-between align-items-top'}>


                                        <div style={{width: 70, padding: 12}}
                                             className={'bg-white textfield textfield2'}>
                                            {country?.value}
                                        </div>

                                        <div className="w-100 ms-2">
                                            <Field name="mobile" validate={composeValidators(required, mustBeNumber)}>
                                                {({input, meta}) => (
                                                    <div className="">
                                                        <input className="textfield textfield2" {...input}
                                                               minLength={country?.value === "+974" ? 8 : 10}
                                                                maxLength={10} type="tel"
                                                               placeholder="Mobile" style={{padding: 15}}/>
                                                        {meta.touched && meta.error &&
                                                            <div className={'text-danger  mt-2'}>Mobile
                                                                number {meta.error}</div>}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>

                                    </div>
                                </div>

                                <div className={'my-3'}>
                                    <button
                                        className="w-100 custom-btn custom-btn--medium custom-btn--style-4"

                                        onClick={() => {
                                            handleSubmit(values)
                                        }} type="button" role="button">
                                        Request OTP
                                    </button>
                                </div>


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
