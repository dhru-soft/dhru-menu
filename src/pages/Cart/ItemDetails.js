import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import Addons from "./Addons";
import TagsNotes from "./TagsNotes";
import {addToCart, getItemById, numberFormat} from "../../lib/functions";
import {setModal} from "../../lib/redux-store/reducer/component";
import {setItemDetail} from "../../lib/redux-store/reducer/item-detail";
import Loader3 from "../../components/Loader/Loader3";


const Index = (props) => {

    const dispatch = useDispatch()

    const {itemimage,itemid, itemdescription,pricing} = props?.itemDetail;
    const pricingtype = pricing?.type;
    const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;

    const [loader,setLoader] = useState(false)

    const getItemDetails = async () => {
        await getItemById(itemid).then((data)=>{
            dispatch(setItemDetail(data))
        });
        setLoader(true)
    }

    useEffect(()=>{
        getItemDetails().then()
    },[])

    if(!loader){
        return  <Loader3/>
    }

    return (
        <div className={'col-12'}>

            <div>
                <div className="container">

                    {Boolean(itemimage) &&
                        <img src={`https://${itemimage}`} className={'w-100'} style={{borderRadius: 5}}/>}

                    <h4 className={'text-bold'}>Price : {numberFormat(baseprice)}</h4>


                    <div>
                        <div>{itemdescription}</div>
                    </div>


                    <Addons/>
                    <TagsNotes/>


                    <div className={'d-flex justify-content-between align-items-center'}>
                        <div>
                            Item Qnt
                        </div>

                        <div>
                            <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {
                                addToCart(props?.itemDetail).then(r => {
                                    dispatch(setModal({show: false}))
                                })
                            }} type="button" role="button">
                                Add
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        itemDetail: state.itemDetail,
    }
}

export default connect(mapStateToProps)(Index);

