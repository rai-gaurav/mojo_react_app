import React, { Component } from "react";
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBCollapse,
    MDBNavItem,
    MDBNavLink,
} from "mdbreact";
import { withRouter } from "react-router";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <MDBNavbar color="default-color" dark expand="md" scrolling fixed="top">
                        <MDBNavbarBrand href="/">
                            <strong>Mojo React App</strong>
                        </MDBNavbarBrand>
                        <MDBNavbarToggler onClick={this.onClick} />
                        <MDBCollapse isOpen={this.state.collapse} navbar>
                            <MDBNavbarNav left>
                                <MDBNavItem active={this.props.location.pathname === "/"}>
                                    <MDBNavLink to="/">Home</MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem active={this.props.location.pathname === "/chart1"}>
                                    <MDBNavLink to="/chart1">LineChart</MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem active={this.props.location.pathname === "/chart2"}>
                                    <MDBNavLink to="/chart2">ColumnChart</MDBNavLink>
                                </MDBNavItem>
                            </MDBNavbarNav>
                        </MDBCollapse>
                    </MDBNavbar>
                </header>
            </React.Fragment>
        );
    }
}

export default withRouter(Header);
