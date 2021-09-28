import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class About extends React.Component {
  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center">
            <Col md="auto">
              <h1 className="brand" style={{ fontSize: "8rem" }}>
                ABOUT US
              </h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <h4>
                SKYBOX is built for NASA Space Apps 2021 - Orbital Sky Challenge
              </h4>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <h4>Designed and Developed in India</h4>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <h4>
                &copy; Taha Jamal, Shatanshu Agarwal
              </h4>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <h4>
                View the <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code
                </a>{" "}
              </h4>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <img src={"Space_Apps_Logos/PNG/Square White.png"} alt={"Space Apps Logo"} width={350}/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
