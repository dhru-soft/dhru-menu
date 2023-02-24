import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import apiService from "../../lib/api-service";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";
import {hideLoader, showLoader} from "../../lib/redux-store/reducer/component";
import {Loader} from "../../components";
import Loader2 from "../../components/Loader/loader2";

const Index = (props:any) => {
    const {accesscode} = props.match?.params || {}

    const [connecting,setConnecting]:any = useState(false)

    const getWorkspace = async () => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.INIT,
            queryString:{code:accesscode},
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                setConnecting(true)
            }
        });
    }

    useEffect(()=>{
        getWorkspace().then()
    },[])


    if(!connecting){
        return <section  className="section">
            <div className="container">
                <div className="col-12  text-center  mt-5">
                    Please wait connecting
                </div>
            </div>
        </section>
    }

    return(

        <>
            <section  className="section">
                <div className="container">
                    <div className="col-12  text-center  mt-5">
                        <div>
                            <img className="img-fluid"
                                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVWEW-wbu966Ql9WDzdT8suz8ohJEK9ax7TGZ-WOP7o67m_nJiqgOOlZ70T_e4fx10q0I&usqp=CAU" alt="demo"/>
                        </div>

                        <div className="section-heading section-heading--center">
                            <h6 className="__subtitle"> Hi! </h6> <h2 className="__title">Welcome to <span>{'{Restaurant name}'}</span></h2>
                        </div>

                        <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={()=>{

                        }} type="button" role="button">
                            Explore Menu
                        </button>


                    </div>
                </div>
            </section>
        </>


    );
}

const mapStateToProps = (state:any) => {
    return {

    }
};

const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(Index);
