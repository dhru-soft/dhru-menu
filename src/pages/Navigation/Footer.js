import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {device} from "../../lib/static";

export class Footer extends Component {



    render() {

        return (
            <Fragment>
                 <section className="">
                    <footer className="footer footer--s3 footer--color-dark">
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
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Footer);
