import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {device} from "../../lib/static";

const Index = ({vouchertotaldisplay}) => {


        return (
            <Fragment>
                 <section className="">
                    <footer className="footer footer--s3 footer--color-dark" style={{marginBottom:vouchertotaldisplay ?150:0}}>
                        <div className="p-5">
                            <div className="container">

                                <div className="row">
                                    <div className="col-12 text-center">
                                        <div>
                                            <label className="power-by" ><label onClick={()=>{
                                                window.open(`https://www.dhru.com/?fromid=${device.workspace}`, '_blank');
                                            }}>Powered by Dhru ERP </label></label>
                                        </div>

                                      </div>
                                </div>

                            </div>
                        </div>
                    </footer>
                </section>
            </Fragment>
        );

}

const mapStateToProps = (state) => {
    return {
        vouchertotaldisplay: state.cartData?.vouchertotaldisplay,
    }
};

const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);
