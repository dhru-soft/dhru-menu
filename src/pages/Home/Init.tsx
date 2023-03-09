import React from "react";
import {getInit, getWorkspaceName} from "../../lib/functions";
import {connect} from "react-redux";


const Index = (props: any) => {

    const {restaurantDetail} = props

    const {legalname}: any = restaurantDetail

    if (!Boolean(legalname)) {
        getInit(getWorkspaceName()).then()
    }

    return (
        <>
            <div></div>
        </>
    )
}


const mapStateToProps = (state: any) => {
    return {
        restaurantDetail: state.restaurantDetail
    }
}

export default connect(mapStateToProps)(Index);
