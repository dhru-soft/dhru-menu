import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import SearchBox from "../../components/SearchBox";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {isEmpty} from "../../lib/functions";
import {Button} from "reactstrap";


const Index = (props) => {

    const dispatch = useDispatch()

    const handleSearch = (value) => {
        dispatch(setSelected({searchitem: value}))
    }


    return (
        <div className={'col-12'}>

            <div>
                <div className="">
                    <div className={'form'}>
                        <div className="mb-3 d-flex w-100">
                            <div className={'flex-grow-1'}>
                                <SearchBox handleSearch={handleSearch}/>
                            </div>
                            <div className={'p-2'}></div>
                            <Button className={'border-0 px-3 '} size={'small'}> <i className={'fa fa-bars'}></i> Menu</Button>
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

