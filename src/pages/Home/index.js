import React, {useEffect, useState} from "react";

import {Field, Form} from 'react-final-form'
import {device, required} from "../../lib/static";
import {getWorkspaceName, postQrCode} from "../../lib/functions";
import {connect} from "react-redux";
import Restaurant from "../Restaurant";
import BodyClassName from 'react-body-classname';
import Footer from "../Navigation/Footer";
import {InitProvider} from "../../context/InitContext";

const Index = (props) => {

    const [msg,setMsg] = useState('')

    const onSubmit = (values) => {
        postQrCode(values.accesscode).then((data)=>{
            const {workspace,tableid,locationid} = data;
            if(locationid) {
                window.location.href = `${window.location.protocol}//${workspace}.${window.location.host.replace('www', '')}/l/${locationid}/t/${tableid}`
            }
            else{
                setMsg('Code not found')
            }
        })

    }

    const legalname = props?.general?.legalname || '';
    const workspace = getWorkspaceName();



    if (Boolean(legalname) || Boolean(workspace)) {
        return <Restaurant/>
    }



    return (

        <BodyClassName className={'qrcode'}>
            <>
            <div className="position-relative   h-100">
                <div className={'container p-4'}>
                    <div className="row justify-content-xl-between pt-5">
                        <div className="m-auto"   style={{maxWidth:360}}>

                            <div className="section-heading section-heading--center">

                                <h4>Enter QR code id to continue</h4>
                            </div>

                            <Form
                                initialValues={{accesscode: ''}}
                                onSubmit={onSubmit}
                                render={({handleSubmit, values}) => (
                                    <form onSubmit={handleSubmit}>

                                        <div className={'form'}>

                                            <div>
                                                <Field name="accesscode" validate={ required}>
                                                    {({input, meta}) => (
                                                        <div className="input-wrp">
                                                            <input className="textfield textfield3" type="tel" {...input}
                                                                   placeholder="QR ID"/>
                                                            {meta.touched && meta.error &&
                                                                <div className={'text-center text-danger  mt-2'}>QR
                                                                    ID {meta.error}</div>}
                                                        </div>
                                                    )}
                                                </Field>
                                            </div>

                                            {Boolean(msg) && <div  className={'text-center text-danger  mb-4'}>
                                                {msg}
                                            </div>}


                                            <div>
                                                <button
                                                    className="w-100 custom-btn custom-btn--large custom-btn--style-1"
                                                    style={{height:45}}
                                                    onClick={() => {

                                                        handleSubmit(values)

                                                    }} type="button" role="button">
                                                    Continue
                                                </button>
                                            </div>

                                        </div>

                                    </form>
                                )}
                            />


                        </div>
                    </div>
                </div>

            </div>

            </>
        </BodyClassName>

    )


}


const mapStateToProps = (state) => {
    return {
        general: state.restaurantDetail?.general
    }
}

export default connect(mapStateToProps)(Index);
