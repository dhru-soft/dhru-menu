import React from "react";
import {connect} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Search from "./Search";
import Bredcrumb from "./Bredcrumb";
import Diet from "./Diet";
import {useParams} from "react-router-dom";
import Init from "../Home/Init";
import {device} from "../../lib/static";
import CartTotal from "./CartTotal";

const Index = (props) => {

    const params = useParams()

    device.locationid = params?.locationid;

    let {groupids, searchitem,restaurantDetail:{general,location,tabledetail:{tablename,locationname,address1,address2,order}}} = props;
    const download_url = general?.logo?.download_url || ''

    if(!Boolean(locationname) && Boolean(general?.legalname)){
        const {address1 : ad1,address2 : ad2,name,order : ord} = location[device?.locationid];
        locationname = name;
        address1 = ad1;
        address2 = ad2;
        order = ord
    }
    device.order = order;


    return (
        <section>

            <Init/>

            <div className="">

                <CompanyDetail company={{download_url,locationname,address1,address2,tablename}}/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div className={'bg-white p-4 rounded-4 mt-3'}>
                                <div>
                                    <Search/>
                                    <Diet/>
                                </div>
                            </div>

                            <Bredcrumb/>

                            {(!Boolean(groupids) && !Boolean(searchitem)) ? <div>
                                <Groups/>
                            </div> : <div>
                                <ItemList/>
                            </div>}


                            <CartTotal/>

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
        ...state.selectedData,
    }
}

export default connect(mapStateToProps)(Index);

