import React from "react";
import {connect, useDispatch} from "react-redux";

import {ACTIONS, composeValidators, device, METHOD, required, STATUS, urls} from "../../lib/static";

import apiService from "../../lib/api-service";

import {Field, Form} from 'react-final-form';

import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import {setModal} from "../../lib/redux-store/reducer/component";

const Index = ({clientDetail}) => {


    const dispatch = useDispatch()
    const initdata = {displayname: clientDetail.clientname, clientid: clientDetail.clientid}
    const tableorder = Boolean(device.tableid);

    const updateDetail = (values) => {
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
                dispatch(setClientDetail({...clientDetail, clientname: values.displayname, ...values}));
                dispatch(setModal({show: false}))
            }
        });
    }

    return (

        <>

            <Form
                initialValues={initdata}
                onSubmit={updateDetail}
                render={({handleSubmit, values}) => (
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


                                        {!tableorder && <>

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
                                                <Field name="city" validate={composeValidators(required)}>
                                                    {({input, meta}) => (
                                                        <div className="">
                                                            <input className="textfield textfield2" {...input}
                                                                   type="text" placeholder="City"/>
                                                            {meta.touched && meta.error &&
                                                                <div
                                                                    className={'text-danger  mt-2'}>City {meta.error}</div>}
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

        </>


    );
}

const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail
    }
}

export default connect(mapStateToProps)(Index);
