import React, {useState} from "react";
import {getCompanyDetails} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import Addresses from "../Client/Addresses";
import {device} from "../../lib/static";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "reactstrap";
import {useModal} from "../../use/useModal";

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
            show: true, title: '', height: '80%', component: () => <><Addresses/></>
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
                                    navigate(`/`);
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
                                        <small className={'px-2 py-1   radius-5px'}> <i className={`fa fa-leaf`}></i> Pure Veg  </small>
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
                                            style={{background: '#2B7B3C'}}> 4.9 <i
                                            style={{fontSize: 12}}
                                            className={`fa fa-star`}></i>   </span>
                                        </div>
                                    </div>

                                </div>


                                {/*<Dropdown isOpen={dropdownOpen} size={'xl'} group toggle={toggle}
                                >
                                    <DropdownToggle className={''} style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        alignItems: 'start',
                                        textAlign: 'left'
                                    }}>


                                        <div>

                                        </div>

                                    </DropdownToggle>

                                    <DropdownMenu>
                                        {
                                            Object.keys(location).map((key) => {
                                                return <DropdownItem onClick={() => {
                                                    changeHandler(key)
                                                }} key={key} style={{fontSize: 18}}>{location[key].name}</DropdownItem>

                                            })}

                                    </DropdownMenu>
                                </Dropdown>*/}


                            </div>


                            {/*<Select options={Object.keys(location).map((key)=>{
                                    return {label:location[key].name,value:key}
                                })} defaultValue={device.locationid} onChange={changeHandler} className={'react-select'}/>*/}


                        </div>


                        {/*<div className={'col-lg-6  col-sm-12  p-3 pb-1 p-sm-4 p-md-2'}>

                            {Boolean(clientname || displayname) &&
                                <div style={{fontWeight: 'bold'}}
                                     className={'mb-2 d-flex justify-content-lg-end'}>Welcome, {clientname || displayname} !</div>}

                            {tablename &&
                                <div className={'mt-3 mb-2 d-flex justify-content-lg-end'}> Table : {tablename} </div>}

                            <div className={'d-flex justify-content-lg-end'}>

                                {Boolean(token) ? <>

                                        <Button className={'me-2 btn-warning'} onClick={() => {
                                            navigate(`/l/${device.locationid}/t/${device.tableid || 0}`);
                                        }}>
                                            New Order
                                        </Button>

                                        <Button className={'me-2'}    onClick={() => {
                                            navigate(`/l/${device.locationid}/myorders`);
                                        }}>
                                            My Orders
                                        </Button>
                                        <Button  className={'me-2'}   onClick={() => {
                                            showAddresses()
                                        }}>
                                            Shipping Address
                                        </Button>

                                        <Button  className={'btn-danger'}  onClick={() => {
                                            dispatch(setClientDetail({}));
                                            navigate(`/`);
                                        }}>
                                            Logout
                                        </Button>

                                    </> :

                                    <>
                                        <Button  onClick={() => {
                                            placeOrder()
                                        }}>
                                            Login
                                        </Button>
                                    </>

                                }

                            </div>

                        </div>*/}

                    </div>
                </div>
            </Card>

        </div>);

}


const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail, options: state.restaurantDetail?.settings?.options
    }
}

export default connect(mapStateToProps)(Index);
