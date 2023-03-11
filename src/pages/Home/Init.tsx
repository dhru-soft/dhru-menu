import React from "react";
import {getInit, getWorkspaceName} from "../../lib/functions";
import {connect} from "react-redux";


const Index = (props: any) => {

    const legalname: any = props?.general?.legalname

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
        general: state.restaurantDetail?.general
    }
}

export default connect(mapStateToProps)(Index);
