import React, {Component, useState} from "react";

import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {setModal} from "../../lib/redux-store/reducer/component";
import {connect} from "react-redux";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import Sheet from 'react-modal-sheet';
import Login from "../../pages/Login";

const Index = (props: any) => {
    const {component: Component, title, show, maxWidth, className, backdrop, keyboard} = props.modal;

    const [isOpen, setOpen] = useState(false);

    const handleClose = () => {
        const {setModal} = props;
        setOpen(false)
        setModal({
            show: false,
        });
    }


        return (
            <Modal isOpen={show}  toggle={handleClose} size={maxWidth ? maxWidth : 'xs'} className={`${isMobile?'mobile':'desktop'}`}
                   backdrop={backdrop ? backdrop : true} keyboard={keyboard ? keyboard : true}>
                <ModalHeader toggle={handleClose}>{title ? title : ''}</ModalHeader>
                <ModalBody>
                    {show && <Component/>}
                </ModalBody>
            </Modal>
        )


    return (
        <Sheet isOpen={show} onClose={() => handleClose()} snapPoints={[800, 400, 100, 0]} initialSnap={0} detent="content-height" >
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <div className={'container p-4'} style={{maxWidth:500,marginBottom:100}}>
                        {show && <>
                            <h4 style={{marginLeft:10}}> {title}</h4>
                            <Component/>
                        </>}
                    </div>
                </Sheet.Content>
            </Sheet.Container>

            <Sheet.Backdrop />
        </Sheet>
    )



}


const mapStateToProps = (state: any) => ({
    modal: state.component.modal
});
const mapDispatchToProps = (dispatch: any) => ({
    setModal: (modal: any) => dispatch(setModal(modal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);


