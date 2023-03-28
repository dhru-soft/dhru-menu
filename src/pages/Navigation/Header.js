import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {NavLink} from "reactstrap";

export class Header extends Component {


    render() {

        const {page, breadcrumb} = this.props;

        return (
            <Fragment>




            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
