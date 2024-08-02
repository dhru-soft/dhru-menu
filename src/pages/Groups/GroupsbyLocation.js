import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {device} from "../../lib/static";
import {getGroups, isEmpty} from "../../lib/functions";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {useNavigate} from "react-router-dom";
import {Spinner} from "reactstrap";
import Search from "../Cart/Search";
import ItemsbyGroupList from "../Items/ItemsbyGroup";
import ItemsbyGroup from "../Items/ItemsbyGroup";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import {Element, Link} from "react-scroll";


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

                <h5 className={`__title text-center position-absolute ${withimage ? 'text-white' : ''} p-3`}  style={{top: 0}}>{item.itemgroupname} </h5>
            </div>
        </>
    )
}

const Index = forwardRef((props, ref) => {


    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)

    const {workspace, groupList} = props;

    useImperativeHandle(ref,()=>({setLoader}))

    useEffect(() => {
        setLoader(true)
        getGroups().then((flag)=>{
            setLoader(false)
        })

    }, [device.locationid])



    if (isEmpty(groupList) || loader) {
        return <>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'200px'}}><Spinner style={{width: '3rem', height: '3rem'}}/></div>
        </>
    }

    return (
        <section>
            <div className="row p-2">
            {
                    Object.values(groupList).filter((group) => {
                        return true
                        //return group?.itemgroupmid === '0'
                    }).map((item, index) => {



                        return  <Link activeClass="active" className="text-center col-sm-4 col-lg-2 col-md-3 col-6 mb-0 cursor-pointer p-1" to={item?.itemgroupid} spy={true} smooth={true} duration={500}>
                            <div key={index}

                                 onClick={() => {
                                     dispatch(setSelected({groupids: [item?.itemgroupid]}))

                                     navigate(`/l/${device.locationid}/t/${device.tableid}/g/${item?.itemgroupid}`)

                                     dispatch(setModal({show: false}))

                                 }}>
                                <GroupBox item={item}/>
                            </div>
                        </Link>
                    })
            }


            </div>


        </section>
    )

})

const mapStateToProps = (state) => {
    return {
        workspace: state.restaurantDetail.workspace,
        groupList: state.groupList,
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

