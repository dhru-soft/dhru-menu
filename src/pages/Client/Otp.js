import React, {useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";

import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import AuthCode from "react-auth-code-input";
import apiService from "../../lib/api-service";

import Countdown  from "react-countdown";
import {requestOTP} from "../../lib/functions";
import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";


const OTPCounter = ({mobile}) => {

    const [date,setDate] = useState(Date.now() + 30000 )
    const counterRef = useRef()

    const renderer = ({hours, minutes, seconds, completed}) => {
        return <div className={'d-flex justify-content-between align-items-center'}>
            <div>
                <div   className={!completed ? '' : 'text-muted'} onClick={() => {
                    if(completed) {
                        setDate(Date.now() + 30000)
                        counterRef.current.api.start()
                        requestOTP(mobile)
                    }
                }}>
                    Resend OTP
                </div>
            </div>
            {!completed && <small className={' text-muted'}>Waiting {seconds} Sec</small>}
        </div>
    };

    return <Countdown ref={counterRef} date={date} key={date} renderer={renderer}/>
}

let otpnumber = ''
const Index = ({clientDetail}) => {

    const {mobile} = clientDetail

    const AuthInputRef = useRef(null);

    const dispatch = useDispatch()


    const verifyOTP = () => {

        apiService({
            method: METHOD.POST,
            action: ACTIONS.CLIENT,
            body: {otp: otpnumber, phone: mobile},
            showalert: true,
            workspace: device.workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                device.token = result.token
                clientDetail = {
                    ...clientDetail,
                    token: device.token,
                    verifymobile: 'done',
                    ...result.data
                }
                dispatch(setClientDetail(clientDetail));
            }
        });
    }


    const handleOnChange = async (res) => {
        otpnumber = res;
        /*if (res.length === 6) {
            //await setOTP(res)
        }*/
    };

    return (

        <>

            <div className={'container'}>
            <div className={'form'}>


                <div>
                    <div className={'my-3'}>

                        <div className={'mb-3'}> OTP was sent to mobile {mobile}  </div>
                        <div className={'mb-5 text-muted'}  onClick={() => {
                            clientDetail = {
                                ...clientDetail,
                                verifymobile: '',
                            }
                            dispatch(setClientDetail(clientDetail))
                        }}> Change Mobile
                        </div>

                        <div className={'input-otp'}>
                            <AuthCode allowedCharacters='numeric' ref={AuthInputRef} onChange={handleOnChange}/>
                        </div>
                    </div>


                    <div>
                         <OTPCounter mobile={mobile}/>
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

            </div>

        </>


    );
}


const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail
    }
}

export default connect(mapStateToProps)(Index);
