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



export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});


const JSX = () => {

    return (
        <Provider store={store}>
            <BrowserRouter history={history}>

                    <div className={'h-100 d-flex flex-column'}>
                        <Header location={history.location} />
                        <RoutingComponent />
                        <Footer/>
                    </div>
                    <Dialog/>

                    <Loader/>
            </BrowserRouter>



        </Provider>
    )
};

//localStorage.clear();
console.clear();


export const render = () => createRoot(document.getElementById('root')).render(<JSX/>);
render();
serviceWorker.unregister();


