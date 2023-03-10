import React, {useEffect} from "react";
import {connect} from "react-redux";

import {useNavigate, useParams} from "react-router-dom";
import {getInit, isEmpty, postQrCode} from "../../lib/functions";

import {device} from "../../lib/static";

const Index = (props: any) => {

    const params = useParams();

    const {accesscode} = params || {}
    const {restaurantDetail} = props;

    const navigate = useNavigate();
    const {workspace} = device;


    useEffect(() => {
        if (workspace) {
            getInit(workspace).then()
        } else {
            Boolean(accesscode) && postQrCode(accesscode).then()
        }
    }, [accesscode])

    const {general: {legalname, logo}, location, tabledetail: {tablename, locationid}}: any = restaurantDetail;


    if (!Boolean(legalname)) {
        return (
            <div className="col-12   text-center mt-5 pt-5">
                {workspace ? <>
                    <h1>404</h1>
                    Invalid URl
                </> : <>
                    Please Wait
                </>}
            </div>
        )
    }


    return (

        <>

            <section className="h-100 restaurant-bg">

                <div className={'h-100'} style={{backgroundColor: '#00000090'}}>

                    <div className="container h-100">

                        <div className="col-12   pt-5 pb-6">

                            <>

                                {Boolean(legalname !== 'notfound') ? <>
                                    <div className={'text-center'}>
                                        <img style={{borderRadius: 10, width: 100}} className="img-fluid"
                                             src={`https://${logo?.download_url}`}
                                        />
                                    </div>

                                    <div className="section-heading section-heading--center">
                                        <h2
                                            className="__title text-white">
                                            <div
                                                style={{color: '#ffdb00'}}>{legalname}</div>
                                        </h2>
                                        {Boolean(tablename) && <h6 className="__subtitle text-white"> {tablename} </h6>}
                                    </div>

                                    <>

                                        {!isEmpty(location) && <div className={'px-5'}>
                                            {
                                                Object.keys(location).map((key) => {
                                                    const {name, address1, address2, city} = location[key]
                                                    return <div key={key} className={'mb-2'}>
                                                        <div onClick={() => {

                                                            navigate(`/location/${key}`)
                                                        }} className={'text-white border p-3'}
                                                             style={{borderRadius: 5}}>
                                                            <h5 className={'text-white'}>{name}</h5>
                                                            <small>{address1} {address2} {city}</small>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>}

                                    </>


                                    {isEmpty(location) && <div className={'text-center'}>
                                        <button className="custom-btn custom-btn--medium custom-btn--style-4"
                                                onClick={() => {

                                                    navigate(`/location/${locationid}`)
                                                }} type="button" role="button">
                                            Explore Menu
                                        </button>
                                    </div>}
                                </> : <>
                                    <div className="section-heading section-heading--center">
                                        <h4
                                            className="__title text-white">Opps! <div
                                            style={{color: '#ff0000'}}>Something went wrong</div></h4>
                                    </div>
                                </>}

                            </>

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
