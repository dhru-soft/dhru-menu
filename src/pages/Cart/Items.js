import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import apiService from "../../lib/api-service";

import {addToCart,  getItemById,  isEmpty, numberFormat} from "../../lib/functions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import ItemDetails from "./ItemDetails";
import {setModal} from "../../lib/redux-store/reducer/component";
import Loader3 from "../../components/Loader/Loader3";
import {setItemDetail} from "../../lib/redux-store/reducer/item-detail";



export const ItemBox = ({item}) => {
    const dispatch = useDispatch()
    const {itemname,itemimage,price,itemid,hasextra,itemdescription,veg} = item

    const diat = {veg:{color:'#659a4a',icon:'leaf'},nonveg:{color:'#ee4c4c',icon:'meat'},egg:{color:'gray',icon:'egg'}}

    const openItemModal =  async () =>{
            if(hasextra) {
                dispatch(setItemDetail(item));
                dispatch(setModal({
                    show: true,
                    title: itemname,
                    height: '80%',
                    component: () => <><ItemDetails   /></>
                }))
            }
            else{
                addToCart(item).then(r => { })
            }
    }




    return (
        <div   className="col-12 col-sm-4 col-xl-3  item-hover  p-2 py-4">
            <div className="d-flex p-2 h-100">
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
                <div className={'border border-light  rounded-3 p-2'} style={{width:150}}>
                    <div style={{minHeight:50}}>
                        {itemimage &&  <img className={'w-100 rounded-3'} src={`https://${itemimage}`}/>}
                    </div>
                    <div className={'mt-3 text-center'}>
                        {/*<button className=" btn-add btn" onClick={()=>{
                            openItemModal().then()
                        }} type="button" role="button">
                            ADD
                        </button>*/}
                    </div>

                </div>
            </div>
        </div>
    )
}

const Items = (props) => {


    const [items,setItems] = useState({})
    const [loader,setLoader] = useState(false)

    const {workspace,groupids,selectedtags,searchitem} = props;

    const getItems = async () => {

       const selectedDiat = Boolean(selectedtags?.length > 0) && selectedtags?.map((tag)=>{ return tag.value})?.toString() || '';
       let queryString = {locationid: device.locationid};
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
            hideLoader:true,
            workspace: workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                const {items} = result?.data;
                setItems(items);
            }
            else{
                setItems({})
            }
            setLoader(true)
        });
    }

    useEffect(() => {
        getItems().then()
    }, [groupids,selectedtags,searchitem])

    if(!loader){
        return  <Loader3/>
    }

    if(isEmpty(items)){
        return  <div className={'text-center bg-white rounded-4 text-muted p-5'}>No items found</div>
    }


    return (
        <>
            <section>

                <div  className="container bg-white rounded-4">



                  <div className="row" >
                        {
                            Object.keys(items).map((key) => {
                                return <ItemBox key={key}  item={{...items[key],itemid:key}}  />
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


