import React from "react";

const theme = (WrappedComponent) => {

    return (props) => (<WrappedComponent {...props} />);
};

export default theme;


