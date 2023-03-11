import React from "react";

import {Field, Form} from 'react-final-form'
import {required} from "../../lib/static";
import {getWorkspaceName, postQrCode} from "../../lib/functions";
import {connect} from "react-redux";
import Restaurant from "../Restaurant";

const Index = (props: any) => {


    const onSubmit = (values: any) => {
        postQrCode(values.accesscode).then()
    }

    const legalname = props?.general?.legalname || '';
    const workspace = getWorkspaceName();


    if (Boolean(legalname) || Boolean(workspace)) {
        return <Restaurant/>
    }


    return (
        <>
            <div className="position-relative   h-100">
                <div className={'container'}>
                    <div className="row justify-content-xl-between pt-5">
                        <div className="col-12 col-md-6 col-lg-4 m-auto">

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
                                                <Field name="accesscode" validate={required}>
                                                    {({input, meta}) => (
                                                        <div className="input-wrp">
                                                            <input className="textfield" type="text" {...input}
                                                                   placeholder="QR ID"/>
                                                            {meta.touched && meta.error &&
                                                                <div className={'text-center text-danger  mt-2'}>QR
                                                                    ID {meta.error}</div>}
                                                        </div>
                                                    )}
                                                </Field>
                                            </div>


                                            <div>
                                                <button
                                                    className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
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
    )


}


const mapStateToProps = (state: any) => {
    return {
        general: state.restaurantDetail?.general
    }
}

export default connect(mapStateToProps)(Index);
