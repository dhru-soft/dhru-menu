import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";
import apiService from "../../lib/api-service";

import {useNavigate, useParams} from "react-router-dom";
import {checkLocation, isEmpty} from "../../lib/functions";
import Avatar from "../../components/Avatar";
import {setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "./ItemDetails";



export const ItemBox = ({item,itemid}) => {
    const dispatch = useDispatch()
    const {itemname,itemimage,price} = item;
    return (
        <div   className="col-12 col-sm-6 col-xl-3 mb-3 " onClick={()=>{
            dispatch(setModal({
                show: true,
                title:itemname,
                height: '80%',
                component: () => <><ItemDetails item={item}/></>
            }))
        }}>
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
    )
}

const Items = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [items,setItems] = useState({})

    const {workspace,groupids,selectedtags,searchitem,locationid} = props;

    const getItems = async () => {

       const selectedDiat = Boolean(selectedtags?.length > 0) && selectedtags?.map((tag)=>{ return tag.label})?.toString() || '';
       let queryString = {locationid: locationid};
       let itemgroupid = Boolean(groupids) && groupids[groupids?.length - 1];
       if(Boolean(searchitem)){
           queryString = {
               ...queryString,
               search:searchitem
           }
       }
        if(Boolean(selectedDiat)){
            queryString = {
                ...queryString,
                tags:selectedDiat
            }
        }
        if(Boolean(itemgroupid)){
            queryString = {
                ...queryString,
                itemgroupid:itemgroupid
            }
        }

        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: queryString,
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
        if(checkLocation()) {
            getItems().then()
        }
        else{
            navigate('/')
        }
    }, [groupids,selectedtags,locationid,searchitem])

    if(isEmpty(items)){
        return <></>
    }


    return (
        <>
            <section>

                <div  className="container">



                    <div className="row mt-3" style={{marginBottom:100}}>
                        {
                            Object.keys(items).map((key) => {
                                return <ItemBox key={key} item={{...items[key],itemid:key}}  />
                            })
                        }
                    </div>



                    {/*<div className={'text-center position-fixed'} style={{zIndex:99,bottom:20,left:0,right:0}}>
                        <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {
                             dispatch(setModal({
                                 show: true,
                                 title:'Group List',
                                height: '80%',
                                component: () => <Groups/>
                            }))
                        }} type="button" role="button">
                            {groupList[groupid].itemgroupname}
                        </button>
                    </div>*/}



                </div>


            </section>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        workspace: state.restaurantDetail?.workspace,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Items);

