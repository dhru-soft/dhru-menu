import React from "react";


import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Init from "../Home/Init";
import CartTotal from "../Cart/CartTotal";
import CartHeader from "../Cart/CartHeader";

const Index = (props) => {


    return (
        <section>

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

        </section>
    )
}


export default Index;

