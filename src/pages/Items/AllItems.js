import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { connect } from "react-redux";
import { device } from "../../lib/static";
import {
    getCompanyDetails,
    getGroups,
    groupBy,
    isEmpty,
    toArray,
} from "../../lib/functions";
import Loader3 from "../../components/Loader/Loader3";
import BodyClassName from "react-body-classname";
import Theme from "../Home/Theme";
import CompanyDetail from "../Navigation/CompanyDetail";
import CartTotal from "../Cart/CartTotal";
import { useParams } from "react-router-dom";
import { Card, CardBody, UncontrolledCollapse } from "reactstrap";
import { ItemBox } from "./ItemsbyGroup";
import { Element, Events, scroller } from "react-scroll";
import CartHeader from "../Cart/CartHeader";

// 🔹 Merge invoice items with existing items (adds mergeqnt)
export const mergeCart = (items, invoiceitems) => {
    if (!isEmpty(items)) {
        const qntbyitem = {};
        invoiceitems.forEach((item) => {
            if (!qntbyitem[item.itemid]) qntbyitem[item.itemid] = 0;
            qntbyitem[item.itemid] += item.productqnt;
        });

        invoiceitems.forEach((item) => {
            if (items[item.itemid]) {
                items = {
                    ...items,
                    [item.itemid]: {
                        ...item,
                        mergeqnt: qntbyitem[item.itemid] || 0,
                    },
                };
            }
        });
    }
    return items;
};

