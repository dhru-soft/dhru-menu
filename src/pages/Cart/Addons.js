import React, { useEffect, useState} from "react";

import {connect} from "react-redux";
import { clone, findObject,} from "../../lib/functions";
import {v4 as uuid} from "uuid";
import restaurantDetail from "../../lib/redux-store/reducer/restaurant-data";


const Index = ({itemDetail,unit}) => {

    const {itemaddon,addons,addon,settings} = itemDetail

    let {addongroupid, addonid,autoaddon} = addons || {addongroupid: [], addonid: [],autoaddon:[]};


    const [moreaddon, setMoreAddon] = useState(clone(addon))

    addongroupid?.map((ag) => {
           const findaddons = Object.values(moreaddon)?.filter((addon) => {
               return ag === addon.itemgroupid
           }).map((item) => {
               return item.itemid
           })

           if (Boolean(findaddons.length)) {
               addonid = addonid.concat(findaddons)
           }

       })


    const updateQnt = (key, action) => {
        let productqnt = moreaddon[key].productqnt || 0;

        if (action === 'add') {
            productqnt = productqnt + 1
        } else if (action === 'remove') {
            productqnt = productqnt - 1
        }

        let unittype = unit[moreaddon[key]?.itemunit]
        let uuidn = uuid();
        moreaddon[key] = {
            ...moreaddon[key],
            displayunitcode:unittype?.unitcode || '',
            productqnt: productqnt,
            key: uuidn,
            ref_id:uuidn
        }

        const selectedAddons = Object.values(moreaddon).filter((addon) => {
            return addon.productqnt > 0
        })

        //  itemaddon = selectedAddons;

        setMoreAddon(clone(moreaddon));
        // updateProduct({itemaddon:selectedAddons})
    }


    useEffect(() => {
        if(Boolean(itemaddon)) {
            addonid?.map((addon, key) => {
                const find = findObject(itemaddon, 'itemid', addon, true);
                if (Boolean(find)) {
                    moreaddon[addon] = {
                        ...moreaddon[addon],
                        ...find,
                    }
                }

            })
        }

        setMoreAddon(clone(moreaddon));

        setTimeout(()=>{
            autoaddon?.map((addon)=>{
                updateQnt(addon,'add')

            })
        })

    }, [])


    if(!Boolean(moreaddon))
    {
        return <></>
    }


   return (<div className={'mt-5'}>

            {Boolean(addonid?.length > 0) && <>

                <h6>Addons</h6>

                <div className={'border p-3 rounded-3'}>

                {
                    addonid?.map((addon, key) => {

                        let {itemname, pricing, productqnt} = moreaddon[addon] || {};

                        const pricingtype = pricing?.type;

                        const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;

                        return (
                            <div className={`${key!== 0 && 'border-top'} py-3`} key={key}>
                                <div  key={key}  className={'d-flex justify-content-between'}>

                                    <div>
                                        <div style={{width: 150}}><span>{`${itemname}`} </span></div>
                                        <div>

                                        </div>
                                    </div>


                                    <div>
                                        <span>{baseprice * (productqnt || 1)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </div>
            </>}
        </div>
    )
}



const mapStateToProps = (state) => ({
    itemDetail: state.itemDetail,
    unit:state.restaurantDetail?.unit
})

export default connect(mapStateToProps)(Index);

//({toCurrency(baseprice * productQnt)})
