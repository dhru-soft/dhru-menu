import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {clone, createUniqueStore, numberFormat, retrieveData, sessionStore, storeData} from "../../lib/functions";
import {setCartData, setUpdateCart} from "../../lib/redux-store/reducer/cart-data";
import {itemTotalCalculation} from "../../lib/item-calculation";
import {useNavigate} from "react-router-dom";
import {device} from "../../lib/static";

const TableRow = ({item}) => {
    return (
        <>
            {Boolean(item?.value) &&  <div className={'d-flex justify-content-between align-items-center  mb-3  invert-effect'}>
                <h6 className={'m-0 p-0'}><div>{item.label}</div></h6>
                <div>
                    <h6  className={'m-0 p-0'}>{numberFormat(item?.value || 0)}</h6>
                </div>
            </div>}
        </>
    )
}

const Index = (props) => {

    const dispatch = useDispatch();
    const [loader,setLoader] = useState(false);

    const {cartData,cartData:{vouchersubtotaldisplay, globaltax, voucherroundoffdisplay,vouchertotaldisplay,vouchertotaldiscountamountdisplay,voucherinlinediscountdisplay}} = props;

    useEffect(()=>{
        setTimeout(()=>{
            let data = itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
            dispatch(setCartData(clone(data)));
            dispatch(setUpdateCart());
            setLoader(true)
        },200)
    },[])


    if(!loader){
        return <div className={'text-center p-5  invert-effect'}>Loading</div>
    }

    return (
        <div className={' border-bottom mb-3 '}>

            <div>

                <div>
                    <TableRow item={{label:'Subtotal',value:vouchersubtotaldisplay - voucherinlinediscountdisplay}}/>

                    <TableRow item={{label:'Discount',value:vouchertotaldiscountamountdisplay}}/>

                    {
                        globaltax?.map((tax, key) => {
                            if (!Boolean(tax.taxpercentage)) {
                                return <></>
                            }
                            return (
                                <TableRow  key={key} item={{label:`${tax.taxname} ${tax.taxpercentage}`,value:tax.taxpricedisplay}}/>
                            )
                        })
                    }

                    <TableRow item={{label:'Roundoff',value:voucherroundoffdisplay}}/>

                </div>


            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData,
    }
}

export default connect(mapStateToProps)(Index);

