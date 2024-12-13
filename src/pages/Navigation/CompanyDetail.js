import React, {useState} from "react";
import {getCompanyDetails} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import Addresses from "../Client/Addresses";
import {device} from "../../lib/static";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "reactstrap";
import {useModal} from "../../use/useModal";
import Banner from "../Banner";

const Index = ({clientDetail, company, options}) => {


    const params2 = useParams()


    device.tableid = params2?.tableid;
    device.locationid = params2?.locationid;
    device.groupid = params2?.groupid;

    const dispatch = useDispatch();
    const {openModal} = useModal()
    const navigate = useNavigate();
    const {clientname, displayname, token} = clientDetail;

    let {
        tablename,
        locationimage,
        locationname,
        location,
        address1,
        address2,
        download_url,
        industrytype
    } = getCompanyDetails();


    const showAddresses = () => {
        openModal({
            show: true, title: '',backdrop:true, height: '80%', component: () => <><Addresses/></>
        })
    }

    const changeHandler = (item) => {
        device.locationid = item
        navigate(`/l/${device.locationid}/t/${device.tableid || 0}`);
    }

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);


    return (<div>

            <Card className={'container company-detail  border-0 mb-3'}>
                <div>
                    <div className={'row justify-content-between align-items-center p-3'}>


                        <div className={''}>

                            <div className={'d-flex justify-content-between p-3'}>
                                <div style={{cursor: 'pointer',}} onClick={() => {
                                    navigate(`/`); //test
                                }}>
                                    <i className="fa fa-arrow-left"></i>
                                </div>

                                <div style={{cursor: 'pointer',}}>
                                    <i className="fa fa-phone"></i>
                                </div>

                            </div>

                            <div>


                                {/* <div style={{width: 150,}}>
                                    {Boolean(locationimage) ?
                                        <img src={`https://${locationimage}`} alt={'Location Image'}
                                             className="img-fluid" style={{ borderRadius: 10}}/> :
                                        Boolean(download_url) ?
                                            <img style={{ borderRadius: 10}} alt={''} className="img-fluid"
                                                 src={`https://${download_url}`}/> : ''}
                                </div>*/}


                                <div className={'mt-4'}>

                                    {(Object.keys(options).length === 1) && industrytype === 'foodservices' && <span
                                        style={{color: "#2B7B3C", background: '#EAFFF0', borderRadius: 5, padding: 5}}>
                                        <small className={'px-2 py-1   radius-5px'}> <i className={`fa fa-leaf`}></i> Pure Veg </small>
                                    </span>}

                                    <div className={'row justify-content-between py-4 px-2'}
                                         style={{color: '#2B3443',}}>


                                        <div className={'col-10'}>
                                            <div style={{
                                                fontSize: 24, fontWeight: 'bold',

                                            }}> {company || locationname} </div>
                                            {!Boolean(company) && <div style={{fontSize: 15}}
                                                                       className={'py-2'}>{address1} {address2}</div>}
                                        </div>

                                        <div className={'col-2 text-align-right'}><span
                                            className={'px-2 py-1 text-white radius-5px'}
                                            style={{background: '#2B7B3C',whiteSpace:'nowrap'}}> 4.9 <i
                                            style={{fontSize: 12}}
                                            className={`fa fa-star`}></i>   </span>
                                        </div>
                                    </div>

                                </div>



                            </div>

                        </div>



                    </div>
                </div>
            </Card>

        <Banner/>

        </div>);

}


const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail, options: state.restaurantDetail?.settings?.options
    }
}

export default connect(mapStateToProps)(Index);
