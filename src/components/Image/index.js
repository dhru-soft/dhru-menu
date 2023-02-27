import React, {Component} from "react";

export class Image extends Component {

    render() {
        const {name,width,height,class:classes} = this.props;
        const image = require(`../../assets/images/${name}`);
        return <img
            className={classes}
            src={image.default}
            width={width}
            height={height}
            alt={"ds"}
        />
    }
}



export default Image;

