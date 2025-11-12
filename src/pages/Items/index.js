import React from "react";


import CompanyDetail from "../Navigation/CompanyDetail";
import ItemsbyGroupList from "./ItemsbyGroup";
import Init from "../Home/Init";
import CartTotal from "../Cart/CartTotal";
import CartHeader from "../Cart/CartHeader";
import BodyClassName from 'react-body-classname';
import Theme from "../Home/Theme";
import packageJson  from '../../../package.json';

console.log('version',packageJson.version)
const Index = (props) => {


    return (
        <BodyClassName className="items">
            <section >
             <Theme/>


            <div className="">


                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div>
                                <div>
                                    <CartHeader/>
                                    <ItemsbyGroupList/>
                                </div>
                            </div>

                            <CartTotal page={'detailview'}/>

                        </div>


                    </div>

                </div>

            </div>

        </section>
        </BodyClassName>
    )
}




export default  Index;

