import React, {Fragment} from "react";
import {connect} from "react-redux";
import {device} from "../../lib/static";
import {getCompanyDetails, safeAtob} from "../../lib/functions";

const Index = () => {

    let {
        location
    } = getCompanyDetails();


    if(!Boolean(device?.locationid)){
        return null
    }
    if(!Boolean(location[device?.locationid]?.data)){
        return null
    }

    const {footercontent} = location[device?.locationid]?.data

        return (
            <Fragment>

                <section className="">
                    <div className="container">

                        <div className="row">
                            <div className="col-12 text-center">
                                <pre>
                                    {safeAtob(footercontent)}
                                </pre>
                            </div>
                        </div>

                    </div>
                </section>

                <section className="">
                    <footer className="footer footer--s3 footer--color-dark" style={{marginBottom: '150px'}}>
                        <div className="p-5">
                            <div className="container">

                                <div className="row">
                                    <div className="col-12 text-center">
                                    <div>
                                            <label className="power-by"><label onClick={() => {
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
