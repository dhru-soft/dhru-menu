import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";

import Search from "./Search";
import Diet from "./Diet";
import Bredcrumb from "./Bredcrumb";



const Index = (props) => {


    const stickyHeader = useRef()
    useLayoutEffect(() => {
        const mainHeader = document.getElementById('mainHeader')
        let fixedTop = stickyHeader.current.offsetTop
        const fixedHeader = () => {
            if (window.pageYOffset > fixedTop) {
                mainHeader.classList.add('fixedTop')
            } else {
                mainHeader.classList.remove('fixedTop')
            }
        }
        window.addEventListener('scroll', fixedHeader)
    }, [])


    return (
        <>

            <div className={'mainHeader'}  id="mainHeader" ref={stickyHeader}>

                <div className={'bg-white p-4 rounded-4'} >
                    <div>
                        <Search/>
                        <Diet/>
                    </div>
                </div>

            </div>

            <Bredcrumb/>

        </>
    )
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData,
    }
}

export default connect(mapStateToProps)(Index);

