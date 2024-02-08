import {Button} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {toast} from "react-toastify";
import apiService from "../../lib/api-service";
import {ACTIONS, COUPON_TYPE, GET_ITEM_TYPE, ITEM_TYPE, METHOD, STATUS} from "../../lib/static";
import {clone, getFloatValue, isEmpty} from "../../lib/functions";
import {v4 as uuidv4} from 'uuid';
import {getProductData, itemTotalCalculation} from "../../lib/item-calculation";
import {setCartData, setUpdateCart} from "../../lib/redux-store/reducer/cart-data";
import CouponCode from "./CouponCode";

const invoiceItemSortHighToLow = (aItem: any, bItem: any) => {
    return bItem.productratedisplay - aItem.productratedisplay;
};

const invoiceItemSortLowToHigh = (aItem: any, bItem: any) => {
    return aItem.productratedisplay - bItem.productratedisplay;
};

const DiscountCouponItem = (props: any) => {

    const {
        coupon: couponItem,
        couponToggleHandler
    } = props;

    const dispatch = useDispatch()

    const cartData = useSelector((state: any) => state?.cartData)

    let isInclusive = cartData?.vouchertaxtype === 'inclusive'

    const couponsData = useSelector((state: any) => state?.restaurantDetail?.coupon)

    const isCouponInDateRange = () => {
        let stringStartDate = couponItem?.startdate,
            stringEndDate = couponItem?.enddate;

        const currentStartOfDate = moment().startOf('day'),
            currentEndOfDate = moment().endOf('day'),
            startDate = moment(stringStartDate).startOf('day'),
            endDate = moment(stringEndDate).endOf('day');

        let couponStart = currentStartOfDate.diff(startDate, 'day');
        let couponEnd = endDate.diff(currentEndOfDate, 'day');

        return (couponStart >= 0) && (couponEnd >= 0)
    }

    const checkCouponValidForAfterTax = (afterTaxDiscount: boolean, currentCoupon: any, cartItems: any) => {
        if (!afterTaxDiscount) {
            return true;
        }
        let isDiscountCoupon = currentCoupon?.campaigndetail?.campaigntype == 'coupon';
        if (isDiscountCoupon && isEmpty(currentCoupon?.data?.offeritems)) {
            return true;
        }
        let couponItems = isDiscountCoupon ? currentCoupon?.data?.offeritems : currentCoupon?.data?.buyitems;

        if (isEmpty(cartItems) || isEmpty(couponItems)) {
            return false;
        }

        if (isDiscountCoupon) {
            return cartItems.every((cItem: any) => {
                let check: boolean = false;
                couponItems.forEach((bItems: any) => {
                    if (bItems.type == ITEM_TYPE.CATEGORY) {
                        if (isEmpty(bItems?.subitems)) {
                            if (cItem?.itemgroupid == bItems.itemid) {
                                check = true;
                            }
                        } else {
                            bItems?.subitems.forEach((sbItem: any) => {
                                if (cItem.productid == sbItem?.itemid) {
                                    check = true;
                                }
                            });
                        }
                    } else {
                        if (cItem.productid == bItems?.itemid) {
                            check = true;
                        }
                    }
                });
                return check;
            });
        }

        let copyCartItems: any = [];

        cartItems.forEach((item: any) => {

            try {
                [...Array(+item.productqnt)].forEach(() => {
                    copyCartItems.push({
                        ...item,
                        newitem             : false,
                        productqnt          : 1,
                        key                 : uuidv4(),
                        comboflag           : false,
                        couponApplied       : false,
                        productdiscountvalue: 0
                    });
                });
            } catch (e) {
                copyCartItems.push({
                    ...item
                });
            }
        });

        /**
         *  @param allItemChecked : item is used for c combination
         *  @param itemMatchedFound : is used for check for combination is matched or not
         */
        let allItemChecked = false,
            itemMatchedFound = true,
            infiniteCounter = 0,
            globalTotalQuantity: number = currentCoupon?.data?.minbuy,
            combinationTypeOr = currentCoupon?.data?.combinationtype == 'or';

        do {
            infiniteCounter++;
            if (infiniteCounter > copyCartItems.length) {
                allItemChecked = true;
                itemMatchedFound = false;
            }
            if (!allItemChecked) {
                couponItems.forEach((bItems: any) => {
                    if (itemMatchedFound) {
                        let totalItemQuantity = bItems.qnt;
                        copyCartItems
                            .forEach((copyItem: any, copyIndex: number) => {
                                if (!copyItem?.itemChecked && totalItemQuantity > 0) {
                                    if (bItems.type == ITEM_TYPE.CATEGORY) {
                                        if (isEmpty(bItems?.subitems)) {
                                            if (copyItem?.itemgroupid == bItems.itemid) {
                                                copyCartItems[copyIndex].itemChecked = true;
                                                globalTotalQuantity--;
                                                totalItemQuantity--;
                                            }
                                        } else {
                                            bItems?.subitems.forEach((sbItem: any) => {
                                                if (copyItem.productid == sbItem?.itemid) {
                                                    copyCartItems[copyIndex].itemChecked = true;
                                                    globalTotalQuantity--;
                                                    totalItemQuantity--;
                                                }
                                            });
                                        }
                                    } else {
                                        if (copyItem.productid == bItems?.itemid) {
                                            copyCartItems[copyIndex].itemChecked = true;
                                            globalTotalQuantity--;
                                            totalItemQuantity--;
                                        }
                                    }
                                }
                            });

                        if (!combinationTypeOr && totalItemQuantity > 0) {
                            itemMatchedFound = false;
                        }
                    }
                });

            }
            allItemChecked = copyCartItems.every((item: any) => Boolean(item?.itemChecked));
        } while (!allItemChecked && itemMatchedFound);
        if (globalTotalQuantity != 0) {
            itemMatchedFound = false;
        }
        return itemMatchedFound;
    };

    const getComboFlagData = (coupon: any, invoiceitems: any) => {

        const checkOfferMatch = (type: any, combination: any, totalQnt: any, offerItems: any, invoiceItems: any) => {
            return new Promise((resolve) => {
                let offerMatch = false;
                let cloneInvoiceItems = clone(invoiceItems);
                if (type == 'items') {

                    /**
                     *  Check Combination
                     */
                    if (combination == 'and') {
                        offerMatch = offerItems?.every((offerItem: any) => {
                            if (offerItem?.type == ITEM_TYPE.ITEM) {
                                return cloneInvoiceItems?.filter((invItem: any) => !Boolean(invItem?.comboflag))
                                    .some((invItem: any) => invItem.productid == offerItem?.itemid);
                            } else {
                                if (cloneInvoiceItems?.filter((invItem: any) => !Boolean(invItem?.comboflag))
                                    .some((invItem: any) => invItem.itemgroupid == offerItem?.itemid)) {
                                    if (!isEmpty(offerItem?.subitems)) {
                                        return offerItem?.subitems?.some((sbOfferItem: any) => {
                                            return cloneInvoiceItems?.filter((invItem: any) => !Boolean(invItem?.comboflag))
                                                .some((invItem: any) => invItem.productid == sbOfferItem?.itemid);
                                        });
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                    } else {
                        offerMatch = offerItems?.some((offerItem: any) => {
                            if (offerItem?.type == ITEM_TYPE.ITEM) {
                                return cloneInvoiceItems?.filter((invItem: any) => !Boolean(invItem?.comboflag))
                                    .some((invItem: any) => invItem.productid == offerItem?.itemid);
                            } else {
                                if (cloneInvoiceItems?.filter((invItem: any) => !Boolean(invItem?.comboflag))
                                    .some((invItem: any) => invItem.itemgroupid == offerItem?.itemid)) {
                                    if (!isEmpty(offerItem?.subitems)) {
                                        return offerItem?.subitems?.some((sbOfferItem: any) => {
                                            return cloneInvoiceItems?.filter((invItem: any) => !Boolean(invItem?.comboflag))
                                                .some((invItem: any) => invItem.productid == sbOfferItem?.itemid);
                                        });
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                    }


                    if (offerMatch) {
                        /**
                         * Check Total Quantity and item level Quantity
                         */
                        let requiredQuantity = totalQnt,
                            totalQuantity = 0;

                        offerItems?.forEach((offerItem: any) => {
                            let offerQuantity = offerItem.qnt,
                                itemsQuantity = 0;
                            if (offerItem?.type == ITEM_TYPE.ITEM) {
                                itemsQuantity = cloneInvoiceItems?.filter((invItem: any) => invItem.productid == offerItem?.itemid && !Boolean(invItem?.comboflag))
                                    .reduce((accumulator: any, currentObject: any) => {
                                        return accumulator + currentObject.productqnt;
                                    }, 0);
                            } else {
                                if (!isEmpty(offerItem?.subitems)) {
                                    offerItem?.subitems.forEach((sbOfferItem: any) => {
                                        let sbQuantity = cloneInvoiceItems?.filter((invItem: any) => invItem.productid == sbOfferItem?.itemid && !Boolean(invItem?.comboflag))
                                            .reduce((accumulator: any, currentObject: any) => {
                                                return accumulator + currentObject.productqnt;
                                            }, 0);
                                        itemsQuantity += sbQuantity;
                                    });
                                } else {
                                    itemsQuantity = cloneInvoiceItems?.filter((invItem: any) => invItem.itemgroupid == offerItem?.itemid && !Boolean(invItem?.comboflag))
                                        .reduce((accumulator: any, currentObject: any) => {
                                            return accumulator + currentObject.productqnt;
                                        }, 0);
                                }
                            }

                            totalQuantity += itemsQuantity;
                            if (combination == 'and') {
                                if (itemsQuantity < offerQuantity) {
                                    offerMatch = false;
                                }
                            }
                        });
                        if (totalQuantity < requiredQuantity) {
                            offerMatch = false;
                        }

                        if (offerMatch) {
                            let requiredQuantity = totalQnt,
                                itemQuantity = 0,
                                leftTotalQuantity = totalQnt;
                            offerItems?.forEach((offerItem: any) => {

                                if (itemQuantity < requiredQuantity) {
                                    let leftQuantity = offerItem.qnt;
                                    if (offerItem?.type == ITEM_TYPE.ITEM) {
                                        cloneInvoiceItems = cloneInvoiceItems.map((invItem: any) => {
                                            if (invItem.productid == offerItem.itemid && (combination == 'and' ? leftQuantity > 0 : leftTotalQuantity > 0) && !Boolean(invItem?.comboflag)) {
                                                leftQuantity--;
                                                leftTotalQuantity--;
                                                itemQuantity++;
                                                invItem.comboflag = true;
                                            }
                                            return invItem;
                                        });
                                    } else {
                                        cloneInvoiceItems = cloneInvoiceItems.map((invItem: any) => {
                                            if (!isEmpty(offerItem?.subitems)) {
                                                offerItem?.subitems.forEach((sbOfferItem: any) => {
                                                    if (invItem.productid == sbOfferItem.itemid && (combination == 'and' ? leftQuantity > 0 : leftTotalQuantity > 0) && !Boolean(invItem?.comboflag)) {
                                                        leftQuantity--;
                                                        leftTotalQuantity--;
                                                        itemQuantity++;
                                                        invItem.comboflag = true;
                                                    }
                                                });
                                            } else {
                                                if (invItem.itemgroupid == offerItem.itemid && (combination == 'and' ? leftQuantity > 0 : leftTotalQuantity > 0) && !Boolean(invItem?.comboflag)) {
                                                    leftQuantity--;
                                                    leftTotalQuantity--;
                                                    itemQuantity++;
                                                    invItem.comboflag = true;
                                                }
                                            }
                                            return invItem;
                                        });
                                    }
                                }

                            });
                        }
                    }
                }
                resolve({
                    offerMatch,
                    invoiceItems: cloneInvoiceItems
                });
            });
        };


        const setOrderItems = (offerItems: any, invoiceItems: any) => {
            return new Promise((resolve) => {
                let items = offerItems.map((item: any) => {
                    let foundItem = invoiceItems?.find((iItem: any) => iItem?.productid == item?.itemid);
                    return {
                        ...item,
                        productratedisplay: foundItem?.productratedisplay || 0
                    };
                });
                resolve(items);
            });
        };

        return new Promise(async (resolve) => {

            let couponData: any = {...coupon?.data};
            let buyOfferMatched = false,
                getOfferMatched = false;

            let combination = couponData?.buyitems?.length > 1 ? couponData?.combinationtype : 'or';

            if (couponData?.getitemtype == GET_ITEM_TYPE.LOWER) {
                invoiceitems = invoiceitems.sort(invoiceItemSortHighToLow);
                let buyItem: any = await setOrderItems(couponData?.buyitems, invoiceitems);
                buyItem = buyItem.sort(invoiceItemSortHighToLow);
                couponData.buyitems = buyItem;
            }
            if (couponData?.getitemtype == GET_ITEM_TYPE.HIGHER) {
                invoiceitems = invoiceitems.sort(invoiceItemSortLowToHigh);
                let buyItem: any = await setOrderItems(couponData?.buyitems, invoiceitems);
                buyItem = buyItem.sort(invoiceItemSortLowToHigh);
                couponData.buyitems = buyItem;
            }

            const checkBuyOfferMatched: any = await checkOfferMatch(couponData?.minmumtype, combination, couponData?.minbuy, couponData.buyitems, invoiceitems);
            buyOfferMatched = checkBuyOfferMatched.offerMatch;
            if (buyOfferMatched) {
                invoiceitems = checkBuyOfferMatched.invoiceItems;
                if (!isEmpty(couponData?.getitems)) {

                    if (couponData?.getitemtype == GET_ITEM_TYPE.LOWER) {
                        invoiceitems = invoiceitems.sort(invoiceItemSortLowToHigh);
                        let getItems: any = await setOrderItems(couponData?.getitems, invoiceitems);
                        getItems = getItems.sort(invoiceItemSortLowToHigh);
                        couponData.getitems = getItems;
                    }

                    if (couponData?.getitemtype == GET_ITEM_TYPE.HIGHER) {
                        invoiceitems = invoiceitems.sort(invoiceItemSortHighToLow);
                        let getItems: any = await setOrderItems(couponData?.getitems, invoiceitems);
                        getItems = getItems.sort(invoiceItemSortHighToLow);
                        couponData.getitems = getItems;
                    }

                    const checkGetOfferMatched: any = await checkOfferMatch('items', 'or', couponData?.anygetqnt, couponData.getitems, invoiceitems);
                    getOfferMatched = checkGetOfferMatched.offerMatch;
                    if (getOfferMatched) {
                        invoiceitems = checkGetOfferMatched.invoiceItems;
                    }
                } else {
                    getOfferMatched = true;
                }
            }

            resolve({
                buyOfferMatched,
                getOfferMatched,
                invoiceitems,
                foundCoupon: couponData
            });
        });
    };

    const getGroupComboFlagData = (foundCoupon: any, invoiceitems: any) => {
        return new Promise(async (resolve) => {
            let cloneInvoiceItems = clone(invoiceitems);
            const combos = foundCoupon?.data?.combogroups;
            let buyOfferMatched = false,
                getOfferMatched = false;
            for (const campaingid of combos) {
                if (!buyOfferMatched || !getOfferMatched) {
                    const subfoundCoupon: any = Object.values(couponsData)
                        .find((singleCoupon: any) => singleCoupon?.campaignid == campaingid);
                    if (!isEmpty(subfoundCoupon)) {
                        const result: any = await getComboFlagData(subfoundCoupon, cloneInvoiceItems);
                        buyOfferMatched = result?.buyOfferMatched;
                        getOfferMatched = result?.getOfferMatched;

                        if (buyOfferMatched && getOfferMatched) {
                            foundCoupon = subfoundCoupon;
                            cloneInvoiceItems = result.invoiceitems;
                        }

                    }
                }
            }

            resolve({
                buyOfferMatched,
                getOfferMatched,
                invoiceitems: cloneInvoiceItems,
                foundCoupon
            });

        });

    };

    const findItemNew = (offerItems: any, iItem: any) => {
        return offerItems?.find((bItem: any) => {
            if (bItem?.type == ITEM_TYPE.ITEM) {
                return bItem?.itemid == iItem?.productid;
            } else {
                if (bItem?.itemid == iItem?.itemgroupid) {
                    if (!isEmpty(bItem?.subitems)) {
                        return bItem?.subitems?.some((sitem: any) => sitem?.itemid == iItem?.productid);
                    }
                    return true;
                }
                return false;
            }
        });
    };

    const getDiscountValueAndTYpe = (foundItem: any, iItem: any, isInclusive: any) => {
        let discountType = '$',
            discountvalue = 0;
        if (['free', 'percentage'].some((type: string) => foundItem?.discountapplyby == type)) {
            discountType = '%';
            discountvalue = foundItem?.discountvalue;
        } else {
            if (!isInclusive) {
                discountvalue = iItem?.productratedisplay - foundItem?.discountvalue;
            } else {
                discountType = '%';
                let value = getFloatValue((foundItem?.discountvalue * 100) / iItem?.productratedisplay, 2);
                discountvalue = getFloatValue(100 - value);
            }
        }
        return {
            discountvalue,
            discountType
        };
    }

    const buyGetCalc = async () => {
        let coupon = couponItem;
        let cloneInvoiceItems = clone(cartData?.invoiceitems);

        let invoiceitems: any = [];
        cloneInvoiceItems.forEach((item: any) => {
            try {
                [...Array(+item.productqnt)].forEach(() => {
                    invoiceitems.push({
                        ...item,
                        newitem             : false,
                        productqnt          : 1,
                        key                 : uuidv4(),
                        comboflag           : false,
                        couponApplied       : false,
                        productdiscountvalue: 0, ...item?.itemdetail
                    });
                });
            } catch (e) {
                invoiceitems.push({
                    ...item
                });
            }
        });

        let comboCoupon = coupon;

        let validMatched = true,
            appliedOnce = false;

        let counter = 0;

        let maxReach = false;

        do {
            counter++;

            if (counter === 50) {
                validMatched = false;
                maxReach = true;
            }

            let data: any;

            if (comboCoupon?.campaigndetail?.campaigntype === COUPON_TYPE.GROUP) {
                data = await getGroupComboFlagData(comboCoupon, invoiceitems);
                coupon = data?.foundCoupon;
            } else {
                data = await getComboFlagData(comboCoupon, invoiceitems);
                coupon = {
                    ...coupon,
                    data: data?.foundCoupon
                };
            }

            if (data?.buyOfferMatched && data?.getOfferMatched) {

                invoiceitems = data.invoiceitems;

                appliedOnce = true;

                let newInvoiceItems: any = [];

                let leftQuantity = coupon?.data?.minbuy;
                let buyitems = coupon?.data?.buyitems;
                let getitems = coupon?.data?.getitems;
                let applyOnBuyItems = Boolean(coupon?.data?.onbuyitem);
                let position: number = 0;


                if (coupon?.data?.getitemtype == GET_ITEM_TYPE.LOWER) {
                    invoiceitems = invoiceitems.sort(invoiceItemSortHighToLow);
                }
                if (coupon?.data?.getitemtype == GET_ITEM_TYPE.HIGHER) {
                    invoiceitems = invoiceitems.sort(invoiceItemSortLowToHigh);
                }


                invoiceitems.forEach((iItem: any) => {

                    if (!isEmpty(newInvoiceItems)) {
                        let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                        let lastItem = allitems[allitems.length - 1];
                        position = lastItem?.position;
                    }

                    position = position + 1;

                    if (Boolean(iItem?.comboflag) && !Boolean(iItem?.couponApplied)) {

                        iItem.couponcode = coupon;

                        let foundItem = findItemNew(buyitems, iItem);

                        let subSoundItem = undefined;
                        if (foundItem?.type == ITEM_TYPE.CATEGORY && !isEmpty(foundItem?.subitems)) {
                            subSoundItem = foundItem?.subitems.find((sitem: any) => sitem?.itemid == iItem?.productid);
                        }

                        if (applyOnBuyItems) {

                            if (!isEmpty(foundItem) && leftQuantity > 0 && (Boolean((+foundItem?.discountvalue) > 0) || Boolean((+subSoundItem?.discountvalue) > 0))) {

                                if (leftQuantity >= iItem?.productqnt) {

                                    leftQuantity = leftQuantity - (+iItem?.productqnt);

                                    const {
                                        discountvalue,
                                        discountType
                                    } = getDiscountValueAndTYpe(Boolean((+subSoundItem?.discountvalue) > 0) ? subSoundItem : foundItem, iItem, isInclusive);

                                    newInvoiceItems = [...newInvoiceItems, {
                                        ...iItem,
                                        productdiscountvalue: discountvalue,
                                        productdiscounttype : discountType, // itemUpdate: true,
                                        position,
                                        itemindex           : 1 + newInvoiceItems?.length,
                                        couponApplied       : true
                                    }];

                                } else {
                                    let setproductqnt = (+iItem?.productqnt) - leftQuantity;
                                    let key: any = uuidv4();
                                    let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency);
                                    position = position + 1;

                                    const {
                                        discountvalue,
                                        discountType
                                    } = getDiscountValueAndTYpe(Boolean((+subSoundItem?.discountvalue) > 0) ? subSoundItem : foundItem, iItem, isInclusive);

                                    newInvoiceItems = [...newInvoiceItems, {
                                        ...iItem,
                                        productqnt          : leftQuantity,
                                        productdiscountvalue: discountvalue,
                                        productdiscounttype : discountType, // itemUpdate: true,
                                        position,
                                        itemindex           : 1 + newInvoiceItems?.length,
                                        couponApplied       : true
                                    }, {
                                        ...iItem,
                                        productqnt: setproductqnt, ...oldPrice, // itemUpdate: true,
                                        key,
                                        position  : position + 1,
                                        itemindex : 2 + newInvoiceItems?.length
                                    }];
                                    leftQuantity = 0;
                                }
                            } else {
                                let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency);
                                newInvoiceItems = [...newInvoiceItems, {
                                    ...iItem, ...oldPrice, // itemUpdate: true,
                                    position,
                                    itemindex: 1 + newInvoiceItems?.length
                                }];
                            }
                        } else {
                            if ((!isEmpty(foundItem) || !isEmpty(subSoundItem)) && Boolean(leftQuantity > 0)) {
                                if (leftQuantity >= iItem?.productqnt) {
                                    leftQuantity = leftQuantity - (+iItem?.productqnt);
                                    newInvoiceItems = [...newInvoiceItems, {
                                        ...iItem, // itemUpdate: true,
                                        position,
                                        itemindex    : 1 + newInvoiceItems?.length,
                                        couponApplied: true
                                    }];
                                } else {

                                    let setproductqnt = (+iItem?.productqnt) - leftQuantity;
                                    let key: any = uuidv4();
                                    position = position + 1;
                                    newInvoiceItems = [...newInvoiceItems, {
                                        ...iItem,
                                        productqnt   : leftQuantity, // itemUpdate: true,
                                        position,
                                        itemindex    : 1 + newInvoiceItems?.length,
                                        couponApplied: true
                                    }, {
                                        ...iItem,
                                        productqnt: setproductqnt, // itemUpdate: true,
                                        key,
                                        position  : position + 1,
                                        itemindex : 2 + newInvoiceItems?.length
                                    }];
                                    leftQuantity = 0;
                                }

                            } else {
                                newInvoiceItems = [...newInvoiceItems, {
                                    ...iItem, // itemUpdate: true,
                                    position,
                                    itemindex: 1 + newInvoiceItems?.length
                                }];
                            }

                        }

                    } else {
                        newInvoiceItems = [...newInvoiceItems, {
                            ...iItem, // itemUpdate: true,
                            position,
                            itemindex: 1 + newInvoiceItems?.length
                        }];
                    }
                });
                invoiceitems = clone(newInvoiceItems);

                newInvoiceItems = [];

                if (!isEmpty(getitems)) {

                    let leftQuantity = coupon?.data?.anygetqnt;
                    let position: number = 0;

                    if (coupon?.data?.getitemtype == GET_ITEM_TYPE.LOWER) {
                        invoiceitems = invoiceitems.sort(invoiceItemSortLowToHigh);
                    }
                    if (coupon?.data?.getitemtype == GET_ITEM_TYPE.HIGHER) {
                        invoiceitems = invoiceitems.sort(invoiceItemSortHighToLow);
                    }

                    invoiceitems.forEach((iItem: any, index: any) => {
                        if (!isEmpty(newInvoiceItems)) {
                            let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                            let lastItem = allitems[allitems.length - 1];
                            position = lastItem?.position;
                        }
                        position = position + 1;
                        if (Boolean(iItem?.comboflag) && !Boolean(iItem?.couponApplied)) {
                            let foundItem = findItemNew(getitems, iItem);
                            if (!isEmpty(foundItem) && leftQuantity > 0 && (+foundItem?.discountvalue) > 0) {
                                if (leftQuantity >= iItem?.productqnt) {
                                    leftQuantity = leftQuantity - (+iItem?.productqnt);

                                    const {
                                        discountvalue,
                                        discountType
                                    } = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);

                                    newInvoiceItems = [...newInvoiceItems, {
                                        ...iItem,
                                        productdiscountvalue: discountvalue,
                                        productdiscounttype : discountType, // itemUpdate: true,
                                        position,
                                        itemindex           : 1 + newInvoiceItems?.length,
                                        couponApplied       : true
                                    }];

                                } else {
                                    let setproductqnt = (+iItem?.productqnt) - leftQuantity;
                                    let key: any = uuidv4();
                                    let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency);


                                    const {
                                        discountvalue,
                                        discountType
                                    } = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);

                                    newInvoiceItems = [...newInvoiceItems, {
                                        ...iItem,
                                        productqnt          : leftQuantity,
                                        productdiscountvalue: discountvalue,
                                        productdiscounttype : discountType, // itemUpdate: true,
                                        position,
                                        itemindex           : 1 + newInvoiceItems?.length,
                                        couponApplied       : true
                                    }, {
                                        ...iItem,
                                        productqnt: setproductqnt, ...oldPrice, // itemUpdate: true,
                                        key,
                                        position  : position + 1,
                                        itemindex : 2 + newInvoiceItems?.length
                                    }];
                                    leftQuantity = 0;
                                }

                            } else {
                                let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency);
                                newInvoiceItems = [...newInvoiceItems, {
                                    ...iItem, ...oldPrice, // itemUpdate: true,
                                    position,
                                    itemindex: 1 + newInvoiceItems?.length
                                }];
                            }
                        } else {
                            newInvoiceItems = [...newInvoiceItems, {
                                ...iItem, // itemUpdate: true,
                                position,
                                itemindex: 1 + newInvoiceItems?.length
                            }];
                        }

                    });
                } else {
                    newInvoiceItems = invoiceitems;
                }

                invoiceitems = clone(newInvoiceItems);

            } else {
                validMatched = false;
            }
        } while (validMatched)


        if (appliedOnce) {
            if (maxReach) {
                maxReach = false;
                toast('Maximum 50 combos applied per order')
            }
            invoiceitems = invoiceitems?.map((item: any) => {
                return {
                    ...item,
                    itemUpdate: true,
                    change    : true
                };
            });

            console.log("A", coupon?.coupon)
            let newCartData: any = {
                ...cartData,
                invoiceitems        : clone(invoiceitems),
                combocoupon         : true,
                couponsname         : coupon?.coupon,
                voucherdiscountplace: 'beforetax',
            };

            if (isEmpty(newCartData?.coupons)) {
                newCartData = {
                    ...newCartData,
                    coupons: []
                };
            }

            newCartData = {
                ...newCartData,
                coupons: [...newCartData?.coupons, {
                    ...coupon,
                    name: coupon?.coupon
                }]
            };

            if (coupon?.data?.discountplace) {
                newCartData = {
                    ...newCartData,
                    voucherdiscountplace: coupon?.data?.discountplace
                };
            }

            let data = itemTotalCalculation(clone(newCartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
            dispatch(setCartData(clone(data)));
            dispatch(setUpdateCart());
            couponToggleHandler()
        } else {
            toast('Coupon not applicable')
        }
    }

    const discountCalc = (afterTaxDiscount: any) => {

        let foundCoupon = couponItem;

        let {
            amount,
            discounttype,
            mintotal,
            clientrequired,
            usewithother,
            maxdiscount
        } = foundCoupon;

        let belowTotal = (+mintotal) > (+cartData?.vouchertotaldisplay),
            inValidFixDiscount = isInclusive && discounttype == 'fixed', // afterTaxDisocunt   = isInclusive && foundCoupon?.data?.discountplace == 'aftertax',
            afterTaxDisocunt = false,
            isClientRequired = Boolean(+clientrequired) && Boolean(+cartData?.clientid == 1),
            isSpecific = Boolean(foundCoupon?.data?.specificitems) && !isEmpty(foundCoupon?.data?.offeritems),
            foundAnySpecific = false;

        if (isSpecific && !isEmpty(cartData?.invoiceitems)) {
            foundAnySpecific = cartData?.invoiceitems?.some((item: any) => {
                return foundCoupon?.data?.offeritems?.some((oItem: any) => {
                    if (oItem?.type == ITEM_TYPE.CATEGORY) {
                        if (oItem?.itemid == item?.itemgroupid) {
                            if (!isEmpty(oItem?.subitems)) {
                                return oItem?.subitems?.some((sOItem: any) => sOItem?.itemid == item?.productid);
                            }
                            return true;
                        }
                        return false;
                    }
                    return oItem?.itemid == item?.productid;
                });
            });
        }

        if (belowTotal || inValidFixDiscount || isClientRequired || (isSpecific && !foundAnySpecific)) {
            let message = `Something went wrong`;
            if ((isSpecific && !foundAnySpecific)) {
                message = `Coupon not applicable.`;
            } else if (inValidFixDiscount) {
                message = `Fix amount coupon not valid for inclusive tax`;
            } else if (belowTotal) {
                message = `Coupon applied on more than ${mintotal} amount`;
            } else if (isClientRequired) {
                message = 'Please select client for apply this coupon';
            } else if (afterTaxDisocunt) {
                message = 'After Tax Discount Type Coupon not valid for inclusive tax';
            }
            toast(message)
        } else {
            /**
             * CHECK DISCOUNT ON SOME SPECIFIC ITEMS OR CATEGORY
             */
            if (!afterTaxDiscount && (Boolean(foundCoupon?.data?.specificitems) && !isEmpty(foundCoupon?.data?.offeritems))) {


                let discountResponse = discountWithSpecificItems(foundCoupon, cartData);
                console.log("B", discountResponse?.coupon)
                let newCartData: any = {
                    ...cartData,
                    invoiceitems        : discountResponse.invoiceitems,
                    couponsname         : discountResponse?.coupon?.coupon,
                    combocoupon         : true,
                    voucherdiscountplace: foundCoupon?.data?.discountplace || 'beforetax'
                };
                if (isEmpty(newCartData?.coupons)) {
                    newCartData = {
                        ...newCartData,
                        coupons: []
                    };
                }

                newCartData = {
                    ...newCartData,
                    coupons: [...newCartData?.coupons, {
                        ...foundCoupon,
                        name: foundCoupon?.coupon
                    }]
                };
                let data = itemTotalCalculation(clone(newCartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
                dispatch(setCartData(clone(data)));
                dispatch(setUpdateCart());
                couponToggleHandler()

            } else {

                let validCoupon = checkCouponValidForAfterTax(afterTaxDiscount, foundCoupon, cartData?.invoiceitems);

                if (!validCoupon) {
                    toast('For this coupon you can not add other items Or item combination not matched!')
                    return;
                }

                foundCoupon = getNewCouponAmount(foundCoupon, cartData, isInclusive, afterTaxDiscount);

                discounttype = foundCoupon?.discounttype == 'percentage' ? '%' : '$';
                if (afterTaxDiscount) {
                    if (foundCoupon?.campaigndetail?.campaigntype != 'coupon') {
                        foundCoupon = {
                            ...foundCoupon,
                            amount: 100
                        };
                    }
                }

                let passamount = foundCoupon.amount;

                console.log("passamount 1", passamount)
                if (!isInclusive) {
                    console.log("passamount 2", passamount, discounttype)
                    if (discounttype === '$') {
                        let totalAmount = cartData?.vouchertaxabledisplay;
                        console.log("passamount 3", passamount)
                        if (afterTaxDiscount) {
                            totalAmount = cartData?.totalwithoutroundoffdisplay;
                            console.log("passamount 4", passamount)
                        }
                        console.log("passamount 5", passamount)
                        passamount = totalAmount < passamount ? totalAmount : passamount;
                        console.log("passamount 6", passamount)
                    }
                }

                console.log("passamount 7", passamount)

                if (afterTaxDiscount) {
                    isInclusive = false;
                }

                let invoiceitems: any = cartData.invoiceitems.map((item: any) => {
                    if (isInclusive) {
                        item = {
                            ...item,
                            productdiscountvalue: passamount,
                            productdiscounttype : discounttype
                        };
                    }
                    return {
                        ...item,
                        change: true
                    };
                });
                console.log("C", foundCoupon?.coupon)
                let newCartData: any = {
                    ...cartData,
                    invoiceitems,
                    couponsname         : foundCoupon?.coupon,
                    combocoupon         : true,
                    voucherdiscountplace: foundCoupon?.data?.discountplace || 'beforetax',
                    globaldiscountvalue : isInclusive ? 0 : passamount,
                    discounttype        : discounttype,
                    updatecart          : true,
                };

                if (isEmpty(newCartData?.coupons)) {
                    newCartData = {
                        ...newCartData,
                        coupons: []
                    };
                }

                newCartData = {
                    ...newCartData,
                    coupons: [...newCartData?.coupons, {
                        ...foundCoupon,
                        name: foundCoupon?.coupon
                    }]
                };
                let data = itemTotalCalculation(clone(newCartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
                dispatch(setCartData(clone(data)));
                dispatch(setUpdateCart());
                couponToggleHandler()
            }
        }
    }

    const onClickCouponHandler = async () => {

        if (!isEmpty(cartData?.coupons)) {
            toast("One Coupon Applied, clear coupon to use another coupon")
            return;
        }

        // CHECK DATE RANGE
        let isValidRange = isCouponInDateRange();

        // CHECK COUPON IS AFTER TAX OR BEFORE TAX
        let afterTaxDiscount = couponItem?.data?.discountplace === 'aftertax';

        // CHECK IS DISCOUNT COUPON
        let isDiscountCoupon = couponItem?.campaigndetail?.campaigntype === 'coupon';

        // CHECK COUPON TYPE CLIENT OR GLOBAL
        let isUsageClientType = couponItem?.data?.usagetype === 'client';

        // CHECK COUPON USE LIMIT
        let limitCount = couponItem?.uselimit;
        let usageLimit = limitCount > 0;

        // SELECTED CLIENT ID
        let clientId = Boolean(+cartData?.clientid);

        // DEFAULT SET CLIENT SELECTED TRUE
        let clientSelected = true;

        // DEFAULT SET COUPON USED BY SELECTED CLIENT FALSE
        let couponAlreadyUsedByClient = false;

        if (!isDiscountCoupon) {
            limitCount = couponItem?.data?.uselimit;
            usageLimit = limitCount > 0;
        }

        if (isUsageClientType && usageLimit) {
            if (clientId) {
                clientSelected = Boolean(+cartData?.clientid > 1);
                let response = await apiService({
                    action     : ACTIONS.COUPON_CLIENT,
                    method     : METHOD.GET,
                    queryString: {
                        clientid: cartData?.clientid,
                        couponid: couponItem?.couponid
                    }
                });
                if (response?.status === STATUS.SUCCESS && !isEmpty(response?.data)) {
                    couponAlreadyUsedByClient = response?.data?.used >= limitCount;
                }
            }
        }

        if (isValidRange && clientSelected && !couponAlreadyUsedByClient) {
            if ([COUPON_TYPE.COMBO, COUPON_TYPE.GROUP].some((type: string) => type == couponItem?.campaigndetail?.campaigntype) && !afterTaxDiscount) {
                await buyGetCalc()
            } else {
                discountCalc(afterTaxDiscount)
            }
        } else {
            let message = ''
            if (isValidRange) {
                message = `${couponItem?.coupon} is expired`
            } else if (clientSelected) {
                message = `Please login to use this coupon`
            } else if (!couponAlreadyUsedByClient) {
                message = `${couponItem?.coupon} coupon already used by client`
            }
            toast(message)
        }

        // couponToggleHandler()
    }

    const getNewCouponAmount = (coupon: any, cartData: any, isInclusive: any, afterTaxDiscount?: boolean) => {

        /**
         * CHECK DISCOUNT TYPE IS PERCENTAGE AND COUPON HAVE MAX DISCOUNT AMOUNT
         */

        if (coupon?.discounttype == 'percentage' && +coupon?.maxdiscount) {
            let decimalValue = cartData?.currentDecimalPlace || 2;

            /**
             * CHECK DISCOUNT AMOUNT AND COMPARE WITH MAX DISCOUNT AMOUNT
             */

            let totalCheck = cartData?.vouchertaxabledisplay;
            if (afterTaxDiscount) {
                totalCheck = cartData?.totalwithoutroundoffdisplay;
            }

            let getDiscountAmount = getFloatValue(totalCheck * (+coupon?.amount * 0.01), decimalValue);
            if (getDiscountAmount > coupon?.maxdiscount) {

                /**
                 * IF DISCOUNT AMOUNT IS MORE THAN MAX DISCOUNT AMOUNT
                 *
                 *    IF VOUCHER TAX TYPE IS INCLUSIVE
                 *        THEN FIND NEW PERCENTAGE VALUE BASE ON MAX DISCOUNT AMOUNT
                 *    ELSE
                 *        SET MAX DISCOUNT VALUE IN COUPON AMOUNT
                 *        AND CHANGE DISCOUNT TYPE 'PERCENTAGE TO FIXED'
                 *
                 */

                if (isInclusive) {

                    let totalAmount = cartData?.vouchertaxabledisplay;
                    if (afterTaxDiscount) {
                        totalAmount = cartData?.totalwithoutroundoffdisplay;
                    }

                    let foundDiscountAmount = (coupon?.maxdiscount / totalAmount) * 100;
                    coupon = {
                        ...coupon,
                        amount       : getFloatValue(foundDiscountAmount, decimalValue),
                        printdiscount: coupon?.maxdiscount
                    };
                } else {
                    coupon = {
                        ...coupon,
                        amount      : coupon?.maxdiscount,
                        discounttype: 'fixed'
                    };
                }
            }
        } else if (coupon?.discounttype == 'fixed' && +coupon?.maxdiscount) {
            let totalAmount = cartData?.vouchertaxabledisplay;
            if (afterTaxDiscount) {
                totalAmount = cartData?.totalwithoutroundoffdisplay;
            }
            let amount = totalAmount < coupon?.maxdiscount ? totalAmount : coupon?.maxdiscount;
            coupon = {
                ...coupon,
                amount,
                discounttype: 'fixed'
            };
        }
        return coupon;
    };

    const discountWithSpecificItems = (coupon: any, cartData: any) => {

        if (coupon?.discounttype == 'fixed') {
            coupon = {
                ...coupon,
                maxdiscount: coupon?.amount
            };
        } else {
            coupon = {
                ...coupon,
                discounttype: 'percentage'
            };
        }

        let decimalValue = cartData?.currentDecimalPlace || 2;

        let totalDiscountAmount = 0,
            totalTaxableAmount = 0,
            newInvoiceItems: any = [];
        cartData?.invoiceitems.forEach((item: any) => {
            if (!isEmpty(findItemNew(coupon?.data?.offeritems, item))) {
                totalTaxableAmount += item?.producttaxabledisplay;
            }
        });

        coupon = getNewCouponAmount(coupon, {
            currentDecimalPlace  : decimalValue,
            vouchertaxabledisplay: totalTaxableAmount
        }, true);

        totalDiscountAmount = 0;
        totalTaxableAmount = 0;
        newInvoiceItems = [];
        cartData?.invoiceitems.forEach((item: any) => {
            if (!isEmpty(findItemNew(coupon?.data?.offeritems, item))) {
                let getDiscountAmount = getFloatValue(item?.producttaxabledisplay * (+coupon?.amount * 0.01), decimalValue);
                totalDiscountAmount += getDiscountAmount;
                totalTaxableAmount += item?.producttaxabledisplay;
                item = {
                    ...item,
                    productdiscountvalue: coupon?.amount,
                    productdiscounttype : coupon?.discounttype == 'percentage' ? '%' : '$',
                    itemUpdate          : true,
                    change              : true
                };
            }

            newInvoiceItems = [...newInvoiceItems, item];
        });

        if (Boolean(+coupon?.maxdiscount) && getFloatValue(totalDiscountAmount) > +coupon?.maxdiscount) {
            coupon = getNewCouponAmount(coupon, {
                currentDecimalPlace  : decimalValue,
                vouchertaxabledisplay: totalTaxableAmount
            }, true);

            totalDiscountAmount = 0;
            totalTaxableAmount = 0;
            newInvoiceItems = [];
            cartData?.invoiceitems.forEach((item: any) => {
                if (!isEmpty(findItemNew(coupon?.data?.offeritems, item))) {
                    let getDiscountAmount = getFloatValue(item?.producttaxabledisplay * (+coupon?.amount * 0.01), decimalValue);
                    totalDiscountAmount += getDiscountAmount;
                    totalTaxableAmount += item?.producttaxabledisplay;
                    item = {
                        ...item,
                        productdiscountvalue: coupon?.amount,
                        productdiscounttype : coupon?.discounttype == 'percentage' ? '%' : '$',
                        itemUpdate          : true,
                        change              : true
                    };
                }

                newInvoiceItems = [...newInvoiceItems, item];
            });

        }

        return {
            coupon,
            invoiceitems: clone(newInvoiceItems)
        };
    };

    return <div className={'border border-2 mb-4 radius-5px '}>
        <div className={"p-3"}>
            <h6>{couponItem?.campaigndetail?.campaignname}</h6>
            <CouponCode>{couponItem?.coupon}</CouponCode>
        </div>

        <div>
            <Button className={"w-100"} onClick={onClickCouponHandler}>
                Apply
            </Button>
        </div>
    </div>
}

export default DiscountCouponItem;
