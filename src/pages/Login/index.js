import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import Mobile from "../Client/Mobile";
import Otp from "../Client/Otp";
import AddEditAddress from "../Client/AddEditAddress";
import {device} from "../../lib/static";
import ConfirmOrder from "../Cart/ConfirmOrder";
import {isEmpty} from "../../lib/functions";

const Index = ({clientDetail,cartData}) => {

    const dispatch = useDispatch()

    const {token, verifymobile, otp, clientname,addresses} = clientDetail


    const mobilescreen = (verifymobile === '');
    const otpscreen = (verifymobile === 'inprocess' && otp === 'sent')
    const otherdetailscreen = (!Boolean(clientname) || (!Boolean(addresses) && Boolean(device.tableid === '0')))


    let Component = () => <ConfirmOrder/>

    if(mobilescreen){
        Component = () => <Mobile/>
    }
    else if(otpscreen){
        Component = () => <Otp/>
    }
    else if(otherdetailscreen){
        Component = () => <AddEditAddress/>
    }



    return (
        <>
            <section className="h-100">
                <div className="m-auto h-100">
                    <Component/>
                </div>
            </section>
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        clientDetail: !isEmpty(state?.clientDetail) ? state?.clientDetail :  {verifymobile :'', otp:'', clientname:'',address1:''},
    }
}

export default connect(mapStateToProps)(Index);
