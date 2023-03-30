import React, {useEffect} from "react";


import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Init from "../Home/Init";
import CartTotal from "../Cart/CartTotal";
import CartHeader from "../Cart/CartHeader";
import BodyClassName from 'react-body-classname';
import Theme from "../Home/Theme";
import Footer from "../Navigation/Footer";


const Index = (props) => {


    return (
        <BodyClassName className="items">
            <section >
             <Theme/>
            <Init/>

            <div className="">


                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div>
                                <div>
                                    <CartHeader/>
                                    <ItemList/>
                                </div>
                            </div>


                            <CartTotal page={'detailview'}/>

                        </div>


                    </div>

                </div>

            </div>
                <Footer/>
        </section>
        </BodyClassName>
    )
}




export default  Index;

