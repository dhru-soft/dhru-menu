import React, {Component, Fragment} from "react";
import {connect} from "react-redux";

export class Footer extends Component {
    render() {


        return (
            <Fragment>
                 <section className="section--no-pt section--no-pb">
                    <footer className="footer footer--s3 footer--color-dark">
                        <div className="footer__line footer__line--first">
                            <div className="container">

                                <div className="row">
                                    <div className="col-12 text-center">
                                        <div>
                                            <span className="__bullet">&copy; Dhru Cloud Pvt Ltd 2023</span>
                                            <span className="__bullet">Dhru™ </span>
                                            <span className="__bullet">Smart Lifestyle™ </span>
                                            <span className="__bullet">Dhru Cloud™ </span>
                                            <span className="__bullet">POS.WORK™</span>

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
