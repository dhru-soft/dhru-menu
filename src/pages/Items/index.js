import React from "react";
import {connect} from "react-redux";


import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Search from "../Cart/Search";
import Bredcrumb from "../Cart/Bredcrumb";
import Diet from "../Cart/Diet";
import {useParams} from "react-router-dom";
import Init from "../Home/Init";
import {device} from "../../lib/static";
import CartTotal from "../Cart/CartTotal";
import StickyBox, {useStickyBox} from "react-sticky-box";

const Index = (props) => {



    return (
        <section>

            <Init/>

            <div className="">

                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div style={{display:'flex'}}>
                                <div >
                                    <div className={'bg-white p-4 rounded-4 mt-3'}>
                                        <StickyBox offsetTop={20} offsetBottom={20}>
                                            <div>
                                                <Search/>
                                                <Diet/>
                                            </div>
                                        </StickyBox>
                                    </div>

                                    <Bredcrumb/>

                                    <ItemList/>

                                </div>
                            </div>


                            <CartTotal  page={'detailview'}/>

                        </div>


                    </div>

                </div>

            </div>

        </section>
    )
}



export default  Index;

