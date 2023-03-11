import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Search from "./Search";
import Bredcrumb from "./Bredcrumb";
import Tags from "./Tags";
import {useParams} from "react-router-dom";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import Init from "../Home/Init";
import {device} from "../../lib/static";
import {numberFormat} from "../../lib/functions";

const Index = (props) => {

    const params = useParams()
    const dispatch = useDispatch()

    device.locationid = params?.locationid;
    //const {locationid} = props;


    /*useEffect(()=>{
        dispatch(setSelected({locationid: params.locationid}))
    },[locationid])*/

    /*if(!Boolean(locationid)){
        return <></>
    }*/


    const {groupids, selectedtags, searchitem} = props


    return (
        <section>

            <Init/>

            <div className="">

                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div className={'bg-white p-4 rounded-4 mt-3'}>
                                <div>
                                <Search/>

                                <Tags/>
                                </div>
                            </div>

                            <Bredcrumb/>

                            {(!Boolean(groupids)  && !Boolean(searchitem)) ? <div>
                                <Groups/>
                            </div> : <div>
                                <ItemList/>
                            </div>}


                            {/*<div>
                                <div className={'d-flex justify-content-between align-items-center rounded-3 bg-white py-3 px-4 mt-3'}>
                                    <div>
                                        <div><small className={'text-muted'}>Items : 10</small></div>
                                        <h4 className={'mb-0'}> {numberFormat(100)}</h4>
                                    </div>
                                    <div>
                                        <button className="w-100 custom-btn custom-btn--medium custom-btn--style-1" onClick={()=>{


                                        }} type="button" role="button">
                                            Place Order
                                        </button>
                                    </div>
                                </div>
                            </div>*/}

                        </div>



                    </div>

                </div>

            </div>

        </section>
    )
}

const mapStateToProps = (state) => {
    return {
        restaurantDetail: state.restaurantDetail,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

