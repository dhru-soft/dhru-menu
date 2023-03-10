import React, {Component} from 'react';
import {connect} from "react-redux";

const Index = (props) => {

    const {loader} = props;


    if(!loader) {
        return <></>
    }

    return ( <div>
        {<div className="h-100 d-flex justify-content-center align-items-center  w-100 bg-transparent position-fixed fixed-top"  style={{zIndex:'9999'}}>
            <div className={'text-center d-flex justify-content-center align-items-center h-100'}>
                <div className={'bg-white  p-5'} style={{
                    opacity: 1,
                    borderRadius: 100,
                }}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                </div>
            </div>
        </div> }
    </div>)

}


const mapStateToProps = (state) => ({
    loader: state.component.loader
});


export default connect(mapStateToProps)(Index);
