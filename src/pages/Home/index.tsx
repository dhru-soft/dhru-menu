import React, {Component, Fragment} from "react";
import {NavLink as Link, useHistory} from "react-router-dom";

import { Form, Field } from 'react-final-form'
import {required} from "../../lib/static";
import {NavLink} from "reactstrap";
import LogoDark from "../../theme/images/logos/logo.svg";

const Index = () => {

    const history = useHistory();

    const onSubmit = (values:any) => {
        history.push(`/${values.accesscode}`);
    }


    return (
        <>


            <div className="position-relative   h-100">
                <div className={'container'}>
                    <div className="row justify-content-xl-between pt-5">
                    <div className="col-12 col-md-6 col-lg-4 m-auto">

                        <div className="section-heading section-heading--center">

                            <img className="img-fluid  rounded mb-5" src={LogoDark}  alt="Logo" style={{width:'120px'}}/>

                            <h2 className="__title">Access Code, Please !</h2>
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
                                                Submit
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
