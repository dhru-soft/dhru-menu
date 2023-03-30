import {getWorkspaceName, wait} from "../functions";
import {ACTIONS, device, METHOD, STATUS} from "../static";
import store from "../redux-store/store";
import {hideLoader, setAlert, showLoader} from "../redux-store/reducer/component";
import {toast} from "react-toastify";


interface configData {
    method: METHOD,
    action?: ACTIONS | string,
    queryString?: object,
    body?: object,
    hideLoader?: boolean,
    showalert?: boolean,
    token?: string,
    workspace?: string,
    other?: any
}

let controller: any = undefined;

const apiService = async (config: configData) => {

    controller = new AbortController();
    const signal = controller.signal;
    let apiresponse:any = false;

    let headers: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };


    if (Boolean(config.workspace)) {
        // headers["x-workspace"] = config.workspace;
    }

    if (Boolean(config.token || device.token)) {
        headers["Authorization"] = 'Bearer ' + (config.token || device.token);
    }

    const requestOptions: any = {
        method: config.method,
        redirect: 'follow',
        headers: new Headers(headers),
        timeout: 10000,
        signal
    };



    let apiPath: any = "http://localhost:8081/";


    if (config.other) {
        if (Boolean(config.workspace) || getWorkspaceName()) {
            apiPath = `https://${config.workspace || getWorkspaceName()}${config.other.url}`;
        } else {
            apiPath = `${config.other.url}`;
        }

    }

    if (config.action) {
        apiPath += config.action;
    }
    if (config.queryString) {
        apiPath += jsonToQueryString(config.queryString);
    }

    if (config?.body) {
        requestOptions.body = JSON.stringify(config.body);
    }

    if (!config.hideLoader) {
        store.dispatch(showLoader())
    }

    console.log('apiPath', apiPath)





    wait(requestOptions.timeout, signal)
        .then(() => {
            if(!apiresponse){
                controller.abort();
            }
        })
        .catch(() => {
            console.log('Waiting was interrupted');
        });

    return await fetch(apiPath, requestOptions)
        .then(response => response.json())
        .then((response: any) => {

            apiresponse = true
            store.dispatch(hideLoader());



            if (response?.message && (response?.status === STATUS.ERROR)) {
                /*if ((config?.action?.includes('server/')) && (response?.message?.includes('ENOTFOUND'))) {
                    store.dispatch(setAlert({visible: true, message: 'Internet connection not available'}))
                } else {
                    store.dispatch(setAlert({visible: true, message: response?.message}))
                }*/
                toast.error(response.message)
            }
            else if (response?.code === 401) {
                toast.error(response.message)
                //store.dispatch(setAlert({visible: true, message: 'Something went wrong, Please try again!'}))
            }
            else if ((response?.status === STATUS.SUCCESS) && config?.showalert) {
                //store.dispatch(setAlert({visible: true, message: response.message}))
                toast.success(response.message)
            }



            return response;

        })
        .catch(error => {

            store.dispatch(hideLoader());
            toast.error('Something went wrong')
           // store.dispatch(setAlert({visible: true, message: 'Something went wrong'}))
            //appLog("API_CATCH_ERROR", error,navigator.onLine);

            /*if(!navigator.onLine){
              AppToaster({message: 'Internet connection not available', intent: "danger"});
            }*/

            return {
                status: STATUS.ERROR,
                message: error.message
            }
        });


}

export default apiService;

export const jsonToQueryString = (json: any) => {
    if (!json) {
        return undefined;
    }
    return '?' + Object.keys(json).map((key) => {
        return `${key}=${json[key]}`
    }).join('&');
};

export const abortFetching = () => {
    console.log("CALL", "abort");
    if (controller) {
        controller.abort();
    }
}