const AllItems = forwardRef((props, ref) => {
    const {
        itemList,
        groupList,
        itemgroupOriginal,
        selectedtags,
        searchitem,
        invoiceitems,
        options,
        search,
        refGroups,
    } = props;

    const params2 = useParams();

    device.tableid = params2?.tableid;
    device.locationid = params2?.locationid;
    device.groupid = params2?.groupid;

    getCompanyDetails();

    const [items, setItems] = useState();
    const [groups, setGroups] = useState();
    const [loader, setLoader] = useState(false);
    const [groupOrder, setGroupOrder] = useState([]);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const multioptions = Object.keys(options).length !== 1;
    const { tableorder, online } = device?.order || {};
    const hasAdd = (tableorder && params.table) || ((online || tableorder) && !params.table);

    // 1️⃣ Build hierarchical group order
    function buildGroupOrder(itemgroupOriginal) {
        const childrenMap = {};

        for (const [id, g] of Object.entries(itemgroupOriginal)) {
            const parentId = g.itemgroupmid || "0";
            if (!childrenMap[parentId]) childrenMap[parentId] = [];
            childrenMap[parentId].push(g);
        }

        for (const key in childrenMap) {
            childrenMap[key].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        }

        const result = [];
        const traverse = (parentId) => {
            const children = childrenMap[parentId] || [];
            for (const child of children) {
                result.push(child.itemgroupid);
                traverse(child.itemgroupid);
            }
        };
        traverse("0");
        return result;
    }

    // 2️⃣ Sort items based on group hierarchy
    function sortItemsByGroupHierarchy(items, itemgroupOriginal, groupOrder) {
        if (!items) return [];

        return Object.keys(items).sort((a, b) => {
            const itemA = items[a];
            const itemB = items[b];

            const groupA = itemA.itemgroupid;
            const groupB = itemB.itemgroupid;

            const indexA = groupOrder.indexOf(groupA);
            const indexB = groupOrder.indexOf(groupB);

            if (indexA !== -1 && indexB !== -1 && indexA !== indexB) {
                return indexA - indexB;
            }

            const orderA = Number(itemgroupOriginal[groupA]?.order) || 0;
            const orderB = Number(itemgroupOriginal[groupB]?.order) || 0;
            if (orderA !== orderB) return orderA - orderB;

            const nameA = itemA.name || itemA.itemname || "";
            const nameB = itemB.name || itemB.itemname || "";
            const nameComparison = nameA.localeCompare(nameB, undefined, {
                sensitivity: "base",
            });
            if (nameComparison !== 0) return nameComparison;

            return a.localeCompare(b);
        });
    }

    // 🔹 Expose loader state to parent
    useImperativeHandle(ref, () => ({ loader }));

    const scrollTo = () => {
        scroller.scrollTo("scroll-to-element", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
        });
    };

    useEffect(() => {
        Events.scrollEvent.register("begin", function () {});
        Events.scrollEvent.register("end", function () {});
    }, []);

    useEffect(() => {
        setLoader(false);
        getGroups().then(() => setLoader(true));
    }, [device.locationid]);

    // 🔹 Build groups, merge items, and build order hierarchy
    useEffect(() => {
        if (!itemList || !groupList) return;

        // 1️⃣ Build group map
        const newGroups = {};
        Object.values(groupList).forEach((item) => {
            newGroups[item.itemgroupid] = item;
        });
        setGroups(newGroups);

        // 2️⃣ Merge and group items
        const mergedItems = groupBy(toArray(mergeCart(itemList, invoiceitems), "id"), "itemgroupid");
        setItems(mergedItems);

        // 3️⃣ Build group order
        if (itemgroupOriginal && Object.keys(itemgroupOriginal).length > 0) {
            const order = buildGroupOrder(itemgroupOriginal);
            setGroupOrder(order);
        }
    }, [itemList, invoiceitems, groupList, itemgroupOriginal]);

    if (!loader) return <Loader3 />;

    if (isEmpty(itemList))
        return (
            <div className={"text-center bg-white rounded-4 text-muted p-5"}>
                No items found
            </div>
        );

    const tagoptions = selectedtags
        ?.filter((item) => item.selected)
        ?.map((item) => item.value);

    return (
        <BodyClassName className="groups">
            <section>
                <Theme />
                <div className="container p-0">
                    <CompanyDetail />
                    <div>
                        <CartHeader />
                        {items &&
                            Object.keys(items)
                                .filter((key) => {
                                    if (!groups[key] || groups[key].itemgroupstatus !== "1")
                                        return false;
                                    if (device.groupid) return device.groupid === key;
                                    return true;
                                })
                                .sort((a, b) => {
                                    const indexA = groupOrder.indexOf(a);
                                    const indexB = groupOrder.indexOf(b);

                                    if (indexA !== -1 && indexB !== -1 && indexA !== indexB) {
                                        return indexA - indexB;
                                    }

                                    const orderA =
                                        Number(itemgroupOriginal[a]?.order) || 0;
                                    const orderB =
                                        Number(itemgroupOriginal[b]?.order) || 0;
                                    if (orderA !== orderB) return orderA - orderB;

                                    const nameA =
                                        groups[a]?.itemgroupname || "";
                                    const nameB =
                                        groups[b]?.itemgroupname || "";
                                    return nameA.localeCompare(nameB, undefined, {
                                        sensitivity: "base",
                                    });
                                })
                                .map((key, index) => (
                                    <Card key={index} className="mb-3 border-0">
                                        <CardBody>
                                            <Element name={key}>
                                                <div id={`toggle${key}`}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h4 className="p-2 m-0">
                                                            {groups[key]?.itemgroupname}
                                                        </h4>
                                                        <div className="me-3">
                                                            <i className="fa fa-chevron-down"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Element>

                                            <UncontrolledCollapse
                                                toggler={`#toggle${key}`}
                                                defaultOpen
                                            >
                                                <div className="py-4">
                                                    <div className="row">
                                                        {items[key]
                                                            .filter((item) =>
                                                                !isEmpty(tagoptions)
                                                                    ? tagoptions.includes(
                                                                        item.veg
                                                                    )
                                                                    : true
                                                            )
                                                            .map((item, indd) => (
                                                                <ItemBox
                                                                    key={indd}
                                                                    item={{
                                                                        ...item,
                                                                        itemid: item.id,
                                                                        multioptions,
                                                                        addbutton: hasAdd,
                                                                    }}
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            </UncontrolledCollapse>
                                        </CardBody>
                                    </Card>
                                ))}
                        <CartTotal page={"detailview"} />
                    </div>
                </div>
            </section>
        </BodyClassName>
    );
});

const mapStateToProps = (state) => ({
    invoiceitems: state.cartData.invoiceitems,
    groupList: state.groupList,
    itemgroupOriginal: state.originalGroup,
    options: state.restaurantDetail?.settings?.options,
    itemList: state.itemList,
    ...state.selectedData,
});

export default connect(mapStateToProps)(AllItems);
