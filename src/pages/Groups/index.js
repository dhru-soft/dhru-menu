import React, {useRef} from "react";
import {connect} from "react-redux";
import Groups from "./GroupsbyLocation";

import CompanyDetail from "../Navigation/CompanyDetail";
import Init from "../Home/Init";
import CartTotal from "../Cart/CartTotal";
import ItemsbyGroupList from "../Items/ItemsbyGroup";
import CartHeader from "../Cart/CartHeader";
import BodyClassName from 'react-body-classname';
import Theme from "../Home/Theme";


const Index = (props) => {

    let {searchitem} = props;

    const refGroups = useRef();

    return (<BodyClassName className="groups">
        <section>
            <Theme/>

            <div className="">
                <CompanyDetail/>
                <div className={'col-12'}>
                    <div>
                        <div className="container">
                            <div>
                                <CartHeader/>

                                {(!Boolean(searchitem)) ? <Groups ref={refGroups} /> : <ItemsbyGroupList refGroups={refGroups}/>}
                            </div>
                            <CartTotal page={'detailview'}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </BodyClassName>)
}


const mapStateToProps = (state) => {
    return {
        searchitem: state.selectedData.searchitem,
    }
}

export default connect(mapStateToProps)(Index);

