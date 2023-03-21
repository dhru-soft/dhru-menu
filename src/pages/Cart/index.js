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

    const queryParameters = new URLSearchParams(window.location.search)
    const table = queryParameters.get("table")

    device.locationid = params?.locationid;
    device.tableid = table;

    let {groupids, searchitem} = props;

    return (
        <section>

            <Init/>

            <div className="">

                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div >
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
                            </div>


                            <CartTotal  page={'detailview'}/>

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

