import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {addItem, removeItem} from "../../lib/functions";
import store from "../../lib/redux-store/store";
import {changeCartItem} from "../../lib/redux-store/reducer/cart-data";
import {v4 as uuid} from "uuid";
import {device} from "../../lib/static";


export const updateCartItem = async (values) => {

    let invoiceitems = store.getState().cartData?.invoiceitems || {}

    try {
        const index = invoiceitems.findIndex(function (item) {
            return item.key === values.key
        });

        let filtered = invoiceitems?.filter((item, key) => {
            return item.key === values.key
        })


        let finditem = {
            ...filtered[0],
            ...values,
            change: true,
            product_qnt: values.productqnt,
        }

        if (values.productqnt <= 0) {
             removeItem(values.key).then(() => {  });
        } else {
            store.dispatch(changeCartItem({itemIndex: index, item: finditem,itemUpdate:true}));
        }


    } catch (e) {
        console.log(e)
    }
}

const Index = ({item,updateItem}) => {

    const [productqnt,setQnt] = useState(item?.productqnt || 0);

    const addQnt = () => {
        const key = uuid();
        item = {
            ...item,productqnt:1,key
        }
        addItem(item).then();
        if(!item?.hasextra){
            setQnt(1)
            Boolean(updateItem) && updateItem(item);
        }
    }

    const updateQnt = (action) => {
        let qnt = productqnt;
        if(action === 'add'){
            qnt = qnt + 1;
        }
        else{
            qnt = qnt - 1;
        }
        item = {
            ...item,
            productqnt:qnt
        }
        setQnt(qnt)
        Boolean(updateItem) && updateItem(item);
        updateCartItem(item).then(r => {})
    }



    if(productqnt){
        return (
            <div className={'border rounded-3 btn-add p-0 mt-3 '}>
                <div className={'d-flex justify-content-between align-items-center'}>
                    <div className={'p-3  px-4 cursor-pointer'} onClick={()=> updateQnt('remove') }> - </div>
                    <div className={'bg-white'} style={{height: '34px',width: '40px',display: 'flex',justifyContent: 'center',alignItems: 'center'}}> {productqnt} </div>
                    <div className={'p-3 px-4 cursor-pointer'} onClick={()=> updateQnt('add') }> + </div>
                </div>
            </div>
        )
    }

    return (
        <div className={'mt-3 text-center'}>
            <button className=" btn-add btn" onClick={()=>{
                addQnt()
            }} type="button" role="button">
                ADD
            </button>
        </div>
    )
}


export default  Index;

