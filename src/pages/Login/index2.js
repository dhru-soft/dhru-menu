import React, {useMemo, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";

import {
    ACTIONS,
    composeValidators,
    countryList,
    device,
    METHOD,
    mustBeNumber,
    required,
    STATUS,
    urls
} from "../../lib/static";
import AuthCode from "react-auth-code-input";
import apiService from "../../lib/api-service";

import Countdown from "react-countdown";
import {setModal} from "../../lib/redux-store/reducer/component";
import {retrieveData, storeData} from "../../lib/functions";
import {Field, Form} from 'react-final-form';

import Select from 'react-select';
import {v4 as uuid} from "uuid";
import store from "../../lib/redux-store/store";
import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";

const Index = (props) => {

    const otpverifyRef = useRef()
    const countryRef = useRef()
    const mobileRef = useRef()
    const counterRef = useRef()
    const AuthInputRef = useRef(null);
    const [counter, setCounter] = useState(false)
    const [otpverify, setOtpVerify] = useState(Boolean(device.client))
    const [mobile, setMobile] = useState('8866522619')
    const [otp, setOTP] = useState('')

    const dispatch = useDispatch()

    const requestOTP = () => {
        apiService({
            method: METHOD.POST,
            action: ACTIONS.CLIENT,
            workspace: device.workspace,
            showalert: true,
            body: {phone: mobile},
            other: {url: urls.posUrl},
        }).then(async (result) => {
            otpverifyRef.current.style.display = 'block';
            AuthInputRef.current?.clear();
            AuthInputRef.current?.focus();
            mobileRef.current.style.display = 'none';
            setCounter(true)
        });
    }

    const verifyOTP = () => {
        apiService({
            method: METHOD.POST,
            action: ACTIONS.CLIENT,
            body: {otp: otp, phone: mobile},
            showalert: true,
            workspace: device.workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                await storeData('token', result.token).then(async () => {
                    device.token = result.token;

                    dispatch(setClientDetail(result?.data));
                    await storeData('client', result?.data).then(() => {
                    })

                    const {clientname} = result.data || {}

                    if (Boolean(clientname)) {
                        store.dispatch(setModal({show: false}))
                    } else {
                        setOtpVerify(true);
                    }

                })
            }
        });
    }

    const updateDetail = (values) => {

        retrieveData('client').then((clientdetail) => {

            const client = {...clientdetail, ...values}
            apiService({
                method: METHOD.PUT,
                action: ACTIONS.CLIENT,
                body: client,
                showalert: true,
                workspace: device.workspace,
                token: device.token,
                other: {url: urls.posUrl},
            }).then(async (result) => {
                if (result.status === STATUS.SUCCESS) {
                    await storeData('client', client).then(() => {
                    })
                    dispatch(setClientDetail(client));
                    store.dispatch(setModal({show: false}))
                }
            });
        })
    }

    const handleOnChange = async (res) => {
        if (res.length === 6) {
            await setOTP(res)
        }
    };

    const [country, setCountry] = useState({label: 'India', value: '+91', code: 'IN'})
    const options = useMemo(() => countryList, [])

    const changeHandler = value => {
        setCountry(value)
    }


    const renderer = ({hours, minutes, seconds, completed}) => {
        return <div className={'d-flex justify-content-between align-items-center'}>
            <div>
                <div style={{color: '#3174de'}} className={!completed ? 'text-muted' : ''} onClick={() => {
                    requestOTP()
                }}>
                    Resend OTP
                </div>
            </div>
            {!completed && <small className={' text-muted'}>Waiting {seconds} Sec</small>}
        </div>
    };


    return (

        <>

            <section className="h-100">

                <div className="container h-100">

                    <div className="m-auto" style={{width: 315}}>

                        {!otpverify && <div>

                            <Form
                                initialValues={{mobile: mobile}}
                                onSubmit={requestOTP}

                                render={({handleSubmit, values}) => (
                                    <form onSubmit={handleSubmit}>

                                        <div ref={mobileRef} className={'form'}>


                                            <div className={'my-3 toggle'} ref={countryRef}>

                                                <div className={'py-3 show'}>
                                                    We are think you are from India. <label style={{color: '#3174de'}}
                                                                                            onClick={() => {
                                                                                                countryRef.current?.classList.toggle('inverse')
                                                                                            }}> Change Country</label>
                                                </div>

                                                <div className={'hide'}>
                                                    <Select options={options} defaultValue={country}
                                                            onChange={changeHandler}/>
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
                                                            <Field name="mobile"
                                                                   validate={composeValidators(required, mustBeNumber)}>
                                                                {({input, meta}) => (
                                                                    <div className="">
                                                                        <input
                                                                            className="textfield textfield2" {...input}
                                                                            minLength={10} maxLength={10} type="text"
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
                                                            setMobile(values.mobile)
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


                            <div className={'form'} ref={otpverifyRef} style={{display: 'none'}}>


                                <div>
                                    <div className={'mb-3'}>

                                        <div className={'mb-3'}> OTP was sent to mobile {mobile}  </div>
                                        <div className={'mb-5'} style={{color: '#3174de'}} onClick={() => {
                                            otpverifyRef.current.style.display = 'none';
                                            mobileRef.current.style.display = 'block'
                                        }}> Change Mobile
                                        </div>

                                        <div className={'input-otp'}>
                                            <AuthCode allowedCharacters='numeric' ref={AuthInputRef}
                                                      onChange={handleOnChange}/>
                                        </div>
                                    </div>


                                    <div>
                                        {counter && <Countdown ref={counterRef} date={Date.now() + 30000} key={uuid}
                                                               renderer={renderer}/>}
                                    </div>

                                    <div className={'my-4'}>
                                        <button
                                            className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                            onClick={() => {
                                                verifyOTP()
                                            }} type="button" role="button">
                                            Verify OTP
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>}


                        {otpverify &&

                            <Form
                                initialValues={{displayname: ''}}
                                onSubmit={updateDetail}
                                render={({handleSubmit, values}) => (
                                    <form onSubmit={handleSubmit}>

                                        <div className={'form'}>

                                            <div className={'mt-3'}>
                                                <div className={'d-flex justify-content-between align-items-center'}>
                                                    <div className="w-100">

                                                        <Field name="displayname"
                                                               validate={composeValidators(required)}>
                                                            {({input, meta}) => (
                                                                <div className="">
                                                                    <input className="textfield textfield2" {...input}
                                                                           type="text" style={{padding: 15}}
                                                                           placeholder="Full Name"/>
                                                                    {meta.touched && meta.error &&
                                                                        <div className={'text-danger  mt-2'}>Full
                                                                            name {meta.error}</div>}
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
                                                    Save
                                                </button>
                                            </div>


                                        </div>

                                    </form>
                                )}
                            />

                        }


                    </div>

                </div>

            </section>
        </>


    );
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps)(Index);
