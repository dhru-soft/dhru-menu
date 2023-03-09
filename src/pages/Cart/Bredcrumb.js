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

                    {Boolean(groupids) &&  <div className={'pt-3 pb-4'}>
                        <nav>
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item"><span onClick={()=>{
                                    dispatch(setSelected({groupids:''}))
                                }}><i className={'fa fa-chevron-left'}></i> Back </span></li>

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
                                }}  className="text-center col-sm-4 col-lg-2 col-md-3 col-6 mb-3">

                                    {Boolean(group.itemgroupimage) ? <div className="__item __item--rounded text-center border  backgroundImage" style={{
                                            borderRadius: 10,
                                            backgroundImage: `url("https://${group.itemgroupimage}")`
                                        }}>
                                            <h5 className="__title text-center text-white  p-3">{group.itemgroupname} </h5>
                                        </div>
                                        :
                                        <div className="__item __item--rounded text-center border  backgroundNoImage" style={{
                                            borderRadius: 10,
                                        }}>
                                            <h5 className="__title text-center  p-3">{group.itemgroupname} </h5>
                                        </div>}


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

