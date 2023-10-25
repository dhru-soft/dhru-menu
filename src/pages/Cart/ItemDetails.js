import React, {useEffect, useState} from "react";
import Addons from "./Addons";
import {clone, getItemById, numberFormat} from "../../lib/functions";

import Loader3 from "../../components/Loader/Loader3";
import AddButton from "./AddButton";
import {v4 as uuid} from "uuid"

const Index = (props) => {


    let {updateListItem, cart,  itemDetail} = props || {};

    if (!Boolean(itemDetail?.productqnt)) {
        itemDetail = {
            ...itemDetail,
            productqnt: 1
        }
    }

    const [updateItem, setUpdateItem] = useState(itemDetail);
    const [validate,setValidate] = useState(Boolean(itemDetail?.addtags))



    const {itemimage, itemid, itemdescription, price, notes} = updateItem;

    const [loader, setLoader] = useState(false)

    const getItemDetails = async () => {
        if (!cart) {
            await getItemById(itemid).then(async (data) => {
                await setUpdateItem({...itemDetail, ...data})
            });
        }
        setLoader(true)
    }

    useEffect(() => {
        getItemDetails().then()
    }, [])

    if (!loader) {
        return <Loader3/>
    }



    return (
        <div className={'col-12'}>

            <div>
                <div className="container">

                    <div style={{marginBottom: 20}}>
                        {Boolean(itemimage) &&
                            <div className={'text-center p-5 rounded-4'}>
                                <img src={`https://${itemimage}`} style={{borderRadius: 5, maxWidth: '100%'}}/>
                            </div>}

                        <h6 className={'mt-3'}>Price : {numberFormat(price)}</h6>


                        <div>
                            <div>{itemdescription}</div>
                        </div>


                        <Addons itemDetail={updateItem} selectedaddon={clone(itemDetail.itemaddon)}   updateItem={setUpdateItem} key={uuid} setValidate={setValidate}/>
                        {/*<TagsNotes/>*/}

                        <div className={'form mt-3'}>
                            <input className="textfield textfield2"
                                   type="text"
                                   defaultValue={notes}
                                   placeholder="Notes"
                                   onBlur={(e) => {
                                       setUpdateItem({...updateItem, notes: e.target.value})
                                   }}
                            />
                        </div>
                    </div>


                    <div>
                        <div>
                            {validate  && <div className={'d-flex justify-content-between align-items-center'}>
                                <div>
                                    {<AddButton item={{...updateItem}} fromCart={true} minqnt={1} updateItem={setUpdateItem}/>}
                                </div>

                                <div>
                                    <AddButton custom={true} fromCart={cart} item={updateItem}
                                               updateItem={updateListItem}/>
                                </div>
                            </div>}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )

}


export default Index;

