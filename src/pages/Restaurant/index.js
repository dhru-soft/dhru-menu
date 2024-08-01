import React, {useEffect, useState} from "react";
import {connect} from "react-redux";


import {useNavigate, useParams} from "react-router-dom";
import {getInit, isEmpty, postQrCode} from "../../lib/functions";

import {device} from "../../lib/static";

import BodyClassName from 'react-body-classname';
import Theme from "../Home/Theme";
import LocationItem from "./LocationItem";


const Index = (props) => {

    const params = useParams();

    const {accesscode} = params || {}
    const {restaurantDetail} = props;

    const navigate = useNavigate();
    const {workspace} = device;
    const [loader, setLoader] = useState(false);


    useEffect(() => {
        if (workspace) {
            getInit(workspace).then(() => {
                setLoader(true)
            })
        } else {
            Boolean(accesscode) && postQrCode(accesscode).then((data) => {
                const {workspace, tableid, locationid} = data;
                if (locationid) {
                    window.location.href = `${window.location.protocol}//${workspace}.${window.location.host.replace('www', '')}/l/${locationid}/t/${tableid}`
                } else {
                    setLoader(true)
                }
            })
        }
    }, [accesscode])


    if (!loader) {
        return <div className="col-12   text-center mt-5 pt-5">
            Please Wait
        </div>
    }

    const {general: {legalname, logo}, location, tabledetail: {tablename}} = restaurantDetail;

    const isRestaurant = Boolean(Object.values(location).filter((values) => {
        return values.industrytype === 'foodservices'
    }).length)


    if (!Boolean(legalname)) {
        return (<div className="col-12   text-center mt-5 pt-5">
            <>
                <h1>404</h1>
                Invalid URl
            </>
        </div>)
    }


    return (

        <BodyClassName className={isRestaurant ? `restaurant` : `retail`}>
            <>
                <Theme/>
                <section className="h-100 restaurant-bg">

                    <div className={'h-100'}>

                        <div className="container-lg h-100">

                            <div className="col-12    pb-6">

                                <>

                                    {Boolean(legalname !== 'notfound') ? <>
                                        <div className={'text-center'}>
                                            {Boolean(logo?.download_url) &&
                                                <img style={{borderRadius: 10, width: 100}} alt={''} className="img-fluid"
                                                     src={`https://${logo?.download_url}`}
                                                />}
                                        </div>

                                        <div className="section-heading section-heading--center">
                                            <h2
                                                className="__title">
                                                <div>{legalname}</div>
                                            </h2>
                                            {Boolean(tablename) &&
                                                <h6 className="__subtitle  text-white"> {tablename} </h6>}
                                        </div>

                                        <>

                                            {!isEmpty(location) && <div className={'row justify-content-center'}  >
                                                {Object.keys(location).map((key) => {

                                                    return <LocationItem
                                                        key={key}
                                                        navigate={navigate}
                                                        locationid={key}
                                                        location={location[key]}
                                                    />
                                                })}
                                            </div>}

                                        </>


                                        {isEmpty(location) && <div className={'text-center'}>
                                            <h1>Coming Soon</h1>
                                        </div>}

                                    </> : <>
                                        <div className="section-heading section-heading--center">
                                            <h4
                                                className="__title">Opps! <div
                                                style={{color: '#ff0000'}}>Something went wrong</div></h4>
                                        </div>
                                    </>}

                                </>

                            </div>

                        </div>

                    </div>

                </section>

            </>
        </BodyClassName>


    );
}

const mapStateToProps = (state) => {
    return {
        restaurantDetail: state.restaurantDetail
    }
}

export default connect(mapStateToProps)(Index);
