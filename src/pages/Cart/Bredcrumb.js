import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {clone} from "../../lib/functions";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";


const Index = (props) => {

    const {groupList,groupids} = props;
    const [subgroup, setSubGroup] = useState([]);


    const dispatch = useDispatch()

    useEffect(() => {

        if(groupids?.length > 0) {
            const lastgroup = groupids[groupids.length - 1];
            let groups = Object.values(groupList).filter((group) => {
                return group?.itemgroupmid === lastgroup
            })
            setSubGroup(groups)
        }
        else{
            setSubGroup([])
        }
    }, [groupids])




    const  setCurrentGroup = (groupid) => {
        const index = groupids.findIndex(function(key) {
            return key == groupid
        });
        dispatch(setSelected({groupids: groupids.slice(0, index + 1)}))
    }


    return (
        <div className={'col-12'}>

            <div>
                <div className="">

                    {Boolean(groupids) &&  <div className={'py-4'}>
                        <nav>
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item"><span onClick={()=>{
                                    dispatch(setSelected({groupids:''}))
                                }}><i className={'fa fa-home'}></i> Category </span></li>

                                {
                                     groupids?.map((gid,index)=>{
                                        return (
                                            <li key={index} className="breadcrumb-item" onClick={()=>{
                                                setCurrentGroup(gid)
                                            }}><span>{groupList[gid]?.itemgroupname}</span></li>
                                        )
                                    })
                                }

                            </ol>
                        </nav>
                    </div> }


                    <div className="row">
                    {
                        subgroup?.map((group,index)=>{
                            return (
                                <div  key={index}  onClick={()=>{
                                    let groups = clone(groupids)
                                    const find = groups.filter((key)=>{
                                        return key === group?.itemgroupid
                                    });
                                    if(!Boolean(find.length)){
                                        groups.push(group.itemgroupid)
                                    }
                                    dispatch(setSelected({groupids: groups}))
                                }}  className="text-center col-sm-4 col-lg-2 col-md-3 col-4 mb-3">

                                        <div>
                                            <div className="__item __item--rounded text-center border  backgroundImage" style={{
                                                borderRadius: 5,
                                                height:120,
                                                backgroundImage: `url("https://b.zmtcdn.com/data/o2_assets/8dc39742916ddc369ebeb91928391b931632716660.png")`
                                            }}>
                                                <h5 className="__title text-center text-white  p-3">{group.itemgroupname} </h5>
                                            </div>
                                        </div>
                                </div>
                            )
                        })
                    }

                    </div>

                </div>
            </div>

        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        groupList: state.groupList,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

