import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./ReactApp.css";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Chart1 from "./components/Chart1";
import Chart2 from "./components/Chart2";
import Home from "./components/Home";
import { MDBContainer } from "mdbreact";

class ReactApp extends Component {
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Header location={this.props.location} />
                    <main className="site-content">
                        <MDBContainer className="text-center my-5">
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/chart1" component={Chart1} />
                                <Route exact path="/chart2" component={Chart2} />
                            </Switch>
                        </MDBContainer>
                    </main>
                    <Footer />
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

export default ReactApp;
