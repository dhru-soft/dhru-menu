import React from "react";
import {connect, useDispatch} from "react-redux";
import {getCompanyDetails, postOrder} from "../../lib/functions";

import {Field, Form} from 'react-final-form';
import {device} from "../../lib/static";
import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import NameAddress from "../Client/NameAddress";

const Index = ({clientDetail}) => {

    const confirmOrder = (values) => {
        postOrder(values)
    }

    const dispatch = useDispatch()
    const {clientname,address1, address2, city,update} = clientDetail;
    const {tablename, locationname} = getCompanyDetails();

    if(update){
        return (<NameAddress  /> )
    }


    return (
        <div>

            <div className={'container'}>







                <Form
                    initialValues={{ordertype: Boolean(device.tableid)?'table':'homedelivery'}}
                    onSubmit={confirmOrder}
                    render={({handleSubmit, values}) => (
                        <form onSubmit={handleSubmit}>



                            <div className={'form'}>

                                <h4>Confirm Order Type</h4>


                                <div className={'mt-3'}>
                                    <div className={'d-flex justify-content-between align-items-center'}>
                                        <div className="w-100">

                                            <div className={'mb-3'}>
                                                <Field name="ordertype">
                                                    {({input, meta}) => (
                                                        <>

                                                            {!Boolean(device.tableid) && <div>
                                                                <div className="mb-4">

                                                                    <div className={'d-flex justify-content-between align-items-start'}>
                                                                        <div>

                                                                            <input className="form-check-input" {...input}
                                                                                   checked={true} onChange={(e) => {
                                                                                values.ordertype = e.target.value
                                                                            }} id="radio1" type="radio"
                                                                                   value={'homedelivery'}/>
                                                                            <label className="form-check-label"
                                                                                   htmlFor="radio1">
                                                                                Home Delivery
                                                                            </label>

                                                                            <div style={{marginLeft: 25,marginTop:3}}
                                                                                 className={'text-muted'}>
                                                                                <div>{clientname}</div>
                                                                                <div>{address1}</div>
                                                                                <div>{address2}</div>
                                                                                <div>{city}</div>
                                                                            </div>

                                                                        </div>
                                                                        <div className={'p-3'} onClick={()=>{
                                                                            dispatch(setClientDetail({...clientDetail,update:true}))
                                                                        }}>
                                                                            <i className={'fa fa-pencil'}></i>
                                                                        </div>
                                                                    </div>


                                                                </div>

                                                                <div className="mb-4">
                                                                    <input className="form-check-input" {...input}
                                                                           onChange={(e) => {
                                                                               values.ordertype = e.target.value
                                                                           }} id="radio2" type="radio"
                                                                           value={'takeaway'}/>
                                                                    <label className="form-check-label"
                                                                           htmlFor="radio2">
                                                                        Take away
                                                                    </label>
                                                                </div>
                                                            </div>}

                                                            {Boolean(device.tableid) && <div>
                                                                <div className="mb-4">
                                                                    <input className="form-check-input" {...input}
                                                                           checked={true} onChange={(e) => {
                                                                        values.ordertype = e.target.value
                                                                    }} id="radio3" type="radio"
                                                                           value={'table'}/>
                                                                    <label className="form-check-label"
                                                                           htmlFor="radio3">
                                                                        Table order
                                                                    </label>

                                                                    <div style={{marginLeft: 25}}
                                                                         className={'text-muted'}>
                                                                        <div>{locationname}</div>
                                                                        <div>{tablename}</div>
                                                                    </div>

                                                                </div>
                                                            </div>}
                                                        </>
                                                    )}
                                                </Field>
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div className={'my-3'}>
                                    <button
                                        className="w-100 custom-btn custom-btn--medium custom-btn--style-4"
                                        onClick={() => {
                                            handleSubmit(values)
                                        }} type="button" role="button">
                                        Confirm
                                    </button>
                                </div>


                            </div>

                        </form>
                    )}
                />


            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail,
    }
}

export default connect(mapStateToProps)(Index);

