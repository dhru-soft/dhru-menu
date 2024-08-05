import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import SearchBox from "../../components/SearchBox";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";
import {getCompanyDetails, isEmpty} from "../../lib/functions";
import {Button} from "reactstrap";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import ItemDetails from "./ItemDetails";
import AllItems from "../Items/AllItems";
import SearchItems from "../Items/SearchItems";
import GroupsbyLocation from "../Groups/GroupsbyLocation";


const Index = (props) => {

    const dispatch = useDispatch()

    const handleSearch = (value) => {
        dispatch(setSelected({searchitem: value}))
    }

    let {locationname} = getCompanyDetails();

    const handleSearchFocus = () => {
        store.dispatch(setModal({
            show: true,
            title: '',
            disableclose:true,
            backdrop:false,
            component: () => <><SearchItems   /></>
        }))
    }

    const handlemenuFocus = () => {
        store.dispatch(setModal({
            show: true,
            title: '',
            className:'menu',
            disableclose:true,

            component: () => <><GroupsbyLocation   /></>
        }))
    }

    return (
        <div className={'col-12'}>

            <div>
                <div className="p-3 bg-white" style={{boxShadow:'rgba(0, 0, 0, 0.15) 0px -2px 0.5rem'}}>
                    <div className={'form'}>
                        <div className="d-flex w-100">
                            <div className={'flex-grow-1'} onClick={handleSearchFocus}>
                                <SearchBox handleSearch={handleSearch} placeholder={`Search in ${locationname}`} />
                            </div>
                            <div className={'p-2'}></div>
                            <Button className={'btn border-0 px-4'} style={{background: 'black',borderRadius:12}} size={'small'}
                                    onClick={handlemenuFocus}> <i className="fa fa-utensils me-2"></i> Menu</Button>
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

