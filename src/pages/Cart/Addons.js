import React, { useEffect, useState} from "react";

import {connect} from "react-redux";
import {clone, findObject, getFromSetting, numberFormat, setItemRowData,} from "../../lib/functions";
import {v4 as uuid} from "uuid";


const Index = ({itemDetail,updateItem}) => {

    const {itemaddon,addons,addon} = itemDetail

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


        let productqnt  =  0;

        if (action === 'add') {
            productqnt = 1
        } else if (action === 'remove') {
            productqnt = 0
        }

        let uuidn = uuid();

        moreaddon[key] = {
            ...moreaddon[key],
            itemid:key,
            productqnt: productqnt,
            key: uuidn,
        }

        let selectedAddons = Object.values(moreaddon).filter((addon) => {
            return addon.productqnt > 0
        })

        selectedAddons = selectedAddons.map((addon)=>{
            return setItemRowData(addon)
        })


        setMoreAddon(clone(moreaddon));
        updateItem({...itemDetail,itemaddon:selectedAddons})
    }


    useEffect(() => {
        if(Boolean(itemaddon)) {

            addonid?.map((addon, key) => {
                const find = findObject(itemaddon, 'productid', addon, true);

                if (Boolean(find)) {
                    moreaddon[addon] = {
                        ...moreaddon[addon],
                        ...find,
                    }
                }
            })
        }

        setMoreAddon(clone(moreaddon));

        /*setTimeout(()=>{
            autoaddon?.map((addon)=>{
                updateQnt(addon,'add')

            })
        })*/

    }, [])


    if(!Boolean(moreaddon))
    {
        return <></>
    }

    const handleCheckboxChange = (addon,e) => {
        updateQnt(addon,e.target.checked?'add':'remove')
    }


   return (<div className={'mt-5'}>

            {Boolean(addonid?.length > 0) && <>

                <h6>Addons</h6>

                <div>

                {
                    addonid?.map((addon, key) => {

                        let {itemname, price,productqnt} = moreaddon[addon] || {};

                        return (
                            <div className={`${key!== 0 && 'border-top'} py-3`} key={key}>
                                <div  key={key}  className={'d-flex justify-content-between'}>

                                    <div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" checked={Boolean(productqnt)} value="1"
                                                   id={`checkbox${key}`} onChange={(e)=>handleCheckboxChange(addon,e)}  />
                                                <label className="form-check-label" htmlFor={`checkbox${key}`}>
                                                    {`${itemname}`}
                                                </label>
                                        </div>
                                        <div>

                                        </div>
                                    </div>


                                    <div>
                                        <span>{numberFormat(price)}</span>
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
})

export default connect(mapStateToProps)(Index);
