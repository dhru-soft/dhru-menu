import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";
import apiService from "../../lib/api-service";

import {useNavigate, useParams} from "react-router-dom";
import {checkLocation, isEmpty, numberFormat} from "../../lib/functions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import ItemDetails from "./ItemDetails";
import {setModal} from "../../lib/redux-store/reducer/component";



export const ItemBox = ({item,itemid}) => {
    const dispatch = useDispatch()
    const {itemname,itemimage,price,itemdescription,veg} = item

    const diat = {veg:{color:'#659a4a',icon:'leaf'},nonveg:{color:'#ee4c4c',icon:'meat'},egg:{color:'gray',icon:'egg'}}

    return (
        <div   className="col-12 col-sm-4 col-xl-3  item-hover  p-2 py-4" onClick={()=>{
            /*dispatch(setModal({
                show: true,
                title:itemname,
                height: '80%',
                component: () => <><ItemDetails item={item}/></>
            }))*/
        }}>
            <div className="d-flex p-2 h-100 align-items-center">
                <div className={'w-100'}>

                    <div className={'p-2 mt-auto '}>
                        <div className={'flex-nowrap'}>
                            {veg &&  <div> <i style={{color:diat[veg].color}} className={`fa fa-${diat[veg].icon}`}></i> </div>}
                            <h4 className="__title">{itemname} </h4>
                            <h5 className={'mb-2'}> {numberFormat(price)} </h5>
                        </div>
                        <div className={'text-muted mt-3'}>
                            <ReactReadMoreReadLess
                                charLimit={50}
                                readMoreText={"Read more"}
                                readLessText={""}
                                readMoreStyle={{color:'black'}}
                            >
                                {itemdescription}
                            </ReactReadMoreReadLess>

                        </div>
                    </div>
                </div>
                <div className={'border border-light  rounded-3  p-3'} style={{width:150}}>
                    <div style={{minHeight:50}}>
                        {itemimage &&  <img className={'w-100 rounded-3'} src={`https://${itemimage}`}/>}
                    </div>
                    {/*<div className={'mt-3'}>
                        <button className="w-100 company-detail btn text-white border-0 p-2" onClick={()=>{

                        }} type="button" role="button">
                           + Add
                        </button>

                    </div>*/}

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
            else{
                setItems({})
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
        return  <div className={'text-center text-muted p-5'}>No items found</div>
    }


    return (
        <>
            <section>

                <div  className="container bg-white rounded-4">



                  <div className="row" >
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


