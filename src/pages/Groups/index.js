import React, {useEffect} from "react";
import {connect} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";
import Init from "../Home/Init";
import CartTotal from "../Cart/CartTotal";
import ItemList from "../Items/Items";
import CartHeader from "../Cart/CartHeader";
import BodyClassName from 'react-body-classname';
import Theme from "../Home/Theme";
import Footer from "../Navigation/Footer";

const Index = (props) => {

    let {searchitem} = props;



    return (
        <BodyClassName className="groups">
            <section>

                <Theme/>

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

                <Footer/>
        </section>
        </BodyClassName>
    )
}


const mapStateToProps = (state) => {
    return {
        searchitem : state.selectedData.searchitem,
    }
}

export default connect(mapStateToProps)(Index);

