import React from "react";
import useStore from "../../hooks/useStore";

const LocationItem = (props:any) => {
    const {location, navigate, locationid} = props;

    const store = useStore(location)

    return <div className={'m-3 d-flex'} style={{width:'250px'}}>
        <div className={'location-list'}
             style={{borderRadius: 5}}>
            <div onClick={() => {
                if (store?.isOpen) {
                    navigate(`/l/${locationid}/t/0`)
                }
            }}
                 className={' p-4 text-white d-flex justify-content-between align-items-center cursor-pointer h-100'}
                 style={{
                     borderRadius: 5,
                     background  : '#00000050',
                     textAlign:'center'
                 }}>
                <div>
                    <div style={{height:'140px'}}>
                        {Boolean(location?.locationlimage) &&  <img src={`https://${location?.locationlimage}`} alt={'Location Image'} style={{width:'100%'}}  />}
                    </div>
                    <div
                         style={{fontSize: 20,padding:'10px'}}>{location?.name}</div>
                    {
                        (location?.address1 || location?.address2 || location?.city) && <div  style={{fontSize: 13,marginTop:'10px'}}>
                            {location?.address1} {location?.address2} {location?.city}
                        </div>
                    }
                </div>
                {/*<div>
                    {
                        store?.isOpen ? <div className={'mt-3'}><i
                            className={'fa fa-chevron-right'}></i></div> : <div>
                            {store?.message}
                        </div>
                    }
                </div>*/}
            </div>
        </div>
    </div>
}


export default LocationItem;
