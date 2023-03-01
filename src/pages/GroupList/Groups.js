import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import Avatar from "../../components/Avatar"
import {useNavigate, useParams} from "react-router-dom";
import apiService from "../../lib/api-service";
import {ACTIONS, METHOD, STATUS, urls} from "../../lib/static";

import {isEmpty} from "../../lib/functions";


const Index = (props) => {

    const params = useParams();
    const navigate = useNavigate();
    const {locationid} = params || {}
    const {groupList} = props

    console.log('groupList',groupList)


        return (

                    <div className="row">

                        {
                            Object.values(groupList).map((item,index)=>{
                                return   <div key={index} className="text-center col-sm-4 col-lg-2 col-md-3 col-4 mb-3" onClick={() => {
                                    navigate(`/items/${locationid}/${item.itemgroupid}`)
                                }}>
                                    <div className={'border m-auto'} style={{width:60,borderRadius:50}}>
                                        <Avatar   src={'b.zmtcdn.com/data/o2_assets/52eb9796bb9bcf0eba64c643349e97211634401116.png?fit=around|120:120&crop=120:120;*,*'}/>
                                    </div>
                                    <div className={''}>{item.itemgroupname}</div>
                                </div>
                            })
                        }

                    </div>

        )

}

const mapStateToProps = (state) => {
    return {
        groupList: state.groupList
    }
}

export default connect(mapStateToProps)(Index);

