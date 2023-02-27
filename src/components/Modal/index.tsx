import React, {Component} from "react";

import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {setModal} from "../../lib/redux-store/reducer/component";
import {connect} from "react-redux";

const Index = (props: any) => {
    const {component: Component, title, show, maxWidth, className, backdrop, keyboard} = props.modal;

    const handleClose = () => {
        const {setModal} = props;
        setModal({
            show: false,
        });
    }

    if(!show) {
        return <></>
    }

    return (
        <Modal isOpen={show} toggle={handleClose} size={maxWidth ? maxWidth : 'xs'} className={className}
               backdrop={backdrop ? backdrop : true} keyboard={keyboard ? keyboard : true}>
            <ModalHeader toggle={handleClose}>{title ? title : ''}</ModalHeader>
            <ModalBody>
                <Component/>
            </ModalBody>
        </Modal>
    )

}


const mapStateToProps = (state: any) => ({
    modal: state.component.modal
});
const mapDispatchToProps = (dispatch: any) => ({
    setModal: (modal: any) => dispatch(setModal(modal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);


