
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import {removeModal, setModal} from "../lib/redux-store/reducer/component";

export const useModal = () => {

    const blankLayout = () => <div></div>

    const dispatch = useDispatch();

    const modal = useSelector((state:any) => state.component.modal);

    const lastmodal = modal[modal?.length - 1];

    const openModal = (params:any) => {
        dispatch(setModal([...modal,{visible:true,modalkey:moment().unix(),...params}]));
    };
    const closeModal = () => {
        const lastmodal = modal[modal?.length - 1];

        dispatch(removeModal(lastmodal?.modalkey));

    };

    return { openModal,closeModal,modal,lastmodal };
};
