import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";
import apiService from "../../lib/api-service";
import store from "../../lib/redux-store/store";
import GroupList from "../GroupList";
import {setGroupList} from "../../lib/redux-store/reducer/group-list";
import {setItemList} from "../../lib/redux-store/reducer/item-list";


const Index = (props) => {

    const dispatch = useDispatch()


    const getItems = async (locationid) => {

        const workspace = store.getState().restaurantDetail?.workspace

        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: {locationid: locationid},
            workspace: workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                const {items, itemgroup} = result?.data;
                dispatch(setGroupList(itemgroup))
                dispatch(setItemList(items));
            }
        });
    }

    useEffect(() => {

        const {locationid} = props.match?.params || {}
        getItems(locationid).then()

    }, [])


    const {itemList} = props;

    return (
        <>
            <section>

                <div>

                    <div className="container">

                        <div className="col-12  pt-5">

                            {
                                Object.values(itemList).map((item, index) => {
                                    return <div key={index}>{item.itemname}</div>
                                })
                            }

                        </div>



                        <div className={'col-12 col-lg-4  col-md-4'}>
                            <GroupList/>
                        </div>

                    </div>


                </div>


            </section>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        itemList: state.itemList
    }
}

export default connect(mapStateToProps)(Index);
