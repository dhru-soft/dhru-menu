import $ from "jquery";
import React from "react";
import apiService from "./api-service";
import {ACTIONS, device, localredux, METHOD, STATUS, urls} from "./static";
import {setrestaurantData} from "./redux-store/reducer/restaurant-data";
import store from "./redux-store/store";
import moment from "moment";
import {setCartItems, updateCartField, updateCartItems} from "./redux-store/reducer/cart-data";
import {v4 as uuid} from "uuid";
import {setItemDetail} from "./redux-store/reducer/item-detail";
import promise from "promise";
import {getProductData} from "./item-calculation";
import {setModal} from "./redux-store/reducer/component";
import ItemDetails from "../pages/Cart/ItemDetails";
var ls = require('local-storage');



window.dataLayer = window.dataLayer || [];

export const scrollToTop = () => {
    let path = window.location.pathname;
    let page = path.split("/").pop();


    window.scrollTo(0, 0);
}


export const transformRequest = (array) => {
    let str = [];
    for (let p in array)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(array[p]));
    return str.join("&");
}

export const _accordion = () => {
    var oAccordion = $('.accordion-container');

    if (oAccordion.length > 0) {

        var oAccItem = oAccordion.find('.accordion-item'),
            oAccTrigger = oAccordion.find('.accordion-toggler');

        oAccordion.each(function (i, accordion) {
            $(accordion).find('.accordion-item:eq(0)').addClass('active');
        });

        oAccTrigger.on('click', function (j) {
            j.preventDefault();

            var $this = $(this),
                parent = $this.parent(),
                dropDown = $this.next('article');

            parent.toggleClass('active').siblings(oAccItem).removeClass('active').find('article').not(dropDown).slideUp();

            dropDown.stop(false, true).slideToggle();

            return false;
        });
    }

};


export const getDefaultCurrency = () => {
    const currency = getFromSetting('currency');
    if(!isEmpty(currency)) {
        const code = Object.keys(currency)?.find((k) => currency[k]?.rate === "1") || {}
        return {...currency[code], code};
    }
    return   {decimalplace:3,code:'USD'}
}

export const numberFormat = (value) => {

    const {decimalplace,code} = getDefaultCurrency()

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
    }).format(value);
}
export const scrollTo = (hash) => {
    const scrollToAnchor = () => {
        const hashParts = hash.split('#');
        if (hashParts.length > 2) {
            const hash = hashParts.slice(-1)[0];
            document.querySelector(`#${hash}`).scrollIntoView();
        }
    };
    scrollToAnchor();
    window.onhashchange = scrollToAnchor;
}


export const validUrl = (string) => {
    if (!string) {
        return false;
    }
    return string.replace(/[^a-zA-Z0-9]/g, '-');
}

export const objToArray = (data, key) => {
    if (data) {
        let result = [];
        for (let i in data) {
            if (i && data[i]) {
                if (!key) {
                    data[i]['__key'] = i;
                }
                result.push(data[i]);
            }
        }
        return result;
    }
};

export const getNestedChildren = (arr, find, mid, id) => {
    var out = [];
    for (let i in arr) {
        if (arr[i][mid] === find) {
            let sub = getNestedChildren(arr, arr[i][id], mid, id);
            arr[i].sub = sub;
            out.push(arr[i]);
        }
    }
    return out
};

export const nestedGroupList = (arr, find, mid, id, module) => {
    if (arr) {
        return Object.values(arr).filter((pg) => {
            return pg[mid] === find;
        }).map((pg => {
            return {...pg, module: pg[module], children: nestedGroupList(arr, pg[id], mid, id, module)}
        }));
    } else {
        return []
    }
};


export const clone = (obj) => {
    var copy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
};

export const map = (object, callback) => {
    return Object.keys(object).map(function (key) {
        return callback(key, object[key]);
    });
};

export const findObject = (array, field, value) => {
    let find = array.filter(function (item) {
        return item[field] === value
    });
    return find[0];
};


export const filterObject = (array, field, value) => {
    let find = array.filter(function (item) {
        return item[field] === value
    });
    return find;
};

export function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}



