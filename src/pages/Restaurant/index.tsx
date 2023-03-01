import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import apiService from "../../lib/api-service";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import Loader2 from "../../components/Loader/loader2";

import {setrestaurantData} from "../../lib/redux-store/reducer/restaurant-data";
import {useNavigate, useParams} from "react-router-dom";
import {isEmpty} from "../../lib/functions";

const Index = (props:any) => {

    const params = useParams();

    const {accesscode} = params || {}
    const {restaurantDetail} = props;

    const dispatch = useDispatch()
    const navigate = useNavigate();

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

    const {legalname,logo:{download_url},location,tabledetail:{tablename,locationid}}:any = restaurantDetail

    console.log('location',location)

    return(

        <>
            <section  className="h-100 restaurant-bg" >

                    <div className={'h-100'} style={{backgroundColor:'#00000090'}}>

                        <div className="container h-100" style={{overflow:"scroll"}}>

                            <div className="col-12   pt-5 pb-6">

                                {
                                   Boolean(legalname) ? <>

                                           {Boolean(legalname !== 'notfound') ?  <>
                                                <div className={'text-center'}>
                                                    <img style={{borderRadius: 10, width: 100}} className="img-fluid"
                                                         src={`https://${download_url}`}
                                                         alt="demo"/>
                                                </div>

                                                <div className="section-heading section-heading--center">
                                                    {/*<h6 className="__subtitle text-white"> Hi ! </h6>*/}
                                                    <h2
                                                    className="__title text-white"> <div
                                                    style={{color: '#ffdb00'}}>{legalname}</div></h2>
                                                    {Boolean(tablename) && <h6 className="__subtitle text-white"> {tablename} </h6>}
                                                </div>

                                               <>

                                                   {!isEmpty(location) && <div className={'px-5'}>
                                                       {
                                                           Object.keys(location).map((key)=>{
                                                               const {name,address1,address2,city} = location[key]
                                                               return <div key={key} className={'mb-2'}>
                                                                   <div onClick={() => {
                                                                       navigate(`/groups/${key}`)
                                                                   }} className={'text-white border p-3'} style={{borderRadius:5}}>
                                                                       <h5 className={'text-white'}>{name}</h5>
                                                                       <small>{address1} {address2} {city}</small>
                                                                   </div>
                                                               </div>
                                                           })
                                                       }
                                                   </div>}

                                               </>



                                               {isEmpty(location) && <div className={'text-center'}> <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {
                                                    navigate(`/groups/${locationid}`)
                                                }} type="button" role="button">
                                                    Explore Menu
                                                </button></div> }
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
                                            {/*<Loader2 show={true}/>*/}
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
