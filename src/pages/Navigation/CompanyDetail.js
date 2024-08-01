import React, {useState} from "react";
import {getCompanyDetails, placeOrder} from "../../lib/functions";
import {connect, useDispatch} from "react-redux";
import {setClientDetail} from "../../lib/redux-store/reducer/client-detail";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import Addresses from "../Client/Addresses";
import {device} from "../../lib/static";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import {Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";

const Index = ({clientDetail,company}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {clientname, displayname, token} = clientDetail;


    let {tablename,locationimage, locationname,location, address1, address2, download_url} = getCompanyDetails();


    const showAddresses = () => {
        store.dispatch(setModal({
            show: true,
            title: '',
            height: '80%',
            component: () => <><Addresses/></>
        }))
    }

    const changeHandler = (item) => {
        device.locationid = item
        navigate(`/l/${device.locationid}/t/${device.tableid || 0}`);
    }

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);


    return (
        <div className="p-0">

            <div className={'p-3   company-detail text-white'}
                 style={{borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                <div className={'p-lg-4 p-sm-2 rounded-4'}>
                    <div className={'row justify-content-between align-items-center'}>


                        <div className={'col-lg-6 col-sm-12'}>

                            <div>
                                        <div style={{cursor: 'pointer', padding: 10}} onClick={() => {
                                            navigate(`/`);
                                        }}>
                                            <i className="fa fa-arrow-left"></i>
                                        </div>
                            </div>

                            <div className={'d-flex align-items-center'}>


                                <div style={{width: 150,}}>
                                    {Boolean(locationimage) ?
                                        <img src={`https://${locationimage}`} alt={'Location Image'}
                                             className="img-fluid" style={{ borderRadius: 10}}/> :
                                        Boolean(download_url) ?
                                            <img style={{ borderRadius: 10}} alt={''} className="img-fluid"
                                                 src={`https://${download_url}`}/> : ''}
                                </div>


                                <Dropdown isOpen={dropdownOpen} size={'xl'} group toggle={toggle}
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
                                            <div className={'row justify-content-between'}>
                                                <div className={'col'}><i style={{color: "green"}}
                                                                          className={`fa fa-leaf`}></i> Pure
                                                    Veg
                                                </div>

                                                <div className={'col text-align-right'}><span className={'px-2 py-1 bg-success radius-5px'}> 4.9 <i style={{color: "white", fontSize: 12}}
                                                                          className={`fa fa-star`}></i>   </span>
                                                </div>
                                            </div>
                                            <div style={{fontSize: 20,}}> {company || locationname}
                                                <i className={`fa fa-chevron-down`}
                                                   style={{fontSize: 12, marginLeft: 10}}></i>
                                            </div>

                                            {!Boolean(company) && <small>{address1} {address2}</small>}
                                        </div>
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
                                </Dropdown>
                            </div>


                            {/*<Select options={Object.keys(location).map((key)=>{
                                    return {label:location[key].name,value:key}
                                })} defaultValue={device.locationid} onChange={changeHandler} className={'react-select'}/>*/}


                        </div>


                        <div className={'col-lg-6  col-sm-12  p-3 pb-1 p-sm-4 p-md-2'}>

                            {Boolean(clientname || displayname) &&
                                <div style={{fontWeight: 'bold'}}
                                     className={'mb-2 d-flex justify-content-lg-end'}>Welcome, {clientname || displayname} !</div>}

                            {tablename && <div className={'mt-3 mb-2 d-flex justify-content-lg-end'}> Table : {tablename} </div>}

                            <div className={'d-flex justify-content-lg-end'}>

                                {Boolean(token) ? <>

                                        <Button className={'me-2 btn-warning'}  onClick={() => {
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
