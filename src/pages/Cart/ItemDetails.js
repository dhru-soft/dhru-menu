import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import apiService from "../../lib/api-service";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";
import Addons from "./Addons";
import {setItemDetail} from "../../lib/redux-store/reducer/item-detail";
import TagsNotes from "./TagsNotes";


const Index = (props) => {

    const dispatch = useDispatch()
    const {item: {itemimage,itemid, price,description, itemname,}} = props;
    const [loader,setLoader] = useState(false)

     const getItemDetails = async () => {

        const {workspace,locationid} = props;
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: {locationid:locationid,itemid:itemid},
            workspace: workspace || 'development',
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                dispatch(setItemDetail(result?.data))
                setLoader(true)
            }
        });
    }

    useEffect(()=>{
        getItemDetails().then()
    },[])

    if(!loader){
        return <></>
    }

    return (
        <div className={'col-12'}>

            <div>
                <div className="container">

                    {Boolean(itemimage) &&   <img src={`https://${itemimage}`} className={'w-100'} style={{borderRadius:5}} />}

                    <h4 className={'text-bold'}>Price : {price}</h4>


                        <div>

                            <div>{description}</div>
                        </div>


                        <Addons   />
                        <TagsNotes    />


                    {/*<div className={'d-flex justify-content-between'}>
                        <div>
                            Item Qnt
                        </div>

                        <div>
                            <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {

                            }} type="button" role="button">
                                Add
                            </button>
                        </div>
                    </div>*/}

                </div>
            </div>

        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        workspace: state.restaurantDetail?.workspace,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

