import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {clone} from "../../lib/functions";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import SearchBox from "../../components/SearchBox";


const Index = (props) => {

    const {groupList,groupids,hidetag} = props;
    const [subgroup, setSubGroup] = useState([]);


    const navigate = useNavigate()
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



    const handleSearch = (value) => {
        console.log('value',value)
    }




    const  setCurrentGroup = (groupid) => {
        const index = groupids.findIndex(function(key) {
            return key == groupid
        });
        dispatch(setSelected({groupids: groupids.slice(0, index + 1)}))
    }

    /*if(!Boolean(subgroups)){
        return <></>
    }*/


    return (
        <div className={'col-12'}>

            <div>
                <div className="container">
                    <div className={'form'}>
                        <div className="my-3">
                            <SearchBox handleSearch={handleSearch}/>
                        </div>
                    </div>


                    {!hidetag &&  <div>
                        <div className={'overflow-auto d-flex tags   pb-4'}>
                            <button type="button" className="btn btn-success">Veg</button>
                            <button type="button" className="btn btn-danger">Non Veg</button>
                            <button type="button" className="btn btn-danger">Egg</button>
                            <button type="button" className="btn btn-warning">Jain</button>
                            <button type="button" className="btn btn-warning">Swaminarayan</button>
                            <button type="button" className="btn btn-info">Gluten Free</button>
                            <button type="button" className="btn btn-info">Lactose Free</button>
                        </div>
                    </div>}



                    {Boolean(groupids) &&  <div className={'p-2'}>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><span onClick={()=>{
                                    dispatch(setSelected({groupids:''}))
                                }}><i className={'fa fa-home'}></i></span></li>

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
                                                    height:50,
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

