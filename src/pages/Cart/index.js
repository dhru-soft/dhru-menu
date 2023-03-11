import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Search from "./Search";
import Bredcrumb from "./Bredcrumb";
import Diet from "./Diet";
import {useParams} from "react-router-dom";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import Init from "../Home/Init";
import {device} from "../../lib/static";
import {numberFormat} from "../../lib/functions";
import CartTotal from "./CartTotal";

const Index = (props) => {

    const params = useParams()

    device.locationid = params?.locationid;


    const {groupids, searchitem} = props


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
                                    <Diet/>
                                </div>
                            </div>

                            <Bredcrumb/>

                            {(!Boolean(groupids)  && !Boolean(searchitem)) ? <div>
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
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

