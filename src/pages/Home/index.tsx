import React, {Component, Fragment} from "react";
import {NavLink as Link, useNavigate, useParams} from "react-router-dom";

import { Form, Field } from 'react-final-form'
import {required} from "../../lib/static";


const Index = () => {

    const navigate = useNavigate();
    const onSubmit = (values:any) => {
        navigate(`/${values.accesscode}`);
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
                            initialValues={{accesscode:'asdf12fas'}}
                            onSubmit={onSubmit}
                            render={({ handleSubmit,values }) => (
                                <form onSubmit={handleSubmit}>


                                    <div className={'form'}>

                                        <div>
                                            <Field name="accesscode"  validate={required}>
                                                {({ input, meta }) => (
                                                    <div  className="input-wrp">
                                                        <input  className="textfield textfield--grey" type="text" {...input} placeholder="Access Code" />
                                                        {meta.touched && meta.error && <span>Access Code {meta.error}</span>}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>


                                        <div>
                                            <button className="w-100 custom-btn custom-btn--medium custom-btn--style-4" onClick={()=>{
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


    return (
        <section  className="h-100 restaurant-bg" >

            <div className={'h-100'} style={{backgroundColor:'#00000090'}}>

                <div className="container h-100" >



                </div>
            </div>

        </section>
    )


}


export default Index;