export const wait = (time, signal) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            resolve();
        }, time);
        signal?.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject();
        });
    });
}


export const shortName = (str) => {

    if (Boolean(str)) {
        const firstLetters = str
            .split(' ')
            .map((word) => word[0])
            .join('');
        return firstLetters.substring(0, 2).toUpperCase();
    }
    return
}

/*export const checkLocation = () => {
        const params = useParams()
     if(!Boolean(params?.locationid)){
         return false
     }
     return true
}*/

export const postQrCode = async (accesscode) => {
    return new promise(async (resolve)=>{
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.CODE,
            queryString:{code:accesscode},
            workspace:'dev',
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                resolve(result.data)
            }
            else{
                resolve({})
            }
        });
    })
}

export const getInit = async (workspace) => {

    return new promise(async (resolve)=>{
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        await apiService({
            method: METHOD.GET,
            action: ACTIONS.INIT,
            queryString:{tableid:params?.table?params.table:''},
            workspace:workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                device.workspace = workspace;
                const {settings} = result.data
                localredux.settings = settings;
                store.dispatch(setrestaurantData({...result.data}))
                resolve(true)
            }
            else{
                device.workspace = ''
                resolve(false)
            }

        });
    })


}


export const getWorkspaceName = () => {
    let workspace = window.location.hostname.split(".")[0]
    if (workspace === "localhost" || workspace === "dhru"  ||  workspace === "menu" || workspace === "www") {
        workspace = ""
    }
    device.workspace = workspace
    return workspace
}


export const storeData = async (key, value) => {
    try {
        ls.set(key, JSON.stringify(value));
        return true
    } catch (error) {
        return false;
    }
};

export const retrieveData = async (key) => {
    return await ls.get(key).then((data) => {
        return JSON.parse(data);
    });
};

export const saveLocalSettings = async (key, setting) => {
    await retrieveData(`fusion-dhru-menu-settings`).then(async (data) => {
        data = {
            ...data,
            [key]: setting
        }
        await storeData('settings',data)
    })
}


export const getLocalSettings = async (key) => {
    return new Promise(async resolve => {
        await retrieveData(`fusion-dhru-menu-settings`).then(async (data) => {
            if (Boolean(data) && Boolean(data[key])) {
                resolve(data[key])
            } else {
                resolve(false)
            }
        })
    })
}


export const getDefaultPayment = () => {
    return [{paymentby: "Pay Later", label: "Pay Later"}];
}


/* export const voucherData = (voucherKey, isPayment = true, isTaxInvoice= false) => {

    let {initData, licenseData, staffData, localSettingsData, loginuserData} = localredux;

    let payment = getDefaultPayment()

    let paymentmethod = Object.keys(initData?.paymentgateway).find((key) => {
        let data1 = Object.keys(initData?.paymentgateway[key]).filter((k1) => k1 !== "settings");
        return isEmpty(data1) ? false : data1[0] === 'cash'
    })

    if (paymentmethod) {
        let paymentby = initData?.paymentgateway[paymentmethod]["cash"].find(({input}) => input === "displayname")
        payment = [{paymentmethod, paymentby: paymentby?.value, type: "cash"}]
    }

    if (Boolean(localSettingsData?.taxInvoice)) {
        let taxVoucherKey = getVoucherKey("vouchertypename", "Tax Invoices");
        if (taxVoucherKey) {
            voucherKey = taxVoucherKey;
            payment = [{paymentby: "Pay Later"}]
        }
    }

    let voucherTypeData = initData?.voucher[voucherKey]

    const utcDate = moment().format("YYYY-MM-DD HH:mm:ss")

    let date = getDateWithFormat(utcDate, "YYYY-MM-DD"),
        vouchercreatetime = getDateWithFormat(utcDate, 'HH:mm:ss')

    let currencyData = getCurrencyData();

    let local = utcDate;

    const {state} = initData.general

    let data = {
        localdatetime: local,
        date,
        voucherdate: date,
        duedate: local,
        vouchercreatetime,
        time: moment(utcDate).unix(),
        currency: currencyData.__key,
        currentDecimalPlace: currencyData?.decimalplace || 2,
        locationid: licenseData?.data?.location_id,
        terminalid: localredux?.licenseData?.data?.terminal_id,
        terminalname: localredux?.licenseData?.data?.terminal_name,
        staffid: parseInt(loginuserData?.adminid),
        staffname: loginuserData?.username,
        vouchercurrencyrate: currencyData.rate,
        vouchertaxtype: voucherTypeData?.defaulttaxtype || Object.keys(taxTypes)[0],
        roundoffselected: voucherTypeData?.voucherroundoff,
        voucherdiscountplace: voucherTypeData?.discountplace,
        vouchertransitionaldiscount: Boolean(voucherTypeData?.vouchertransitionaldiscount) || voucherTypeData?.vouchertransitionaldiscount === "1",
        canchangediscoutnaccount: Boolean(voucherTypeData?.vouchertransitionaldiscount) || voucherTypeData?.vouchertransitionaldiscount === "1",
        discountaccunt: voucherTypeData?.defaultdiscountaccount,
        vouchertypeid: voucherTypeData?.vouchertypeid,
        vouchertype: voucherTypeData?.vouchertype,
        vouchernotes: voucherTypeData?.defaultcustomernotes,
        toc: voucherTypeData?.defaultterms,
        selectedtemplate: voucherTypeData?.printtemplate,
        paymentmethod: payment[0]?.paymentmethod,
        payment: payment,
        edit: true,
        paxes: 1,
        deviceid:device.uniqueid,
        "placeofsupply": state,
        "updatecart": false,
        "debugPrint": true,
        "shifttable": false,
        "taxInvoice": false,
    }

    return data;
}*/


