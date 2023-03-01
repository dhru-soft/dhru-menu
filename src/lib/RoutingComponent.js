import React, {Component,Fragment} from "react";
import {connect} from "react-redux";
import {Routes,Route} from "react-router-dom";

import Home from "../pages/Home/index";
import Restaurant from "../pages/Restaurant";
import ItemList from "../pages/ItemList";
import GroupList from "../pages/GroupList";

class RouterComponent extends Component {

    render() {
        return (<Fragment>
            <Routes >
                <Route exact path="/" element={<Home />}/>

                <Route exact path="/:accesscode" element={<Restaurant />} />
                <Route exact path="/groups/:locationid" element={<GroupList/>}/>
                <Route exact path="/items/:locationid/:groupid" element={<ItemList/>}/>

                {/*<Route path="/" exact={true} render={(props) => { return <Home key={props.match.url}   {...props}/>;}}/>
                <Route path="/:accesscode" exact={true} render={(props) => {return <Restaurant key={props.match.url}   {...props}/>;}}/>
                <Route path="/:locationid/items" exact={true} render={(props) => {return <ItemList key={props.match.url}   {...props}/>;}}/>*/}
            </Routes>
        </Fragment>)
    }
}
const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(RouterComponent);
