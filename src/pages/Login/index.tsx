import React, { useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";

import {ACTIONS, device,  METHOD,  STATUS, urls} from "../../lib/static";
import AuthCode, {AuthCodeRef} from "react-auth-code-input";
import promise from "promise";
import apiService from "../../lib/api-service";

import Countdown from "react-countdown";
import {setModal} from "../../lib/redux-store/reducer/component";
import {saveLocalSettings, storeData} from "../../lib/functions";

const Index = (props: any) => {

    const otpverifyRef:any = useRef()
    const AuthInputRef = useRef<AuthCodeRef>(null);
    const [counter,setCounter] = useState(false)
    const [otpverify,setOtpVerify] = useState(false)
    const [mobile,setMobile] = useState('')
    const dispatch = useDispatch()

    const requestOTP = () => {

        return new promise(async (resolve) => {
            await apiService({
                method: METHOD.POST,
                action: ACTIONS.CLIENT,
                queryString: {phone:mobile || '9904845101'},
                workspace: device.workspace,
                other: {url: urls.posUrl},
            }).then(async (result) => {
                otpverifyRef.current.style.display = 'block' ;
                setCounter(true)
                if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {

                }
                resolve(true)
            });
        })
    }

    const verifyOTP = (otp:any) => {
        return new promise(async (resolve) => {
            await apiService({
                method: METHOD.GET,
                action: ACTIONS.INIT,
                queryString: {otp:otp},
                workspace: device.workspace,
                other: {url: urls.posUrl},
            }).then(async (result) => {
                if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                    await storeData('token','save token').then(()=>{
                        setOtpVerify(true);
                    })
                }
                resolve(true)
            });
        })
    }

    const updateDetail = () => {
        return new promise(async (resolve) => {
            await apiService({
                method: METHOD.GET,
                action: ACTIONS.INIT,
                queryString: {displayname:'Ankur patel'},
                workspace: device.workspace,
                other: {url: urls.posUrl},
            }).then(async (result) => {
                if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                    console.log('result?.data',result?.data)
                }
                //dispatch(setModal({show:false}))
                resolve(true)
            });
        })
    }

    const [result, setResult] = useState();
    const handleOnChange = (res:any) => {
        setResult(res);
    };


    const renderer = ({ hours, minutes, seconds, completed }:any) => {
        if (completed) {
            return <div className={'d-flex justify-content-between align-items-center'}>
                <div onClick={()=> requestOTP()}>
                    Resend OTP
                </div>
            </div>;
        } else {
            return <div className={'d-flex justify-content-between align-items-center'}>
                <div>

                </div>
                <small  className={' text-muted'}>Waiting {seconds} Sec</small>
            </div>

        }
    };


    return (

        <>

            <section className="h-100">

                <div className="container h-100">

                    <div className="m-auto" style={{width:315}}>

                        {!otpverify &&   <div>
                            <div className={'form'}>

                                <div>
                                    <div className={''}>
                                        <div className={'d-flex justify-content-between align-items-center'}>
                                            <div style={{width:70}}>
                                                <input className="textfield textfield2 px-3" type="text" defaultValue={'+91'}  placeholder="+91"/>
                                            </div>
                                            <div className="w-100 ms-2">
                                                <input className="textfield textfield2" minLength={10} maxLength={10}  onBlur={(e)=>{
                                                    setMobile(e.target.value)
                                                }}  type="text"  placeholder="Mobile"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={'my-3'}>
                                        <button
                                            className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                            disabled={counter}
                                            onClick={() => {
                                                requestOTP()
                                            }} type="button" role="button">
                                            Request OTP
                                        </button>
                                    </div>

                                    <div>
                                       {counter && <Countdown date={Date.now() + 30000} renderer={renderer} />}
                                    </div>

                                </div>



                            </div>


                            <div className={'form'} ref={otpverifyRef} style={{display:'none'}}>


                                 <div>
                                <div className={'mt-5 mb-3 pt-5'}>
                                    <div className={'input-otp'}>
                                        <AuthCode allowedCharacters='numeric' ref={AuthInputRef} onChange={handleOnChange} />
                                    </div>
                                </div>

                                <div className={'mb-5'}>
                                    <button
                                        className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                        onClick={() => {
                                            verifyOTP('')
                                        }} type="button" role="button">
                                        Verify OTP
                                    </button>
                                </div>
                            </div>

                        </div>
                        </div>}


                        {otpverify &&  <div className={'form'}>

                            <div className={''}>
                                <div className={'d-flex justify-content-between align-items-center'}>
                                    <div className="w-100">
                                        <input className="textfield textfield2" type="text"   style={{padding:15}}  placeholder="Full Name"/>
                                    </div>
                                </div>
                            </div>


                            <div className={'my-3'}>
                                <button
                                    className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                    onClick={() => {
                                        updateDetail()
                                    }} type="button" role="button">
                                    Save
                                </button>
                            </div>


                        </div>}


                    </div>

                </div>

            </section>
        </>


    );
}

const mapStateToProps = (state: any) => {
    return {

    }
}

export default connect(mapStateToProps)(Index);
