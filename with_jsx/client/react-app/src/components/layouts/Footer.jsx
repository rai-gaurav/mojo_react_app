import React, { Component } from "react";
import { MDBContainer, MDBFooter } from "mdbreact";

class Footer extends Component {
    render() {
        return (
            <MDBFooter color="default-color" className="font-small pt-4 mt-4">
                <div className="text-center py-3">
                    <MDBContainer fluid className="text-center">
                        <a href="/">Home</a> | <a href="/chart1">LineChart</a>| <a href="/chart2">ColumnChart</a>
                    </MDBContainer>
                </div>
                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright:{" "}
                        <a href="https://www.mdbootstrap.com"> MDBootstrap.com </a>
                    </MDBContainer>
                </div>
            </MDBFooter>
        );
    }
}

export default Footer;
