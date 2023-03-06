import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {clone, isEmpty} from "../../lib/functions";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";


const Index = ({item}) => {

    const {itemimage,price,itemname} = item;


    return (
        <div className={'col-12'}>

            <div>
                <div className="container">

                    <img src={`https://${itemimage}`} className={'w-100'} style={{borderRadius:5}} />

                    <h4 className={'text-bold'}>{price}</h4>


                    <div>
                        Item Addons
                    </div>

                    <div>
                        Item Tags
                    </div>

                    <div className={'d-flex justify-content-between'}>
                        <div>
                            Item Qnt
                        </div>

                        <div>
                            <button className="custom-btn custom-btn--medium custom-btn--style-4" onClick={() => {

                            }} type="button" role="button">
                                Add
                            </button>
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

