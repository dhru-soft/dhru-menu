import React from "react";
import applyTheme, {getCompanyDetails, setTheme} from "../../lib/functions";
import {device} from "../../lib/static";


const Index = (props: any) => {

    const themecolor = device?.order?.themecolor || '#000000'

    setTheme(themecolor)

    return (
        <>

        </>
    )
}


export default Index;