export const voucherTotal = (items, vouchertaxtype) => {

    try {

        let vouchertotaldisplay = 0;

        let taxesList = getFromSetting('tax');


        const taxCalculation = (tax, taxableValue, qnt) => {
            let totalTax = 0;
            if (!isEmpty(tax?.taxes)) {
                tax?.taxes?.forEach((tx) => {
                    let taxpriceDisplay = tx?.taxpercentage * taxableValue;
                    taxpriceDisplay = getFloatValue(taxpriceDisplay / 100);
                    totalTax += getFloatValue(taxpriceDisplay * qnt, 4);
                })
            }
            return totalTax;
        }

        items.forEach((item) => {

            const {productratedisplay, productqnt, itemtaxgroupid} = item;

            vouchertotaldisplay += productratedisplay * productqnt;

            if (!isEmpty(taxesList) && !isEmpty(taxesList[itemtaxgroupid]) && vouchertaxtype === 'exclusive') {
                vouchertotaldisplay += taxCalculation(taxesList[itemtaxgroupid], productratedisplay, productqnt)
            }

            if (Boolean(item?.itemaddon?.length)) {
                item?.itemaddon?.forEach(({pricing, productqnt, itemtaxgroupid}) => {
                    const pricingtype = pricing?.type;
                    const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;
                    vouchertotaldisplay += baseprice * productqnt
                    if (!isEmpty(taxesList) && !isEmpty(taxesList[itemtaxgroupid]) && vouchertaxtype === 'exclusive') {
                        vouchertotaldisplay += taxCalculation(taxesList[itemtaxgroupid], baseprice, productqnt)
                    }

                })
            }
        })

        return vouchertotaldisplay
    }
    catch (e) {
        console.log('e',e)
    }

}


export const removeItem = async (unique) => {
    const invoiceitems = store.getState().cartData.invoiceitems || {}
    try {
        const filtered = invoiceitems?.filter((item) => {
            return item.key !== unique
        })

        if (Boolean(filtered?.length > 0)) {
            await store.dispatch(updateCartItems(clone(filtered)));
        } else {
            await store.dispatch(updateCartField({invoiceitems: []}))
        }
    } catch (e) {
        console.log('e', e)
    }
}


