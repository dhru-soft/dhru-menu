import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import store from "./lib/redux-store/store";
import Loader from "./components/Loader/loader"
import RoutingComponent from "./lib/RoutingComponent";
import Dialog from "./components/Modal";
import {createBrowserHistory} from "history";
import Header from "./pages/Navigation/Header";
import Footer from "./pages/Navigation/Footer";
import './scss/index.scss';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {InitConsumer, InitProvider} from "./context/InitContext";

export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});


const JSX = () => {


    return (
        <Provider store={store}>
            <BrowserRouter history={history}>

                <InitProvider>
                    <>
                        <div className={'min-height'}>
                            <Header location={history.location} />
                            <RoutingComponent />
                        </div>
                        <Footer/>
                    </>
                    <Dialog/>
                    <Loader/>
                    <ToastContainer  position="top-center"
                                     autoClose={2000}
                                     hideProgressBar={true}
                                     newestOnTop={false}
                                     closeOnClick
                                     rtl={false}
                                     pauseOnFocusLoss
                                     draggable
                                     pauseOnHover
                                     theme="light" />
                </InitProvider>


            </BrowserRouter>




        </Provider>
    )
};

//localStorage.clear();
console.clear();


export const render = () => createRoot(document.getElementById('root')).render(<JSX/>);
render();
serviceWorker.unregister();


