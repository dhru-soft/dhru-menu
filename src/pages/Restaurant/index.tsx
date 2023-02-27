import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import apiService from "../../lib/api-service";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import Loader2 from "../../components/Loader/loader2";

import {setrestaurantData} from "../../lib/redux-store/reducer/restaurant-data";
import {useHistory} from "react-router-dom";

const Index = (props:any) => {
    const {accesscode} = props.match?.params || {}
    const {restaurantDetail} = props;

    const dispatch = useDispatch()
    const history = useHistory();

    const getWorkspace = async () => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.CODE,
            queryString:{code:accesscode},
            workspace:'dev',
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                const {workspace,tableid}:any = result.data;
                getRestaurantDetail(workspace,tableid).then()
            }
            else{
                dispatch(setrestaurantData({legalname:'notfound'}))
                console.log('no workspace found')
            }
        });
    }

    const getRestaurantDetail = async (workspace:any,tableid:any) => {
        device.workspace = workspace
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.INIT,
            queryString:{tableid:tableid},
            workspace:workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                dispatch(setrestaurantData({...result.data,workspace:workspace}))
            }
        });
    }




    useEffect(()=>{
        getWorkspace().then()
    },[accesscode])

    const {legalname,logo:{download_url},tabledetail:{tablename,locationid}}:any = restaurantDetail

    return(

        <>
            <section  className="h-100 restaurant-bg" >

                    <div className={'h-100'} style={{backgroundColor:'#00000090'}}>

                        <div className="container h-100" >

                            <div className="col-12  text-center pt-5">

                                {
                                   Boolean(legalname) ? <>

                                           {Boolean(legalname !== 'notfound') ?  <>
                                                <div>
                                                    <img style={{borderRadius: 10, width: 100}} className="img-fluid"
                                                         src={`https://${download_url}`}
                                                         alt="demo"/>
                                                </div>

                                                <div className="section-heading section-heading--center">
                                                    <h6 className="__subtitle text-white"> Hi ! </h6>
                                                    <h2
                                                    className="__title text-white">Welcome to <div
                                                    style={{color: '#ffdb00'}}>{legalname}</div></h2>
                                                    {Boolean(tablename) && <h6 className="__subtitle text-white"> {tablename} </h6>}
                                                </div>

                                                <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {
                                                    history.push(`${locationid}/items`)
                                                }} type="button" role="button">
                                                    Explore Menu
                                                </button>
                                       </> : <>
                                               <div className="section-heading section-heading--center">
                                                    <h2
                                                   className="__title text-white">Opps!  <div
                                                   style={{color: '#ff0000'}}>Something went wrong</div></h2>
                                               </div>
                                           </>}

                                    </> :

                                    <>
                                        <div className="col-12  text-white  mt-5 pt-5">
                                            <Loader2 show={true}/>
                                            Please wait connecting
                                        </div>
                                    </>
                                }

                            </div>

                        </div>

                    </div>

            </section>
        </>


    );
}

const mapStateToProps = (state: any) => {
    return {
        restaurantDetail: state.restaurantDetail
    }
}

export default connect(mapStateToProps)(Index);
