import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SatMap from "../components/SatMap";

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observatories: null,
      locations: null,
      satellites: null,
      location: { lat: 0, lng: 0 },
    };
  }
  componentDidMount() {
    this.getObservatories();
  }
  getObservatories = () => {
    const url = "https://sscweb.gsfc.nasa.gov/WS/sscr/2";
    const endpoint = `${url}/observatories/`;
    fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          observatories: response.Observatory[1],
        });
      })
      .then(() => this.processObservatories())
      .catch((err) => {
        console.log(err);
      });
  };

  convertArrayToObject = (array) => {
    const obj = {};
    return array.reduce((obj, observatory) => {
      return {
        ...obj,
        [observatory.Name]: {},
      };
    }, obj);
  };

  processDateTime = (dt) => {
    return dt.substring(0, dt.indexOf(".")).replace(/[-:]/g, "");
  };

  processObservatories = () => {
    const observatories = this.state.observatories.map((observatory) => {
      return {
        Id: observatory.Id,
        Name: observatory.Name,
        StartTime: observatory.StartTime[1],
        EndTime: observatory.EndTime[1],
      };
    });
    const data = this.convertArrayToObject(this.state.observatories);
    this.setState({
      observatories: observatories,
      satellites: data,
    });
    this.getLocations();
  };

  convertArrayToObject = (array) => {
    const obj = {};
    return array.reduce((obj, observatory) => {
      return {
        ...obj,
        [observatory.Name]: {
          Id: observatory.Id,
          Name: observatory.Name,
          StartTime: observatory.StartTime[1],
          EndTime: observatory.EndTime[1],
        },
      };
    }, obj);
  };

  getLocations = () => {
    const satellite = this.state.satellites["ACE"];
    const url = "https://sscweb.gsfc.nasa.gov/WS/sscr/2";
    const endDate = new Date(satellite.EndTime);
    const currentDate = new Date();

    const end =
      currentDate < endDate
        ? this.processDateTime(currentDate.toISOString()).slice(0, -2) + "00Z"
        : this.processDateTime(satellite.EndTime) + "Z";

    let prevDate;
    if (currentDate < endDate) {
      prevDate = currentDate;
    } else {
      prevDate = endDate;
    }
    prevDate.setDate(prevDate.getDate() - 1);
    const start =
      this.processDateTime(prevDate.toISOString()).slice(0, -2) + "00Z";

    const endpoint = `${url}/locations/${satellite.Id}/${start},${end}/`;
    fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          locations: response.Result.Data[1],
        });
      })
      .then(() => this.processLocation())
      .catch((err) => {
        console.log(err);
      });
  };

  processLocation = () => {
    console.log(this.state.locations);
    const data = this.state.locations.map((location, index) => ({
      lat:
        location.Coordinates[1][0].Latitude[1][
          location.Coordinates[1][0].Latitude[1].length - 1
        ],
      lng:
        location.Coordinates[1][0].Longitude[1][
          location.Coordinates[1][0].Longitude[1].length - 1
        ],
    }));
    this.setState({ location: data[0] });
  };

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center">
            <Col md="auto">
              <h1 className="brand" style={{ fontSize: "8rem" }}>
                SSC LIBRARY
              </h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <h3 className="light">
                Discover the NASA Satellite Situation Center observatories.
              </h3>
            </Col>
          </Row>
          {this.state.satellites && this.state.location ? (
            <Row
              className="justify-content-center"
              style={{
                marginTop: "1rem",
                height: "30rem",
                overflowY: "scroll",
              }}
            >
              {this.state.observatories.map((satellite, index) => {
                return (
                  <Col md={3} key={index}>
                    <OverlayTrigger
                      key={index}
                      placement="top"
                      overlay={
                        satellite.Id === "ace" ? (
                          <Tooltip>
                            SSC ID: {satellite.Id}
                            <SatMap
                              name={satellite.Name}
                              location={this.state.location}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip>SSC ID: {satellite.Id}</Tooltip>
                        )
                      }
                    >
                      <h3 key={index} style={{ cursor: "pointer" }}>
                        {satellite.Name}
                      </h3>
                    </OverlayTrigger>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Spinner animation="border" role="status"></Spinner>
          )}
        </Container>
      </div>
    );
  }
}
