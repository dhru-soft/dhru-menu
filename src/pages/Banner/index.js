import React from "react";
import {getCompanyDetails} from "../../lib/functions";
import {connect} from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import {device} from "../../lib/static";

const Index = ({company}) => {


    let {
       location
    } = getCompanyDetails();


    if(!Boolean(device?.locationid)){
        return null
    }
    if(!Boolean(location[device?.locationid]?.data)){
        return null
    }

    const {banners} = location[device?.locationid]?.data

    if(!Boolean(banners)){
        return null
    }

    return (<div>

        <Carousel autoPlay={true} infiniteLoop={true}  showThumbs={false}>
            {
                banners.map((banner,index)=>{

                    return (
                        <div key={index}>
                            {Boolean(banner?.file) &&  <img src={`https://${banner?.file}`}/>}
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
