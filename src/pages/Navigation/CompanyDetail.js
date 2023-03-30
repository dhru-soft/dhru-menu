import React from "react";
import {getCompanyDetails} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";


const Index = ({clientDetail}) => {

    const dispatch = useDispatch()
    const {clientname, displayname, token} = clientDetail;
    let {tablename, locationname, address1, address2, download_url} = getCompanyDetails();


    return (
        <div className="container p-0">

            <div className={'p-4 border-bottom  company-detail'}
                 style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <div className={'bg-white p-4 rounded-5'}>
                    <div className={'d-flex justify-content-between'}>

                        <div>

                            {Boolean(clientname || displayname) &&
                                <div className={'mb-2'} style={{fontWeight: 'bold'}}>{clientname || displayname}</div>}

                            <div>
                                <h4>{locationname}</h4>
                                <small>{address1} {address2}</small>
                            </div>

                            {tablename && <div className={'mt-3'}>
                                Table : {tablename}
                            </div>}


                            {Boolean(token) && <div className={'mt-3 text-muted cursor-pointer'} onClick={() => {
                                dispatch(setClientDetail({}))
                            }}>
                                Logout
                            </div>}

                        </div>

                        <div className={'text-center'}>
                            {Boolean(download_url) &&
                                <img style={{width: 50}} className="img-fluid" src={`https://${download_url}`}/>}
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
