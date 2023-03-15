import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import apiService from "../../lib/api-service";
import {ACTIONS, device, METHOD, STATUS, urls} from "../../lib/static";
import {setGroupList} from "../../lib/redux-store/reducer/group-list";
import {useNavigate, useParams} from "react-router-dom";


export const GroupBox = ({item}) => {
    const withimage = Boolean(item.itemgroupimage);
    return (
        <>
            <div className={`__item __item--rounded text-center border ${withimage?'backgroundImage':'backgroundNoImage'}`} style={{
                borderRadius: 10,
                backgroundImage: withimage ? `url("https://${item.itemgroupimage}")` :''
            }}>
                <h5 className={`__title text-center ${withimage?'text-white':''} p-3`}>{item.itemgroupname} </h5>
            </div>
        </>
    )
}

const Index = (props) => {

    const dispatch = useDispatch()

    const {workspace,groupList} = props;

    const getGroups = async () => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: {locationid: device.locationid},
            hideLoader:true,
            workspace: workspace,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                const {itemgroup} = result?.data;
                dispatch(setGroupList(itemgroup))
            }
        });
    }

    useEffect(() => {
        getGroups().then()
    }, [])




    return (
        <div>

            <div className="row">

                {
                    Object.values(groupList).filter((group) => {
                        return group?.itemgroupmid === '0'
                    }).map((item, index) => {

                        return <div key={index} className="text-center col-sm-4 col-lg-2 col-md-3 col-6 mb-3"
                                    onClick={() => {
                                        dispatch(setSelected({groupids: [item?.itemgroupid]}))
                                    }}>
                             <GroupBox item={item}/>
                        </div>
                    })
                }

            </div>


        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        workspace: state.restaurantDetail.workspace,
        groupList: state.groupList,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

