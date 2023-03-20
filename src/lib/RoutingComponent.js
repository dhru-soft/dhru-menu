import React, {Component,Fragment} from "react";
import {connect} from "react-redux";
import {Routes,Route} from "react-router-dom";

import Home from "../pages/Home/index";
import Restaurant from "../pages/Restaurant";

import Cart from "../pages/Cart";
import CartDetail from "../pages/Cart/CartDetail";
import Login from "../pages/Login";

class RouterComponent extends Component {

    render() {
        return (<Fragment>
            <Routes >
                <Route exact path="/" element={<Home />}/>
                <Route exact path="/qrcode/:accesscode" element={<Restaurant />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/location/:locationid" element={<Cart />}/>
                <Route exact path="/location/:locationid/cartdetail" element={<CartDetail />} />
            </Routes>
        </Fragment>)
    }
}
const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(RouterComponent);
