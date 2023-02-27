import React, {Component,Fragment} from "react";
import {connect} from "react-redux";
import {Route, withRouter} from "react-router-dom";

import Home from "../pages/Home/index";
import Restaurant from "../pages/Restaurant";
import ItemList from "../pages/ItemList";

class RouterComponent extends Component {

    render() {
        return (<Fragment>
            <Route path="/" exact={true} render={(props) => { return <Home key={props.match.url}   {...props}/>;}}/>
            <Route path="/:accesscode" exact={true} render={(props) => {return <Restaurant key={props.match.url}   {...props}/>;}}/>
            <Route path="/:locationid/items" exact={true} render={(props) => {return <ItemList key={props.match.url}   {...props}/>;}}/>
        </Fragment>)
    }
}
const mapStateToProps = (state) => ({

});

export default withRouter(connect(mapStateToProps)(RouterComponent));
