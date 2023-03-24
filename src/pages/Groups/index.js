import React from "react";
import {connect} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";

import Search from "../Cart/Search";
import Bredcrumb from "../Cart/Bredcrumb";
import Diet from "../Cart/Diet";
import {useNavigate, useParams} from "react-router-dom";
import Init from "../Home/Init";
import {device} from "../../lib/static";
import CartTotal from "../Cart/CartTotal";
import ItemList from "../Items/Items";

const Index = (props) => {

    let {searchitem} = props;

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

                                <Bredcrumb />

                                {(!Boolean(searchitem)) ? <div>
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
        ...state.selectedData,
    }
}

export default connect(mapStateToProps)(Index);

