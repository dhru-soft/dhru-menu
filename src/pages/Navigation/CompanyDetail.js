import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {NavLink} from "reactstrap";
import {useParams} from "react-router-dom";
import {device} from "../../lib/static";

const Index = ({company}) => {



    let {tablename,locationname,address1,address2,download_url} = company;

        return (
            <div className="container p-0">

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
                                {Boolean(download_url) &&  <img style={{width: 50}} className="img-fluid"
                                                       src={`https://${download_url}`} />}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );

}



export default  Index;
