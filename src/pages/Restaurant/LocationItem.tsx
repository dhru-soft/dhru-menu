import React from "react";
import useStore from "../../hooks/useStore";

const LocationItem = (props:any) => {
    const {location, navigate, locationid} = props;

    const store = useStore(location)

    return <div className={'mb-3'}>
        <div className={'location-list'}
             style={{borderRadius: 5}}>
            <div onClick={() => {
                if (store?.isOpen) {
                    navigate(`/l/${locationid}/t/0`)
                }
            }}
                 className={' p-4 text-white d-flex justify-content-between align-items-center cursor-pointer'}
                 style={{
                     borderRadius: 5,
                     background  : '#00000050'
                 }}>
                <div>
                    <div
                         style={{fontSize: 20}}>{location?.name}</div>
                    {
                        (location?.address1 || location?.address2 || location?.city) && <div
                            style={{fontSize: 14}}>{location?.address1} {location?.address2} {location?.city}</div>
                    }
                </div>
                <div>
                    {
                        store?.isOpen ? <div className={'mt-3'}><i
                            className={'fa fa-chevron-right'}></i></div> : <div>
                            {store?.message}
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
}


export default LocationItem;
