import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import SearchBox from "../../components/SearchBox";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {isEmpty} from "../../lib/functions";


const Index = (props) => {

    const dispatch = useDispatch()

    const handleSearch = (value) => {
        dispatch(setSelected({searchitem: value}))
    }


    return (
        <div className={'col-3'}>

            <div>
                <div className="">
                    <div className={'form'}>
                        <div className="my-3">
                            <SearchBox handleSearch={handleSearch}/>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

