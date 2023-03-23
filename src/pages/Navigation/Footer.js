import React, {Component, Fragment} from "react";
import {connect} from "react-redux";

export class Footer extends Component {
    render() {


        return (
            <Fragment>
                 <section className="section--no-pt section--no-pb" style={{marginBottom:100}}>
                    <footer className="footer footer--s3 footer--color-dark">
                        <div className="p-5">
                            <div className="container">

                                <div className="row">
                                    <div className="col-12 text-center">
                                        <div>
                                            <small className="text-muted">Powered by Dhru ERP</small>

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
