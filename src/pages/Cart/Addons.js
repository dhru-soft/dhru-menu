import React, { useEffect, useState} from "react";

import {connect} from "react-redux";
import {clone, findObject, getFromSetting, isEmpty, numberFormat, setItemRowData,} from "../../lib/functions";
import {v4 as uuid} from "uuid";


const Index = ({itemDetail,updateItem,settings,addonList,setValidate}) => {

    let {itemaddon,addon} = itemDetail;


    let addtags = itemDetail?.addons || {}

    const {addongroups} = settings;


    let {addongroupid, addonid,autoaddon} = addtags || {addongroupid: [], addonid: [],autoaddon:[]};


    const [moreaddon, setMoreAddon] = useState(clone(addon));


    const [addons,setAddons] = useState(addtags);


    useEffect(() => {

        if(isEmpty(addtags?.addongroupiddata)){
            addtags = {
                ...addtags,
                addongroupiddata:{
                    '0000':{
                        ...addtags?.addoniddata,
                        selecteditems:addtags?.addonid.map((item)=>{
                            return {"itemid": item}
                        }),
                    }
                }
            }
            setAddons(addtags)
        }


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

        addonid.map((addon, key) => {
            const find = findObject(itemaddon, 'itemid', addon, true);
            if (Boolean(find)) {
                moreaddon[addon] = {
                    ...moreaddon[addon],
                    ...find,
                }
            }
        })

        setMoreAddon(clone(moreaddon));

        setTimeout(()=>{

            if(!isEmpty(autoaddon)) {
                autoaddon?.map((addon) => {
                    if (!Boolean(moreaddon[addon].productqnt)) {
                        updateQnt(addon, 'autoadd')
                    }
                })
            }
            else {
                Object.keys(addtags?.addongroupiddata).map((key) => {
                    const adddongroup = addtags?.addongroupiddata[key];
                    adddongroup?.autoadditems?.map((addon) => {
                        if (!Boolean(moreaddon[addon].productqnt)) {
                            updateQnt(addon, 'autoadd',key)
                        }
                    })
                })
            }

        })

        let totalmin = addtags?.addoniddata?.minrequired || 0;
        Object.values(addtags?.addongroupiddata).map((addon)=>{
            totalmin += addon?.minrequired;
        });

        setValidate(!Boolean(totalmin))

    }, [])


    const updateQnt1 = (key, action) => {

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


    const updateQnt = (key, action,addonid) => {

        let productqnt = moreaddon[key].productqnt || 0;



        if (action === 'autoadd') {
            productqnt =   1
        }else if (action === 'add') {
            productqnt = productqnt + 1
        } else if (action === 'remove') {
            productqnt = productqnt - 1
        }

        let uuidn = uuid();

        moreaddon[key] = {
            ...moreaddon[key],
            itemid:key,
            displayunitcode: '',
            productqnt: productqnt,

            key: uuidn,
            ref_id:uuidn,
        }


        //////// CHANGE ADDON PRICE IF CHANGED //////////
        if(Boolean(addonid)) {
            const find = addons?.addongroupiddata[addonid]?.selecteditems?.filter((item) => {
                return item.itemid === key
            })
           /* if (Boolean(find[0]?.productrate)) {
                moreaddon[key].pricing.price.default[0]['onetime'].baseprice = find[0]?.productrate;
            }*/
        }
        //////// CHANGE ADDON PRICE IF CHANGED //////////


        let selectedAddons = Object.values(moreaddon).filter((addon) => {
            return addon.productqnt > 0
        })

        selectedAddons = selectedAddons.map((addon)=>{
            return setItemRowData(addon)
        })

        itemaddon = selectedAddons;
        setMoreAddon(clone(moreaddon));
        updateItem({...itemDetail,itemaddon:selectedAddons})



        //////// VALIDATE ADD BUTTON //////////
        let totalmin = addtags?.addoniddata?.minrequired || 0;

        let allval = 0
        Object.keys(addtags?.addongroupiddata).map((key)=>{

            let addon = addtags?.addongroupiddata[key]
            let totalgroupselected = selectedAddons?.filter((s)=>{
                return s.itemgroupid == key && Boolean(addon.minrequired)
            })

            console.log('totalgroupselected',totalgroupselected)

            if(totalgroupselected.length >= addon.minrequired){
                allval += totalgroupselected.length
            }

            totalmin += addon.minrequired;
        });

        console.log('allval',allval,totalmin)

        if(allval >= totalmin){
            setValidate(true)
        }
        else{
            setValidate(false)
        }
        //////// VALIDATE ADD BUTTON //////////

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


    if(!Boolean(moreaddon)){
        return <></>
    }

    const handleCheckboxChange = (addon,e) => {
        updateQnt(addon,e.target.checked?'add':'remove')
    }


   return (<div className={'mt-5'}>



           {
               Boolean(addons) && Boolean(addons?.addongroupiddata) &&  Object.keys(addons?.addongroupiddata).map((addonid)=>{


                   const {addonselectiontype,anynumber,minrequired,selecteditems} = addons.addongroupiddata[addonid];

                   if(isEmpty(selecteditems)){
                       return <></>
                   }

                   return <div key={addonid}>

                       <h6 className={'mt-3'}>Addon {addongroups[addonid]?.addongroupname} (Any{addonselectiontype === 'selectanyone' && ` ${anynumber}`}{Boolean(minrequired) && `, Required ${minrequired}`})  </h6>

                       {
                           selecteditems?.map((item, key) => {

                               let {itemname, pricing, productqnt} = moreaddon[item.itemid];

                               const pricingtype = pricing?.type;

                               const baseprice = item.productrate || pricing?.price?.default[0][pricingtype]?.baseprice || 0;

                               const addeditems = moreaddon && Object.values(moreaddon).filter((addon)=>{
                                   const find = Object.values(selecteditems).filter((item)=>{
                                       return item.itemid === addon.itemid && Boolean(addon?.productqnt)
                                   })
                                   return Boolean(find?.length);
                               }).length + 1;


                               return (
                                   <div
                                       key={key}>

                                       <div className={`${key!== 0 && 'border-top'} py-3`} >

                                           <div    className={'d-flex justify-content-between'}>

                                               <div>
                                                   <div className="form-check" style={{paddingLeft:22}}>
                                                       <input className="form-check-input" type="checkbox" checked={Boolean(productqnt)}  disabled={(anynumber < addeditems && addonselectiontype === 'selectanyone') && !Boolean(productqnt)}    value="1"
                                                              id={`checkbox${key}${addonid}`} onChange={(e)=> {

                                                           if((anynumber >= addeditems && addonselectiontype === 'selectanyone') || addonselectiontype === 'selectany') {
                                                               item = {
                                                                   ...item,
                                                                   selected:Boolean(productqnt)
                                                               }
                                                           }

                                                           handleCheckboxChange(item.itemid, e)

                                                       }}  />
                                                       <label className="form-check-label" htmlFor={`checkbox${key}${addonid}`}>
                                                           {`${itemname}`}
                                                       </label>
                                                   </div>
                                                   <div>

                                                   </div>
                                               </div>


                                               <div>
                                                   <span>{numberFormat(baseprice)}</span>
                                               </div>

                                           </div>

                                       </div>



                                   </div>
                               )
                           })
                       }
                   </div>

               })
           }




            {/*{Boolean(addonid?.length > 0) && <>

                <h6>Addons</h6>

                <div>

                {
                    addonid?.map((addon, key) => {

                        let {itemname, price,productqnt} = moreaddon[addon] || {};

                        return (
                            <div className={`${key!== 0 && 'border-top'} py-3`} key={key}>
                                <div  key={key}  className={'d-flex justify-content-between'}>

                                    <div>
                                        <div className="form-check" style={{paddingLeft:22}}>
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
            </>}*/}



        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        settings: state.restaurantDetail.settings,
        addonList: state.addonList,
    }
}

export default connect(mapStateToProps)(Index);
