import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import apiService from "../../lib/api-service";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";
import {setGroupList} from "../../lib/redux-store/reducer/group-list";
import {checkLocation} from "../../lib/functions";
import {useNavigate} from "react-router-dom";


const Index = (props) => {



    const dispatch = useDispatch()
    const navigate = useNavigate()



    const {workspace,groupList,locationid} = props;


    const getGroups = async () => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.ITEMS,
            queryString: {locationid: locationid},
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
        if(checkLocation()) {
            getGroups().then()
        }
        else{
            navigate('/')
        }
    }, [])




    return (
        <div>

            <div className="row">

                {
                    Object.values(groupList).filter((group) => {
                        return group?.itemgroupmid === '0'
                    }).map((item, index) => {

                        console.log('item',item)

                        return <div key={index} className="text-center col-sm-4 col-lg-2 col-md-3 col-6 mb-3"
                                    onClick={() => {
                                        dispatch(setSelected({groupids: [item?.itemgroupid]}))
                                    }}>
                            {Boolean(item.itemgroupimage) ? <div className="__item __item--rounded text-center border  backgroundImage" style={{
                                borderRadius: 10,
                                backgroundImage: `url("https://${item.itemgroupimage}")`
                            }}>
                                <h5 className="__title text-center text-white  p-3">{item.itemgroupname} </h5>
                            </div>
:
                            <div className="__item __item--rounded text-center border  backgroundNoImage" style={{
                                borderRadius: 10,
                            }}>
                                <h5 className="__title text-center  p-3">{item.itemgroupname} </h5>
                            </div>}

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

