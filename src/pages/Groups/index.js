import React from "react";
import {connect} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";
import Init from "../Home/Init";
import CartTotal from "../Cart/CartTotal";
import ItemList from "../Items/Items";
import CartHeader from "../Cart/CartHeader";

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

                            <div>

                                <CartHeader/>

                                {(!Boolean(searchitem)) ? <Groups/> : <ItemList/>}

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
        searchitem : state.selectedData.searchitem,
    }
}

export default connect(mapStateToProps)(Index);

