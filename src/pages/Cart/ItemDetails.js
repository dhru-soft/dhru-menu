import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import Addons from "./Addons";
import TagsNotes from "./TagsNotes";
import {addToCart, getItemById, isEmpty, numberFormat} from "../../lib/functions";
import {setModal} from "../../lib/redux-store/reducer/component";
import {setItemDetail} from "../../lib/redux-store/reducer/item-detail";
import Loader3 from "../../components/Loader/Loader3";
import AddButton from "./AddButton";
import {updateCartField} from "../../lib/redux-store/reducer/cart-data";


const Index = (props) => {

    const dispatch = useDispatch()

    const {updateListItem,cart} = props
    const [updateItem,setUpdateItem] = useState(props?.itemDetail);
    const {itemimage,itemid, itemdescription,price,notes} = updateItem;

    const [loader,setLoader] = useState(false)

    const getItemDetails = async () => {
        if(cart) {
            dispatch(setItemDetail(props.itemDetail))
        }
        else{
            await getItemById(itemid).then((data) => {
                dispatch(setItemDetail({...props.itemDetail, ...data}))
            });
        }
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

                    <div style={{marginBottom:100}}>
                        {Boolean(itemimage) &&
                            <div className={'text-center p-5 rounded-4'}>
                                <img src={`https://${itemimage}`}  style={{borderRadius: 5,maxWidth:'100%'}}/>
                            </div>}

                        <h6 className={'mt-3'}>Price : {numberFormat(price)}</h6>


                        <div>
                            <div>{itemdescription}</div>
                        </div>


                        <Addons updateItem={setUpdateItem}/>
                        {/*<TagsNotes/>*/}

                        <div className={'form mt-3'}>
                            <input className="textfield textfield2"
                                   type="text"
                                   defaultValue={notes}
                                   placeholder="Notes"
                                   onBlur={(e) => {
                                       setUpdateItem({...updateItem,notes:e.target.value})
                                   }}
                            />
                        </div>
                    </div>


                    <div className={' position-fixed'}  style={{left:0,right:0,bottom:0}}>
                        <div style={{maxWidth: 500}} className={'m-auto'}>
                            <div className={'d-flex justify-content-between align-items-center p-4'}>
                                <div>
                                    <AddButton  item={updateItem} updateItem={setUpdateItem} />
                                </div>

                                <div>
                                    <AddButton custom={true} fromCart={cart} item={updateItem} updateItem={updateListItem} />
                                </div>
                            </div>
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

