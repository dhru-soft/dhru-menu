import React from "react";
import {getCompanyDetails} from "../../lib/functions";
import {connect} from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import {device} from "../../lib/static";

const Index = ({company}) => {


    let {
        tablename, locationimage, locationname, location, address1, address2, download_url, industrytype
    } = getCompanyDetails();


    if(!Boolean(device?.locationid)){
        return null
    }
    if(!Boolean(location[device?.locationid]?.data)){
        return null
    }

    const {banners} = location[device?.locationid]?.data

    return (<div>


        <Carousel>
            {
                banners.map((banner)=>{
                    if(!Boolean(banner?.file)){
                        return
                    }
                    return (
                        <div>
                            <img src={`https://${banner?.file}`}/>
                        </div>
                    )
                })
            }

        </Carousel>

    </div>);

}


const mapStateToProps = (state) => {
    return {
        options: state.restaurantDetail?.settings?.options
    }
}

export default connect(mapStateToProps)(Index);
