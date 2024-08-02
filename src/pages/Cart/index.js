import React from "react";
import {connect} from "react-redux";
import Groups from "../Groups/GroupsbyLocation";

import CompanyDetail from "../Navigation/CompanyDetail";
import ItemsbyGroupList from "../Items/ItemsbyGroup";
import Search from "./Search";
import Bredcrumb from "./Bredcrumb";
import Diet from "./Diet";
import Init from "../Home/Init";
import CartTotal from "./CartTotal";

const Index = (props) => {


    let {groupids, searchitem} = props;

    return (
        <section>

            <div className="">

                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div>
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
                                    <ItemsbyGroupList/>
                                </div>}

                            </div>


                            <CartTotal page={'detailview'}/>

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

