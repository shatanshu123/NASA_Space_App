import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AnimatedNumber from "react-animated-number";
import report from "../data/report.json";
import Chart from "../components/Chart";
import _ from "lodash";

export default class Report extends React.Component {
  render() {
    const obj = _.countBy(report.map((x) => x.LAUNCH_YEAR));
    const LAUNCH_COUNTS = Object.keys(obj).map((key) => [key, obj[key]]);
    return (
      <div>
        <Container>
          <Row className="justify-content-center">
            <Col md="auto">
              <h1 className="brand" style={{ fontSize: "8rem" }}>
                REPORT
              </h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <h3>
                <a
                  href="https://www.space-track.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Space-Track
                </a>{" "}
                curates a geosynchronous report of satellites in Low-Earth
                Orbit.
              </h3>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md={3}>
              <h1>
                <AnimatedNumber
                  component="text"
                  value={report.reduce(
                    (count, item) => count + (item.OBJECT_TYPE === "PAYLOAD"),
                    0
                  )}
                  style={{
                    transition: "0.8s ease-out",
                    transitionProperty: "background-color, color, opacity",
                    fontWeight: 200,
                    fontSize: "6rem",
                  }}
                  duration={6000}
                  stepPrecision={0}
                />
              </h1>
            </Col>
            <Col md={3}>
              <h1>
                <AnimatedNumber
                  component="text"
                  value={report.reduce(
                    (count, item) =>
                      count + (item.OBJECT_TYPE === "ROCKET BODY"),
                    0
                  )}
                  style={{
                    transition: "0.8s ease-out",
                    transitionProperty: "background-color, color, opacity",
                    fontWeight: 200,
                    fontSize: "6rem",
                  }}
                  duration={6000}
                  stepPrecision={0}
                />
              </h1>
            </Col>
            <Col md={3}>
              <h1>
                <AnimatedNumber
                  component="text"
                  value={report.reduce(
                    (count, item) => count + (item.OBJECT_TYPE === "DEBRIS"),
                    0
                  )}
                  style={{
                    transition: "0.8s ease-out",
                    transitionProperty: "background-color, color, opacity",
                    fontWeight: 200,
                    fontSize: "6rem",
                  }}
                  duration={6000}
                  stepPrecision={0}
                />
              </h1>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md={3}>
              <h4>Payloads</h4>
            </Col>
            <Col md={3}>
              <h4>Rocket Bodies</h4>
            </Col>
            <Col md={3}>
              <h4>Debris</h4>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "2rem" }}>
            <Col md="auto">
              <Chart data={LAUNCH_COUNTS} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
