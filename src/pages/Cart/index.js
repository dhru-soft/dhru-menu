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

