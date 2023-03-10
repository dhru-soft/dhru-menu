import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {NavLink} from "reactstrap";

const Index = (props) => {

    let {restaurantDetail,locationid,restaurantDetail:{logo:{download_url},tabledetail:{tablename,locationname,address1,address2,}}} = props;

    console.log('restaurantDetail',restaurantDetail)

    if(!Boolean(locationname) && Boolean(restaurantDetail?.legalname)){
        const {address1 : ad1,address2 : ad2,name} = restaurantDetail?.location[locationid];
        download_url = restaurantDetail.logo.download_url;
        locationname = name;
        address1 = ad1;
        address2 = ad2;
    }


        return (
            <Fragment>

                <div className={'p-4 border-bottom company-detail'} style={{borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                    <div className={'bg-white p-4 rounded-5'}>
                        <div className={'d-flex justify-content-between'}>

                            <div>

                            <div>
                                <h4>{locationname}</h4>
                                <small>{address1} {address2}</small>
                            </div>

                            {tablename &&  <div className={'mt-3'}>
                               Table :  {tablename}
                            </div>}

                            </div>

                            <div className={'text-center'}>
                                {download_url &&  <img style={{width: 50}} className="img-fluid"
                                                       src={`https://${download_url}`} />}
                            </div>

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
