import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";

import Search from "./Search";
import Diet from "./Diet";
import Bredcrumb from "./Bredcrumb";
import {device} from "../../lib/static";
import SubGroups from "./SubGroups";
import {getCompanyDetails} from "../../lib/functions";
import {useNavigate} from "react-router-dom";



const Index = (props) => {

    const {industrytype} = props

    let { locationname } = getCompanyDetails();
    const navigate = useNavigate();

    const stickyHeader = useRef()
    useLayoutEffect(() => {
        const mainHeader = document.getElementById('mainHeader')
        const blankHeader = document.getElementById('blankHeader')
        let fixedTop = stickyHeader.current.offsetTop
        const fixedHeader = () => {
            if (window.pageYOffset > fixedTop) {
                mainHeader.classList.add('fixedTop')
                blankHeader.classList.add('blankHeader')
            } else {
                mainHeader.classList.remove('fixedTop')
                blankHeader.classList.remove('blankHeader')
            }
        }
        window.addEventListener('scroll', fixedHeader)
    }, [])


    return (
        <>
            <div className={'mainHeader'}  id="mainHeader" ref={stickyHeader}>
                <div className={'supported'}>
                    <div className={'bg-white '}>
                        <div className={'onscroll-show d-none align-items-center'}>
                            <div style={{cursor: 'pointer',}} className={'p-4'} onClick={() => {
                                navigate(`/`);
                            }}>
                                <i className="fa fa-arrow-left"></i>
                            </div>

                            <h5 className={'p-3 m-0'}>
                                <div style={{fontWeight:"normal",color:'#888'}}>{locationname}</div>
                                Menu
                            </h5>

                        </div>
                        <div>
                            <Diet hidetag={!Boolean(industrytype === 'foodservices')}/>
                        </div>
                    </div>
                    {/*<Bredcrumb/>*/}
                </div>
            </div>

            <div id={"blankHeader"}>

            </div>

            <SubGroups/>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData,
        industrytype: state.restaurantDetail?.location[device.locationid]?.industrytype
    }
}

export default connect(mapStateToProps)(Index);

