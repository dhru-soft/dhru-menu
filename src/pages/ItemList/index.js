import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";
import apiService from "../../lib/api-service";

import {setItemList} from "../../lib/redux-store/reducer/item-list";
import {useParams} from "react-router-dom";
import {isEmpty} from "../../lib/functions";
import Avatar from "../../components/Avatar";
import {setBottomSheet, setModal} from "../../lib/redux-store/reducer/component";
import GroupList from "../GroupList";
import Groups from "../GroupList/Groups";


const Index = (props) => {

    const dispatch = useDispatch()
    const params = useParams();
    const {locationid,groupid} = params || {}
    const [items,setItems] = useState({})

    const {restaurantDetail:{workspace,legalname,logo:{download_url},location}} = props

    const getItems = async () => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: {locationid: locationid,itemgroupid:groupid},
            workspace: workspace || 'development',
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                const {items} = result?.data;
                setItems(items);
            }
        });
    }

    useEffect(() => {
        getItems().then()
    }, [])

    if(isEmpty(items)){
        return <></>
    }

    return (
        <>
            <section>

                <div  className="container">



                    <div className="row mt-3" style={{marginBottom:100}}>
                        {
                            Object.values(items).map((item, index) => {
                                const {itemname,itemimage,price} = item;
                                return   <div key={index} className="col-12 col-sm-6 col-xl-3 mb-3 ">
                                    <div className="__item __item--rounded  border d-flex h-100 p-3 "  style={{borderRadius:10}}>
                                        <div className={'row'}>
                                            <div className="col-auto" style={{width:65}}>
                                                <Avatar src={itemimage} label={itemname} />
                                            </div>
                                            <div className={'col'}>
                                                <h5 className="__title">{itemname} </h5>
                                                <div> DESCRIPTION </div>
                                                <div> {price} </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>



                    <div className={'text-center position-fixed'} style={{zIndex:99,bottom:20,left:0,right:0}}>
                        <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {
                             dispatch(setModal({
                                 show: true,
                                 title:'Group List',
                                height: '80%',
                                component: () => <Groups/>
                            }))
                        }} type="button" role="button">
                            Groups
                        </button>
                    </div>



                </div>


            </section>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        restaurantDetail: state.restaurantDetail
    }
}

export default connect(mapStateToProps)(Index);


