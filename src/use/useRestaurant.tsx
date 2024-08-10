import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {isEmpty} from "../lib/functions";
import {useParams} from "react-router-dom";
import moment from "moment";


export const useRestaurant = (location?: any) => {


    const params: any = useParams()

    location = useSelector((state: any) => state?.restaurantDetail?.location[params?.locationid])

    useEffect(() => {
        const interval = setInterval(() => setOpen(isStoreOpen), 10000);
        return () => clearInterval(interval);
    }, [location]);

    const isStoreOpen = () => {

        let dateTimeFormat = 'DD/MM/YYYY hh:mm A'
        let dateFormat = 'DD/MM/YYYY'

        let isOpen = false

        const currentStartDate = moment().format(dateFormat),
            currentEndDate = moment().format(dateFormat);

        let stringAssignedStartTime = location?.order?.starttime,
            stringAssignedEndTime = location?.order?.endtime;

        let stringStartDateTime = `${currentStartDate} ${stringAssignedStartTime}`,
            stringEndDateTime = `${currentEndDate} ${stringAssignedEndTime}`;

        let startTime = moment(stringStartDateTime, dateTimeFormat),
            endTime = moment(stringEndDateTime, dateTimeFormat),
            currentTime = moment(moment().format(dateTimeFormat), dateTimeFormat);

        let startToEndDuration = moment.duration(endTime.diff(startTime)).asSeconds();
        let startToCurrentDuration = moment.duration(currentTime.diff(startTime)).asSeconds();

        if (startToEndDuration <= 0) {
            if (startToEndDuration === 0 ? startToCurrentDuration < 0 : startToCurrentDuration <= startToEndDuration) {
                startTime = moment(stringStartDateTime, dateTimeFormat).subtract(1, 'day')
            } else {
                endTime = moment(stringEndDateTime, dateTimeFormat).add(1, 'day')
            }
        }
        let durationStartTime = moment.duration(currentTime.diff(startTime)).asSeconds(),
            durationEndTime = moment.duration(endTime.diff(currentTime)).asSeconds();

        if (durationStartTime >= 0 && durationEndTime > 0) {
            isOpen = true;
        }

        return isOpen;
    }

    const [isOpen, setOpen] = useState(isStoreOpen);

    return {
        isOpen,
        message: "we're closed", ...location
    }
}
