import React, {Component} from 'react';
import{Spinner} from "reactstrap";
import {connect} from "react-redux";


class Index extends Component {
    render() {
        const {show} =  this.props;
        return ( <div>
            { show &&  <div className={'loader2'}>    <Spinner style={{ width: '3rem', height: '3rem' }} /> </div> }
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
