import React, {Component, useState} from "react";

import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {isMobile} from 'react-device-detect';

import {Sheet} from 'react-modal-sheet';

import {useModal} from "../../use/useModal";

const Index = (props: any) => {

    const {closeModal, modal} = useModal()

    const handleClose = () => {
        closeModal()
    }



    return (
        <div>
            {
                modal.map((value:any)=> {
                    const {show,visible,disableclose,backdrop, title,maxWidth,className,keyboard, action,   width, modalkey} = value;

                    const Component = value?.component

                    return (<Modal key={modalkey} isOpen={show} autoFocus={true} toggle={handleClose} size={maxWidth ? maxWidth : 'xs'}
                                   className={`${isMobile ? 'mobile' : 'desktop'} ${className}`}
                                   backdrop={Boolean(backdrop)} keyboard={keyboard ? keyboard : true}>
                        {!disableclose && <ModalHeader toggle={handleClose}>{title ? title : ''}</ModalHeader>}
                        {(disableclose && title) && <ModalHeader>{title ? title : ''}</ModalHeader>}
                        <ModalBody>
                            {show && <Component/>}
                        </ModalBody>
                    </Modal>)
                })
            }
        </div>)





}




export default  (Index);





