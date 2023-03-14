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

    const {groupids, searchitem} = props


    return (
        <section>

            <Init/>

            <div className="">

                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">


                            <CartTotal/>

                        </div>


                    </div>

                </div>

            </div>

        </section>
    )
}


export default  Index;

