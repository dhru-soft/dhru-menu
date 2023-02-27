import React, {Component} from 'react';
import {connect} from "react-redux";

class Index extends Component {
    render() {
        const {show} =  this.props;
        return ( <div>
            { show &&  <div className="h-100 w-100 bg-transparent position-fixed fixed-top"  style={{zIndex:'9999'}}>
                <div className="loader"></div>
            </div> }
        </div>)
    }
}

Index.defaultProps = {
    show:false,
};

const mapStateToProps = (state) => {
    return{
        ...state.component.loader
    }
};

export default connect(mapStateToProps)(Index);
