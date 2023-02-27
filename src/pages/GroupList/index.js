import React, {Component} from "react";
import {connect, useDispatch} from "react-redux";
import store from "../../lib/redux-store/store";
import {setModal} from "../../lib/redux-store/reducer/component";
import {Modal, ModalBody, ModalHeader} from "reactstrap";


const Index = (props) => {

        const {groupList} = props;
        const dispatch = useDispatch()

        const Groups = () => {
            return (
                <>
                    {
                        Object.values(groupList).map((item,index)=>{
                            return <div key={index}>{item.itemgroupname}</div>
                        })
                    }
                </>
            )
        }



        return(
            <div>


                <div id="team" className="nt-section section">
                    <div className="container">
                        <div className="row ">
                            <div className="nt-column col-sm-12 text-xs-center">
                                <div className="section-heading  section-heading--center section-heading--dark "><h6
                                    className="__subtitle">Meet the team</h6><h2 className="__title">Awesome<span> TechLand Team</span>
                                </h2></div>
                                <div className="spacer py-6"></div>
                                <div className="row vc_custom_1558059177708">

                                    <div className="nt-column col-sm-4 col-lg-2 col-md-3 col-6">

                                        <div className="team team--s3">
                                            <div className="__item">
                                                <figure className="__image">

                                                    <div className="__soc-btns"><a className="circled fontello-linkedin"
                                                                                   href="#"></a></div>
                                                </figure>
                                                <div className="__content"><h4 className="__name">Maria Smith</h4>
                                                    <div className="__position">Designer</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <section className="section">
                    <div className="p-3 text-center mt-5">
                        <a onClick={()=>{

                            store.dispatch(setModal({
                                show: true,
                                title:'group List',
                                component:  Groups
                            }));
                        }} className="custom-btn   custom-btn--big custom-btn--style-4 mb-3 nav-link"   >
                            Category
                        </a>
                    </div>
                </section>




            </div>
        );

}

const mapStateToProps = (state) => {
    return {
        groupList: state.groupList
    }
}

export default connect(mapStateToProps)(Index);

