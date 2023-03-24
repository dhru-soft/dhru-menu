import React, {Component,Fragment} from "react";
import {connect} from "react-redux";
import {Routes,Route} from "react-router-dom";

import Home from "../pages/Home/index";
import Restaurant from "../pages/Restaurant";

import Cart from "../pages/Cart";
import CartDetail from "../pages/Cart/CartDetail";
import Login from "../pages/Login";
import Groups from "../pages/Groups";
import Items from "../pages/Items";

class RouterComponent extends Component {

    render() {
        return (<Fragment>
            <Routes >
                <Route exact path="/" element={<Home />}/>
                <Route exact path="/qrcode/:accesscode" element={<Restaurant />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/l/:locationid" element={<Groups />}/>
                <Route exact path="/l/:locationid/t/:tableid" element={<Groups />}/>
                <Route exact path="/l/:locationid/t/:tableid/g/:groupid" element={<Items />}/>
                <Route exact path="/l/:locationid/t/:tableid/cartdetail" element={<CartDetail />} />
            </Routes>
        </Fragment>)
    }
}
const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(RouterComponent);
