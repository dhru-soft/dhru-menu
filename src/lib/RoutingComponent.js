import React, {Component,Fragment} from "react";
import {connect} from "react-redux";
import {Routes,Route} from "react-router-dom";

import Home from "../pages/Home/index";
import Restaurant from "../pages/Restaurant";

import Cart from "../pages/Cart";

class RouterComponent extends Component {

    render() {
        return (<Fragment>
            <Routes >
                <Route exact path="/" element={<Home />}/>
                <Route exact path="/qrcode/:accesscode" element={<Restaurant />} />
                <Route exact path="/groups" element={<Cart/>}/>

            </Routes>
        </Fragment>)
    }
}
const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(RouterComponent);
