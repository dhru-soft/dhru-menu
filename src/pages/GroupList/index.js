import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import Avatar from "../../components/Avatar"
import {useNavigate, useParams} from "react-router-dom";
import apiService from "../../lib/api-service";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";

import {isEmpty} from "../../lib/functions";
import Groups from "./Groups";
import {setGroupList} from "../../lib/redux-store/reducer/group-list";


const Index = (props) => {

    const dispatch = useDispatch()
    const params = useParams();

    const {locationid} = params || {}
    const [groups,setGroups] = useState({})

    const {restaurantDetail:{workspace,legalname,logo:{download_url},location},itemList} = props

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
        getGroups().then()

    }, [])

    if(isEmpty(groups)){
        return <></>
    }

        return (
            <section>

                <div  className="container">

                    <div className={'p-3 border-bottom'}>
                        <div className="row align-items-center no-gutters">
                            <div className={'col-auto'}>
                                <img style={{width: 30}} className="img-fluid"
                                     src={`https://${download_url}`}
                                     alt="demo"/>
                            </div>
                            <div className={'col'}>
                                <h4>{legalname}</h4>
                            </div>
                        </div>
                    </div>


                    <div className={'col-12  mt-4'}>
                        <div>
                            <div className="container">
                                <div>
                                    <Groups/>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>


            </section>
        )



}

const mapStateToProps = (state) => {
    return {
        restaurantDetail: state.restaurantDetail
    }
}

export default connect(mapStateToProps)(Index);

