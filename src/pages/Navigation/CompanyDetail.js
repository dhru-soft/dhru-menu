import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {NavLink} from "reactstrap";

const Index = (props) => {

     let {restaurantDetail,locationid,restaurantDetail:{logo:{download_url},tabledetail:{locationname,address1,address2,}}} = props;

    if(!Boolean(locationname)){
        const {address1 : ad1,address2 : ad2,name} = restaurantDetail.location[locationid];
        download_url = restaurantDetail.logo.download_url;
        locationname = name;
        address1 = ad1;
        address2 = ad2;
    }


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
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);
