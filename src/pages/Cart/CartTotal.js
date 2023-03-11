import React from "react";
import {connect} from "react-redux";
import {numberFormat} from "../../lib/functions";

const Index = (props) => {

    const {cartData:{vouchertotaldisplay,invoiceitems}} = props

    if(!Boolean(vouchertotaldisplay)){
        return <></>
    }

    return (
        <div>
            <div className={'d-flex justify-content-between align-items-center rounded-3 bg-white py-3 px-4 mt-3'}>
                <div>
                    <div><small className={'text-muted'}>Items : {invoiceitems?.length}</small></div>
                    <h4 className={'mb-0'}> {numberFormat(vouchertotaldisplay)}</h4>
                </div>
                <div>
                    <button className="w-100 custom-btn custom-btn--medium custom-btn--style-1" onClick={()=>{

                    }} type="button" role="button">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData,
    }
}

export default connect(mapStateToProps)(Index);

