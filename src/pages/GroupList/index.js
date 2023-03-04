import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import Avatar from "../../components/Avatar"
import {useNavigate, useParams} from "react-router-dom";
import apiService from "../../lib/api-service";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";

import {checkLocation, isEmpty} from "../../lib/functions";
import Groups from "./Groups";
import {setGroupList} from "../../lib/redux-store/reducer/group-list";

import CompanyDetail from "../Navigation/CompanyDetail";
import ItemList from "../ItemList";
import Filters from "../ItemList/Filters";



const Index = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [groups,setGroups] = useState({})

    const {workspace,groupids,locationid} = props;


    const getGroups = async () => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: {locationid: locationid},
            workspace: workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                const {itemgroup} = result?.data;
                setGroups(itemgroup)
                dispatch(setGroupList(itemgroup))
            }
        });
    }

    useEffect(() => {
        if(checkLocation()) {
            getGroups().then()
        }
        else{
            navigate('/')
        }
    }, [])

    if(isEmpty(groups)){
        return <></>
    }


        return (
            <section>

                <div  className="container-fluide">

                    <CompanyDetail/>


                    <div className={'col-12'}>


                        <div>
                            <div className="container">

                                <Filters  />



                                {!Boolean(groupids) &&  <div>
                                    <Groups/>
                                </div>}


                                {Boolean(groupids) &&  <div>
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
        workspace: state.restaurantDetail.workspace,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

