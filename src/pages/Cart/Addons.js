import React, { useEffect, useState} from "react";

import {connect} from "react-redux";
import {clone, findObject, getFromSetting, isEmpty, numberFormat, setItemRowData,} from "../../lib/functions";
import {v4 as uuid} from "uuid";


const Index = ({itemDetail,selectedaddon,updateItem,settings,setValidate}) => {

    let {itemaddon,addon} = itemDetail;
    let copyaddonList = clone(addon)


    let addtags = itemDetail?.addons || {}

    const {addongroups} = settings;


    let {addongroupid, addonid,autoaddon} = addtags || {addongroupid: [], addonid: [],autoaddon:[]};



    if(!isEmpty(selectedaddon)){
        selectedaddon?.map((addon)=>{
            if(!isEmpty(copyaddonList[addon.productid])) {
                copyaddonList[addon.productid] = {
                    ...copyaddonList[addon.productid],
                    ...addon
                }
            }
        })
    }

    const [moreaddon, setMoreAddon] = useState(clone(copyaddonList));

    const [addons,setAddons] = useState(addtags);



    useEffect(() => {

        try {
            if (isEmpty(addtags?.addongroupiddata)) {
                addtags = {
                    ...addtags,
                    addongroupiddata: {
                        '0000': {
                            ...addtags?.addoniddata,
                            selecteditems: addtags?.addonid?.map((item) => {
                                return {
                                    "itemid": item,
                                    productrate: copyaddonList[item].price,
                                    productratedisplay: copyaddonList[item].price
                                }
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

                if (Boolean(findaddons?.length)) {
                    addonid = addonid.concat(findaddons)
                }
            })

            addonid?.map((addon, key) => {
                const find = findObject(itemaddon, 'itemid', addon, true);
                if (Boolean(find)) {
                    moreaddon[addon] = {
                        ...moreaddon[addon],
                        ...find
                    }
                }
            })

            setMoreAddon(clone(moreaddon));
        }
        catch (e){
            console.log('e',e)
        }


    }, [])


    useEffect(() => {





        if(!isEmpty(autoaddon)) {
            autoaddon?.map((addon) => {
                if (!Boolean(moreaddon[addon].productqnt)) {
                    updateQnt(addon, 'autoadd')
                }
            })
        }
        else if(Boolean(addons) && Boolean(addons?.addongroupiddata)){
           Object.keys(addons?.addongroupiddata).map((key) => {
                const adddongroup = addons?.addongroupiddata[key];
                adddongroup?.autoadditems?.map((addon) => {
                    if (!Boolean(moreaddon[addon].productqnt)) {
                        updateQnt(addon, 'autoadd',key)
                    }
                })
            })
        }
        else{
            setValidate(true)
        }

        if(!isEmpty(selectedaddon)){
            setValidate(true)
        }


    }, [addons]);


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
            if (Boolean(find[0]?.productrate)) {
                moreaddon[key].price = find[0]?.productrate;
            }
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
       // let totalmin = addons?.addoniddata?.minrequired || 0;
        let totalmin =  0;
        let allval = 0

        Object.keys(addons?.addongroupiddata).map((key)=>{

            let addon = addons?.addongroupiddata[key];

            let totalgroupselected = selectedAddons?.filter((s)=>{
                return (s.itemgroupid == key && Boolean(addon.minrequired)) || key === '0000'
            })

            if(totalgroupselected.length >= addon.minrequired){
                allval += totalgroupselected.length
            }

            totalmin += addon.minrequired;
        });


        if(+allval >= +totalmin && ((totalmin === addons?.addoniddata?.minrequired) || !Boolean(addons?.addoniddata?.minrequired))){
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


                               let {itemname,  productqnt} = moreaddon[item.itemid];

                               const baseprice = item.productrate  || 0;

                               const addeditems = moreaddon && Object.values(moreaddon).filter((addon)=>{
                                   const find = Object.values(selecteditems).filter((item)=>{
                                       return (item.itemid === addon.itemid || item.itemid === addon.productid) && Boolean(addon?.productqnt)
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


        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        settings: state.restaurantDetail.settings,

    }
}

export default connect(mapStateToProps)(Index);
