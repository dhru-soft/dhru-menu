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
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";

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
        <div className="container p-0">

            <div className={'p-4 border-bottom  company-detail'}
                 style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <div className={'bg-white p-4 rounded-5'}>
                    <div className={' justify-content-between align-items-center'}>

                        <div  className={'row'}>



                            <div className={'col-lg-6'}>
                                <div className={'d-flex align-items-center'}>
                                    <div>
                                        <span style={{cursor: 'pointer', padding: 5,marginRight:10}} onClick={() => {
                                            navigate(`/`);
                                        }}>
                                            <i className="fa fa-arrow-left"></i>
                                        </span>
                                    </div>
                                    <Dropdown isOpen={dropdownOpen} size={'xl'} group toggle={toggle} style={{border:'#ccc solid 1px',padding:'0px 10px'}}  >
                                        <DropdownToggle className={''} style={{

                                            background: 'none',
                                            color: 'black',
                                            border: 'none',
                                            display:'flex',
                                            flexWrap:'nowrap',
                                            alignItems:'center',
                                            textAlign:'left'
                                        }}>
                                            <div>
                                                {Boolean(locationimage) ?  <img src={`https://${locationimage}`} alt={'Location Image'} className="img-fluid" style={{width: 50}} /> :
                                                    Boolean(download_url) ?
                                                        <img style={{width: 50}} alt={''} className="img-fluid" src={`https://${download_url}`}/> : ''}
                                            </div>
                                            <div>
                                                <div style={{fontSize: 20,}}> {company || locationname} </div>
                                                {!Boolean(company) && <small>{address1} {address2}</small>}
                                            </div>
                                            <div>
                                                <i className={`fa fa-chevron-down`} style={{fontSize:12,marginLeft:10,color:'#222'}}></i>
                                            </div>

                                        </DropdownToggle>

                                        <DropdownMenu>
                                            {
                                                Object.keys(location).map((key)=>{
                                                    return <DropdownItem onClick={()=>{
                                                        changeHandler(key)
                                                    }} key={key} style={{fontSize:18}}>{location[key].name}</DropdownItem>

                                                })}

                                        </DropdownMenu>
                                    </Dropdown>
                                </div>



                                {/*<Select options={Object.keys(location).map((key)=>{
                                    return {label:location[key].name,value:key}
                                })} defaultValue={device.locationid} onChange={changeHandler} className={'react-select'}/>*/}


                            </div>


                            <div style={{textAlign:'right'}}  className={'col-lg-6'}>

                                {Boolean(clientname || displayname) && <div className={'mb-2'} style={{fontWeight: 'bold'}}>{clientname || displayname}</div>}

                                {tablename && <div className={'mt-3'}> Table : {tablename} </div>}

                                <div className={'d-flex justify-content-end'}>

                                    {Boolean(token) ? <>

                                            <div className={'mt-3 text-muted cursor-pointer  pe-3'} onClick={() => {
                                                navigate(`/l/${device.locationid}/t/${device.tableid || 0}`);
                                            }}>
                                                New Order
                                            </div>

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

                                    <div className={'mt-3 text-muted cursor-pointer  '} onClick={() => {
                                        dispatch(setClientDetail({}));
                                        navigate(`/`);
                                    }}>
                                        Logout
                                    </div>

                                    </> :

                                    <>
                                        <div className={'mt-3 text-muted cursor-pointer '} onClick={() => {
                                            placeOrder()
                                        }}>
                                            Login
                                        </div>
                                    </>

                                    }

                                </div>

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
