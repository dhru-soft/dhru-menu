import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";

import Search from "./Search";
import Diet from "./Diet";
import Bredcrumb from "./Bredcrumb";
import {device} from "../../lib/static";
import SubGroups from "./SubGroups";



const Index = (props) => {

    const {industrytype} = props

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
                <div className={'supported  pt-3'}>
                    <div className={'bg-white p-4 rounded-4 shadow'} >
                        <div>
                            <Search/>
                            <Diet hidetag={!Boolean(industrytype === 'foodservices')}/>
                        </div>
                    </div>
                    <Bredcrumb/>
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
        industrytype : state.restaurantDetail?.location[device.locationid]?.industrytype
    }
}

export default connect(mapStateToProps)(Index);

