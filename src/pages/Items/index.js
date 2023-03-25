import React, {useEffect} from "react";


import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Init from "../Home/Init";
import CartTotal from "../Cart/CartTotal";
import CartHeader from "../Cart/CartHeader";
import {useHistory, useParams} from "react-router-dom";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {connect} from "react-redux";

const Index = (props) => {


    return (
        <section >

            <Init/>

            <div className="">


                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div>

                                <div>
                                    <CartHeader/>

                                    <ItemList/>
                                </div>

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
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

