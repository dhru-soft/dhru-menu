import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getGroups} from "../../lib/functions";
import {device} from "../../lib/static";
import {GroupBox} from "../Groups/Groups";

const SubGroups = () => {

    const navigate = useNavigate()

    const [subgroup, setSubGroup] = useState<any>([]);

    const itemLoading = useSelector((state: any) => state?.component?.itemLoading)

    const groupids = useSelector((state: any) => state?.selectedData?.groupids)
    const groupList = useSelector((state: any) => state.groupList)

    const setGroups = async () => {
        if (groupids?.length > 0) {
            const lastgroup = groupids[groupids.length - 1];
            let groups = Object.values(groupList).filter((group: any) => {
                return group?.itemgroupmid === lastgroup
            })
            setSubGroup(groups)
        } else {
            await getGroups().then()
            setSubGroup([])
        }
    }

    useEffect(() => {
        setGroups().then()
    }, [groupids])

    return <div className="row">
        {(itemLoading && device.groupid) && subgroup?.map((group: any, index: any) => {
            return (<div
                key={index}
                onClick={() => navigate(`/l/${device.locationid}/t/${device.tableid}/g/${group?.itemgroupid}`)}
                className="text-center col-sm-4 col-lg-2 col-md-3 col-6 mb-3 cursor-pointer">
                <GroupBox item={group}/>
            </div>)
        })}
    </div>
}

export default SubGroups;
