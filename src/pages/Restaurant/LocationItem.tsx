import React, {useEffect} from "react";

import {resetCart} from "../../lib/redux-store/reducer/cart-data";
import store from "../../lib/redux-store/store";
import {useRestaurant} from "../../use/useRestaurant";

const LocationItem = (props:any) => {

    const {location, navigate, locationid} = props;


    const {isOpen} = useRestaurant(location)

    useEffect(() => {
        store.dispatch(resetCart())
    }, [locationid]);

    const themecolor = location.order?.themecolor || '#222'



    return <div className={'col-lg-3 col-md-4 col-sm-5 col-xs-6 col-6  p-0 mb-3'} style={{

        textAlign:'center',
        display:'flex',
        alignItems:'center'
    }}>
        <div className={'d-flex m-2 h-100 w-100 mw-100 justify-content-center'} style={{borderRadius: 7,border:`${themecolor} solid 1px`
        }}>
            <div onClick={() => {
                if (isOpen) {
                    navigate(`/l/${locationid}/t/0`)
                }
            }}
                 className={' d-flex justify-content-between  cursor-pointer h-100 '} >
                <div>
                     {Boolean(location?.locationlimage) &&  <img src={`https://${location?.locationlimage}`} alt={'Location Image'} style={{width:'100%',borderRadius:'5px 5px 0 0'}}  />}

                    <div  style={{fontSize: 22,padding:'10px'}}  >{location?.name}</div>
                    {
                        (location?.address1 || location?.address2 || location?.city) && <div  style={{fontSize: 13,padding:'0 10px'}}>
                            {location?.address1} {location?.address2} {location?.city}
                        </div>
                    }
                </div>

            </div>
        </div>
    </div>
}


export default LocationItem;
