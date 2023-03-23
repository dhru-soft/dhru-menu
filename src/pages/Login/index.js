import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {setModal} from "../../lib/redux-store/reducer/component";
import Mobile from "../Client/Mobile";
import Otp from "../Client/Otp";
import NameAddress from "../Client/NameAddress";
import {device} from "../../lib/static";

const Index = ({clientDetail}) => {

    const dispatch = useDispatch()

    const {token, verifymobile, otp, clientname,address1} = clientDetail

    const mobilescreen = !verifymobile
    const otpscreen = (verifymobile === 'inprocess' && otp === 'sent')
    const otherdetailscreen = (((verifymobile === 'done' && !Boolean(clientname)) || !Boolean(device.tableid) && !Boolean(address1)) && !mobilescreen && !otpscreen)

    useEffect(() => {
        if (!mobilescreen && !otpscreen && !otherdetailscreen) {
            dispatch(setModal({show: false}))
        }
    })

    return (

        <>

            <section className="h-100">

                <div className="m-auto h-100" style={{width: 360}}>

                    {
                        mobilescreen && <>
                            <Mobile/>
                        </>
                    }

                    {
                        otpscreen && <>
                            <Otp/>
                        </>
                    }

                    {
                        otherdetailscreen && <>
                            <NameAddress/>
                        </>
                    }

                </div>

            </section>
        </>


    );
}

const mapStateToProps = (state) => {
    return {
        clientDetail: state.clientDetail
    }
}

export default connect(mapStateToProps)(Index);
