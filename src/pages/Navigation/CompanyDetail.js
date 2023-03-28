import React, {Component, Fragment} from "react";
import setBodyColor, {getCompanyDetails} from "../../lib/functions";
import {connect} from "react-redux";
import {device} from "../../lib/static";
import applyTheme from "../../lib/functions";


const Index = ({clientDetail}) => {

    const {clientname,displayname} = clientDetail;
    let {tablename,locationname,address1,address2,download_url} = getCompanyDetails();
    const themecolor = device?.order?.themecolor || '#5C933F'

    applyTheme({
        '--bodyColor': `${themecolor}10`,
        '--bs-border-color':`${themecolor}20`,
        '--cartTotalColor':`${themecolor}`,
        '--dashed-border':`${themecolor}40`,
        '--text-muted':`${themecolor}90`,
        '--btn-color':`${themecolor}`,
        '--textbox-border':`#dddddd`,
        '--item-hover':`${themecolor}10`,
    })

    return (
            <div className="container p-0">

                <div className={'p-4 border-bottom mb-3'} style={{borderBottomLeftRadius:20,borderBottomRightRadius:20,backgroundColor:themecolor}}>
                    <div className={'bg-white p-4 rounded-5'}>
                        <div className={'d-flex justify-content-between'}>

                            <div>

                                {Boolean(clientname || displayname) &&  <div className={'mb-2'} style={{color:themecolor,fontWeight:'bold'}}>{clientname || displayname}</div>}

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



const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail,
    }
}

export default connect(mapStateToProps)(Index);
