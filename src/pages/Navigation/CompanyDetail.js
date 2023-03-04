import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {NavLink} from "reactstrap";

const Index = (props) => {

        const {restaurantDetail:{logo:{download_url},tabledetail:{locationname,address1,address2,}}} = props;


        return (
            <Fragment>

                <div className={'p-4 border-bottom'}>
                    <div>
                        <div className={'text-center'}>
                            <img style={{width: 50}} className="img-fluid"
                                 src={`https://${download_url}`} />
                        </div>
                        <div  className={'text-center mt-3'}>
                            <h5>{locationname}</h5>
                            <small>{address1} {address2}</small>
                        </div>
                    </div>
                </div>

            </Fragment>
        );

}

const mapStateToProps = (state) => {
    return {
        restaurantDetail: state.restaurantDetail,
    }
}

export default connect(mapStateToProps)(Index);
