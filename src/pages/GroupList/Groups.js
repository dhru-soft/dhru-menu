import React from "react";
import {connect, useDispatch} from "react-redux";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";


const Index = (props) => {


    const dispatch = useDispatch()
    const {groupList} = props


    return (
        <>
            <div className="row">

                {
                    Object.values(groupList).filter((group) => {
                        return group?.itemgroupmid === '0'
                    }).map((item, index) => {
                        return <div key={index} className="text-center col-sm-4 col-lg-2 col-md-3 col-6 mb-3"
                                    onClick={() => {
                                        dispatch(setSelected({groupids: [item?.itemgroupid]}))
                                    }}>
                            <div className="__item __item--rounded text-center border  backgroundImage" style={{
                                borderRadius: 5,
                                backgroundImage: `url("https://b.zmtcdn.com/data/o2_assets/8dc39742916ddc369ebeb91928391b931632716660.png")`
                            }}>
                                <h5 className="__title text-center text-white  p-3">{item.itemgroupname} </h5>
                            </div>
                        </div>
                    })
                }

            </div>


        </>
    )

}

const mapStateToProps = (state) => {
    return {
        groupList: state.groupList
    }
}

export default connect(mapStateToProps)(Index);

