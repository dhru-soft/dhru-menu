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
import Feedback from "../pages/Feedback";
import Addresses from "../pages/Client/Addresses";
import MyOrders from "../pages/Client/MyOrders";
import AllItems from "../pages/Items/AllItems";

class RouterComponent extends Component {

    render() {
        return (<Fragment>
            <Routes >
                <Route exact path="/" element={<Home />}/>
                <Route exact path="/qrcode/:accesscode" element={<Restaurant />} />
                {/*<Route exact path="/login" element={<Login />} />*/}
                <Route exact path="/feedback/:feedbackid" element={<Feedback />} />
                <Route exact path="/l/:locationid/myorders" element={<MyOrders />} />
                <Route exact path="/l/:locationid" element={<Groups />}/>

                <Route exact path="/l/:locationid/t/:tableid" element={<AllItems />}/>

                <Route exact path="/l/:locationid/t/:tableid/g/:groupid" element={<AllItems />}/> {/*<Items />*/}
                <Route exact path="/l/:locationid/t/:tableid/cartdetail" element={<CartDetail />} />
            </Routes>
        </Fragment>)
    }
}
const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(RouterComponent);
