import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {addToCart, clone, isEmpty, removeItem} from "../../lib/functions";
import store from "../../lib/redux-store/store";
import {changeCartItem} from "../../lib/redux-store/reducer/cart-data";
import {v4 as uuid} from "uuid";
import {setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "./ItemDetails";
import {AddonAction} from "./Items";


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
            removeItem(values.key).then(() => {
            });
        } else {
            store.dispatch(changeCartItem({itemIndex: index, item: finditem, itemUpdate: true}));
        }


    } catch (e) {
        console.log(e)
    }
}

const Index = ({item, updateItem, custom, fromCart}) => {

    const [productqnt, setQnt] = useState(item?.productqnt || 0);
    const dispatch = useDispatch()

    useEffect(() => {
        setQnt(item?.productqnt)
    }, [item?.productqnt])


    const addQnt = (productqnt) => {

        const key = uuid();

        const {hasextra, itemname} = item;

        if (hasextra && !Boolean(item.productqnt)) {
            store.dispatch(setModal({
                show: true,
                title: itemname,
                height: '80%',
                component: () => <><ItemDetails itemDetail={item} updateListItem={updateItem}/></>
            }))
        } else {
            item = {
                ...item, productqnt: productqnt || 1, key
            }
            addToCart(item).then(r => {
            })

            setQnt(productqnt || 1)
            Boolean(updateItem) && updateItem({...item});
            dispatch(setModal({show: false}))

        }

    }

    const updateQnt = (action, isRepeat = false) => {

        const {hasextra, key} = item;

        if (hasextra && key && (!fromCart) && (action === 'add') && (!isRepeat)) {
            store.dispatch(setModal({
                show: true,
                title: '',
                height: '80%',
                component: () => <>
                    <AddonAction item={clone(item)} updateQnt={updateQnt}/>
                </>
            }))
        } else {
            let qnt = productqnt;

            if (action === 'add') {
                qnt = qnt + 1;
            } else {
                qnt = qnt - 1;
            }
            item = {
                ...item,
                productqnt: qnt,
                hasextra: !isEmpty(item?.addons),
            }
            setQnt(qnt)
            Boolean(updateItem) && updateItem({...item});
            updateCartItem(item).then(r => {
            })
        }


    }

    const updatecartItem = () => {
        updateCartItem(item).then(r => {
        })
        dispatch(setModal({show: false}))
    }


    if (custom) {
        return (
            <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {
                if (fromCart) {
                    updatecartItem()
                } else {
                    addQnt(item.productqnt, true)
                }
            }} type="button" role="button">
                {fromCart ? 'Update' : 'Add'}
            </button>
        )
    }


    if (productqnt) {
        return (
            <div className={'border rounded-3 btn-add p-0 mt-3 '}>
                <div className={'d-flex justify-content-between align-items-center'}>
                    <div className={'p-3  px-4 cursor-pointer'} onClick={() => updateQnt('remove')}> -</div>
                    <div className={'bg-white'} style={{
                        height: '34px',
                        width: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}> {productqnt} </div>
                    <div className={'p-3 px-4 cursor-pointer'} onClick={() => updateQnt('add')}> +</div>
                </div>
            </div>
        )
    }

    return (
        <div className={'mt-3 text-center'}>
            <button className=" btn-add btn" onClick={() => {
                addQnt()
            }} type="button" role="button">
                ADD
            </button>
        </div>
    )
}


export default Index;