export const setItemRowData = (data) => {

    try {

        let isInward  = false;

        let {cartData} = store.getState();

        const unit = getFromSetting('unit')

        let unittype = unit[data?.itemunit]

        let pricingTemplate =   undefined

        let isDepartmentSelected = false;


        let {
            itemid,
            itemname,
            itemtaxgroupid,
            pricing,
            productqnt,
            itemmaxqnt,
            salesunit,
            stockonhand,
            inventorytype,
            identificationtype,
            itemhsncode,
            itemtype,
            committedstock,
            itemminqnt,
            itemaddon,
            itemtags,
            notes,
            hasAddon,
            mrp,
            key
        } = data;


        let recurring = undefined, producttaxgroupid, productqntunitid;

        if (pricing?.type !== "free" &&
            pricing.price &&
            pricing.price.default &&
            pricing.price.default[0] &&
            pricing.price.default?.length > 0) {
            recurring = Object.keys(pricing.price.default[0])[0];
        }

        if (Boolean(salesunit)) {
            productqntunitid = salesunit;
        }

        if (Boolean(itemtaxgroupid)) {
            producttaxgroupid = itemtaxgroupid;
        }

        const defaultCurrency = getDefaultCurrency().code

        let additem = {
            identificationtype,
            productid: itemid,
            productdisplayname: itemname,
            productqnt: productqnt || (Boolean(itemminqnt) ? itemminqnt : 1),
            producttaxgroupid,
            pricingtype: pricing.type,
            recurring,
            minqnt: Boolean(itemminqnt) ? parseFloat(itemminqnt) : undefined,
            maxqnt: Boolean(itemmaxqnt) ? parseFloat(itemmaxqnt) : undefined,
            productqntunitid,
            displayunitcode: unittype?.unitcode || '',
            "accountid": 2,
            clientid: cartData?.clientid,
            productdiscounttype: "%",
            stockonhand,
            hsn: itemhsncode,
            itemtype: itemtype === "service" ? "service" : "goods",
            committedstock,
            inventorytype,
            itemaddon,
            itemtags,
            notes,
            mrp,
            hasAddon,
            isDepartmentSelected,
            ...getProductData(data, defaultCurrency, defaultCurrency, undefined, undefined, isInward, pricingTemplate)
        }


        additem.key = key;
        additem.change = true;
        additem.newitem = true;

        return additem;


    } catch (e) {
        console.log('e',e)
    }

}

export const getItemById = async (itemid) => {
    return new promise(async (resolve)=>{
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: {locationid:device.locationid,itemid:itemid},
            hideLoader:true,
            workspace: device.workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                store.dispatch(setItemDetail(result?.data))
                resolve(result?.data)
            }
        });
    })

}

export const addItem =  async (item) =>{
    const {hasextra,itemname} = item
    if(hasextra) {
        store.dispatch(setItemDetail(item));
        store.dispatch(setModal({
            show: true,
            title: itemname,
            height: '80%',
            component: () => <><ItemDetails   /></>
        }))
    }
    else{
        addToCart(item).then(r => { })
    }
}


export const addToCart = async (item) => {

    let getdetail = {};
    if(Boolean(item.price)){
        getdetail = await getItemById(item.itemid)
    }

    try {
        item = {
            ...item,
            ...getdetail,
            added: true,
            productqnt:1,
            deviceid:'browser'
        }

        const itemRowData = setItemRowData(item);
        item = {
            ...item,
            ...itemRowData,
        }

        await store.dispatch(setCartItems(item))

    } catch (e) {
        console.log(e)
    }

}



export const currencyRate = (currencyName) => {
    const currency = getFromSetting('currency');
    const rate = currency[currencyName].rate
    return parseFloat(rate);
}

export const getFloatValue = (value, fraxtionDigits = 4, notConvert = true, isLog = false) => {
    if (!Boolean(fraxtionDigits)) {
        fraxtionDigits = 4;
    }
    let returnValue  = 0;
    if (Boolean(value) && !isNaN(value)) {
        const general = getFromSetting('general');
        let newstring = new Intl.NumberFormat('en-' + general?.defaultcountry,
            {
                style: "decimal",
                maximumFractionDigits: fraxtionDigits
            }).format(value)
        returnValue = parseFloat(newstring.replaceAll(",", ""))
    }
    return returnValue;
}

export const getFromSetting = (key) => {
    const {settings} = localredux;
    if(!isEmpty(settings)){
        return settings[key]
    }
    return {}
}
