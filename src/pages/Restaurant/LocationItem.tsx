import React from "react";
import useStore from "../../hooks/useStore";

const LocationItem = (props:any) => {
    const {location, navigate, locationid} = props;

    const store = useStore(location)

    return <div className={'col-lg-3 col-md-4 col-sm-5 col-xs-6 col-6  p-0'} style={{

        textAlign:'center',
        display:'flex',
        alignItems:'center'
    }}>
        <div className={'d-flex m-2 h-100 mw-100'} style={{background  : '#00000095',borderRadius: 10,
        }}>
            <div onClick={() => {
                if (store?.isOpen) {
                    navigate(`/l/${locationid}/t/0`)
                }
            }}
                 className={' p-4 text-white  d-flex justify-content-between  cursor-pointer h-100'} >
                <div >

                        {Boolean(location?.locationlimage) &&  <img src={`https://${location?.locationlimage}`} alt={'Location Image'} style={{width:'100%'}}  />}

                    <div  style={{fontSize: 22,padding:'10px'}}>{location?.name}</div>
                    {
                        (location?.address1 || location?.address2 || location?.city) && <div  style={{fontSize: 13,marginTop:'10px'}}>
                            {location?.address1} {location?.address2} {location?.city}
                        </div>
                    }
                </div>

            </div>
        </div>
    </div>
}


export default LocationItem;
