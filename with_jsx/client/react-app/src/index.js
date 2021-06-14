import React from "react";
import ReactDOM from "react-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import ReactApp from "./ReactApp";

ReactDOM.render(
    <React.StrictMode>
        <ReactApp />
    </React.StrictMode>,
    document.getElementById("root")
);
