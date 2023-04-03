import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {device} from "../../lib/static";
import {getGroups, isEmpty} from "../../lib/functions";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {useNavigate} from "react-router-dom";


export const GroupBox = ({item}) => {
    const withimage = Boolean(item.itemgroupimage);
    return (
        <>
            <div className={`__item __item--rounded bg-white text-center border position-relative group-box`} style={{
                borderRadius: 10,
                minHeight: 80,
                height: '100%'
            }}>

                {Boolean(item?.itemgroupimage) ? <LazyLoadImage
                    alt={'helo'}
                    src={`https://${item?.itemgroupimage}`}

                    style={{maxWidth: '100%', borderRadius: 10}}/> : <div></div>}

                <h5 className={`__title text-center position-absolute ${withimage ? 'text-white' : ''} p-3`}
                    style={{top: 0}}>{item.itemgroupname} </h5>
            </div>
        </>
    )
}

const Index = (props) => {


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {workspace, groupList} = props;


    useEffect(() => {
        getGroups(groupList).then()
    }, [])

    if (isEmpty(groupList)) {
        return <></>
    }

    return (
        <section>

            <div className="row">

                {
                    Object.values(groupList).filter((group) => {
                        return group?.itemgroupmid === '0'
                    }).map((item, index) => {

                        return <div key={index}
                                    className="text-center col-sm-4 col-lg-2 col-md-3 col-6 mb-3 cursor-pointer"
                                    onClick={() => {
                                        dispatch(setSelected({groupids: [item?.itemgroupid]}))
                                        navigate(`/l/${device.locationid}/t/${device.tableid}/g/${item?.itemgroupid}`)
                                    }}>
                            <GroupBox item={item}/>
                        </div>
                    })
                }

            </div>


        </section>
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

