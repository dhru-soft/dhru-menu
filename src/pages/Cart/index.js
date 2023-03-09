import React from "react";
import {connect} from "react-redux";
import Groups from "./Groups";

import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "./Items";
import Search from "./Search";
import Bredcrumb from "./Bredcrumb";
import Tags from "./Tags";


const Index = (props) => {

    console.log('props',props)

    const {groupids, selectedtags, searchitem} = props


    return (
        <section>

            <div className="container-fluide">

                <CompanyDetail/>

                <div className={'col-12'}>

                    <div>
                        <div className="container">

                            <div className={'d-flex justify-content-between'}>
                                <Search/>

                                <Tags/>
                            </div>

                            <Bredcrumb/>

                            {(!Boolean(groupids) && !Boolean(selectedtags) && !Boolean(searchitem)) ? <div>
                                <Groups/>
                            </div> : <div>
                                <ItemList/>
                            </div>}


                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

const mapStateToProps = (state) => {
    return {
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

