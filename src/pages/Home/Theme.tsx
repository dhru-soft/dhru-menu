import React from "react";
import { useSelector } from "react-redux";
import { setTheme } from "../../lib/functions";
import { device } from "../../lib/static";

// Define interfaces for Redux state
interface LocationData {
    data: {
        themecolor: string;
    };
}

interface ReduxState {
    restaurantDetail: {
        location: Record<string, LocationData>;
    };
}

const Index: React.FC = () => {
    // Retrieve location data from Redux state
    const location = useSelector((state: ReduxState) => state.restaurantDetail.location);

    const themecolor = device?.order?.themecolor || '#000000';
    let themecolor2 = '';

    if (location && device?.locationid) {
        const locationData = location[device.locationid];
        themecolor2 = locationData?.data?.themecolor || '';
    }

    // Set the theme
    setTheme(themecolor2 || themecolor);

    return <></>;
};

export default Index;
