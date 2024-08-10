import {useSelector} from "react-redux";


export const useRedux = () => {
    const state = useSelector((state)=> state)

    return {
        state
    }
};

