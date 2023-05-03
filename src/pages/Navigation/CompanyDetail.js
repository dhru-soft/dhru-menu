import React from "react";
import {getCompanyDetails} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import Addresses from "../Client/Addresses";
import {device} from "../../lib/static";
import {useNavigate} from "react-router-dom";


const Index = ({clientDetail,company}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {clientname, displayname, token} = clientDetail;
    let {tablename, locationname, address1, address2, download_url} = getCompanyDetails();


    const showAddresses = () => {
        store.dispatch(setModal({
            show: true,
            title: '',
            height: '80%',
            component: () => <><Addresses/></>
        }))
    }



    return (
        <div className="container p-0">

            <div className={'p-4 border-bottom  company-detail'}
                 style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <div className={'bg-white p-4 rounded-5'}>
                    <div className={'d-flex justify-content-between align-items-center'}>

                        <div>

                            {Boolean(clientname || displayname) &&
                                <div className={'mb-2'} style={{fontWeight: 'bold'}}>{clientname || displayname}</div>}

                            <div>
                                <h4>{company || locationname}</h4>
                                {!Boolean(company) && <small>{address1} {address2}</small>}
                            </div>

                            {tablename && <div className={'mt-3'}>
                                Table : {tablename}
                            </div>}


                            {Boolean(token) &&
                                <div className={'d-flex'}>

                                    <div className={'mt-3 text-muted cursor-pointer  pe-3'} onClick={() => {
                                        navigate(`/l/${device.locationid}/myorders`);
                                    }}>
                                        My Orders
                                    </div>
                                    <div className={'mt-3 text-muted cursor-pointer  pe-3'} onClick={() => {
                                        showAddresses()
                                    }}>
                                        Shipping Address
                                    </div>

                                    <div className={'mt-3 text-muted cursor-pointer pe-3'} onClick={() => {
                                        dispatch(setClientDetail({}));
                                        navigate(`/`);
                                    }}>
                                        Logout
                                    </div>

                                </div>
                            }

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
