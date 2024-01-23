import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {clone, getGroups} from "../../lib/functions";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {GroupBox} from "../Groups/Groups";

import {device} from "../../lib/static";
import {useNavigate} from "react-router-dom";


const Index = (props) => {

    const navigate = useNavigate()

    const {groupList,groupids,searchitem} = props;

    const dispatch = useDispatch()






    const  setCurrentGroup = (groupid) => {
        const index = groupids.findIndex(function(key) {
            return key == groupid
        });
        const newgroupids = groupids.slice(0, index + 1);
        navigate(+`${newgroupids.length -  groupids.length}`)
        dispatch(setSelected({groupids: newgroupids}))
    }

    if(Boolean(searchitem)){

        return (
            <div className={'pt-3 pb-3 mt-3  bread-section'}>
                <nav>
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item ps-2"><span> Search Result '{searchitem}'</span></li>
                    </ol>
                </nav>
            </div>
        )
    }

    return (
        <div className={'col-12 bread-section'}>

            <div>
                <div className="">

                    {<div className={'mt-3'}>
                        <nav>
                            <ol className="breadcrumb mb-0 ps-3">
                                {Boolean(device?.groupid) && Boolean(groupids?.length)  ?  <>
                                    <li className="breadcrumb-item   pt-4 pb-2"><span onClick={()=>{
                                        setCurrentGroup('')
                                    }}><i className={'fa fa-chevron-left'}></i> Back </span></li>

                                    {
                                         groupids?.map((gid,index)=>{
                                             const foundGroup = Object.values(groupList).find((groupitem)=> Boolean(groupitem?.itemgroupid === gid))
                                            return (
                                                <li key={index} className="breadcrumb-item py-4" onClick={()=>{
                                                    (groupids?.length - 1 !== index) && setCurrentGroup(gid)
                                                }}><span>{foundGroup?.itemgroupname} </span></li>
                                            )
                                        })
                                    }
                                </> : <>
                                    <li className="breadcrumb-item py-4"><span> Menu </span></li>
                                </> }
                            </ol>
                        </nav>
                    </div> }



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

