import React, {Component} from 'react';


class Index extends Component {
    render() {

        return ( <div className={'text-center bg-white rounded-4 text-muted p-5'}>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className={'mt-3'}><small>Please wait</small></div>
        </div>)
    }
}




export default  Index;
