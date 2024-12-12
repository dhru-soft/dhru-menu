import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {device} from "../../lib/static";
import {getGroups, isEmpty} from "../../lib/functions";
import {useNavigate} from "react-router-dom";
import {Spinner} from "reactstrap";
import {Link} from "react-scroll";
import {useModal} from "../../use/useModal";


export const GroupBox = ({item}) => {

    const withimage = Boolean(item.itemgroupimage);
    return (<>
            {/*{Boolean(item?.itemgroupimage) ? <LazyLoadImage
                    alt={'helo'}
                    src={`https://${item?.itemgroupimage}`} /> : <div></div>}*/}

            <div className={'p-3 d-flex justify-content-between align-items-center'}>
                <span>{item.itemgroupname}</span>
                <span>{item.total}</span>
            </div>
        </>)
}

const Index = forwardRef((props, ref) => {


    const dispatch = useDispatch()
    const {closeModal} = useModal()
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)

    const {workspace, groupList, itemList} = props;

    useImperativeHandle(ref, () => ({setLoader}))

    useEffect(() => {
        setLoader(true)
        getGroups().then((flag) => {
            setLoader(false)
        })

    }, [device.locationid])


    if (isEmpty(groupList) || loader) {
        return <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}><Spinner
                style={{width: '3rem', height: '3rem'}}/></div>
        </>
    }

    return (<section>
            <div>
                {Object.values(groupList).filter((group) => {
                    return true
                    //return group?.itemgroupmid === '0'
                }).map((item, index) => {


                    return <Link activeClass="active" className=" cursor-pointer" to={item?.itemgroupid} spy={true}
                                 smooth={true} duration={300} key={index}>
                        <div

                            onClick={() => {
                                dispatch(setSelected({groupids: [item?.itemgroupid]}))

                                //navigate(`/l/${device.locationid}/t/${device.tableid}/g/${item?.itemgroupid}`)
                                closeModal()

                            }}>
                            <GroupBox item={{...item, total: itemList[item.itemgroupid]?.length}}/>
                        </div>
                    </Link>
                })}


            </div>


        </section>)

})

const mapStateToProps = (state) => {
    return {
        workspace: state.restaurantDetail.workspace,
        groupList: state.groupList,
        itemList: state.itemList, ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

