import React from "react";
import Globe from "react-globe.gl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

export default class SSC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: null,
      observatories: null,
      satellites: null,
      satellite: "",
      gData: [],
      gLabels: [],
    };
    this.globeEl = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.getObservatories();
    const globe = this.globeEl;
    if (globe.current) {
      globe.current.controls().autoRotate = true;
      globe.current.controls().autoRotateSpeed = 3;
    }
  }

  processDateTime = (dt) => {
    return dt.substring(0, dt.indexOf(".")).replace(/[-:]/g, "");
  };

  getLocations = (satellite) => {
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
      .then(() => this.processLocation(satellite))
      .catch((err) => {
        console.log(err);
      });
  };

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

  processObservatories = () => {
    const observatories = this.state.observatories.map((observatory) => {
      return observatory.Name;
    });
    const data = this.convertArrayToObject(this.state.observatories);
    this.setState({
      observatories: observatories,
      satellites: data,
      satellite: observatories[0],
    });
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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClick = () => {
    this.getLocations(this.state.satellites[this.state.satellite]);
  };

  processLocation = (satellite) => {
    const data = this.state.locations.map((location, index) => ({
      name: satellite.Name,
      lat:
        location.Coordinates[1][0].Latitude[1][
          location.Coordinates[1][0].Latitude[1].length - 1
        ],
      lng:
        location.Coordinates[1][0].Longitude[1][
          location.Coordinates[1][0].Longitude[1].length - 1
        ],
      altitude:
        (location.RadialLength[1][location.RadialLength[1].length - 1] -
          6378.137) /
        10000,
    }));
    const labels = this.state.locations.map((location, index) => ({
      text: satellite.Name,
      id: satellite.Id,
      lat:
        location.Coordinates[1][0].Latitude[1][
          location.Coordinates[1][0].Latitude[1].length - 1
        ],
      lng:
        location.Coordinates[1][0].Longitude[1][
          location.Coordinates[1][0].Longitude[1].length - 1
        ],
    }));
    this.setState({ gData: data, gLabels: labels });
  };

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center">
            <Col md="auto">
              <h1 className="brand" style={{ fontSize: "7.5rem" }}>
                SATELLITE CENTER
              </h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="auto">
              {this.state.satellites ? (
                <h3>
                  NASA{" "}
                  <a
                    href="https://sscweb.gsfc.nasa.gov/about.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SSC
                  </a>{" "}
                  tracks {this.state.observatories.length} satellites
                  historically or currently orbiting Planet Earth.
                </h3>
              ) : (
                <Spinner animation="border" role="status"></Spinner>
              )}
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md={4}>
              {this.state.satellites ? (
                <InputGroup className="mb-3">
                  <Form.Control
                    as="select"
                    name="satellite"
                    value={this.state.satellite}
                    onChange={this.handleChange}
                  >
                    {this.state.observatories.map((satellite, index) => {
                      return <option key={index}>{satellite}</option>;
                    })}
                  </Form.Control>
                  <InputGroup.Append>
                    <Button variant="secondary" onClick={this.handleClick}>
                      Locate
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              ) : (
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Loading SSC Satellites"
                    disabled={true}
                  />
                  <InputGroup.Append>
                    <Button variant="secondary" disabled={true}>
                      Locate
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              )}
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md={2}>
              <h6 className="mono">
                ID
                <br />{" "}
                {this.state.gData.length !== 0
                  ? this.state.satellites[this.state.satellite].Id
                  : "-"}
              </h6>
            </Col>
            <Col md={2}>
              <h6 className="mono">
                Latitude
                <br />{" "}
                {this.state.gData.length !== 0 ? this.state.gData[0].lat : "-"}
              </h6>
            </Col>
            <Col md={2}>
              <h6 className="mono">
                Longitude
                <br />{" "}
                {this.state.gData.length !== 0
                  ? this.state.gLabels[0].lng
                  : "-"}
              </h6>
            </Col>
            <Col md={2}>
              <h6 className="mono">
                Altitude
                <br />{" "}
                {this.state.gData.length !== 0
                  ? `${Math.round(this.state.gData[0].altitude * 1000, 2)}km`
                  : "-"}
              </h6>
            </Col>
            <Col md={2}>
              <h6 className="mono">
                Last Update
                <br />{" "}
                {this.state.gData.length !== 0
                  ? new Date(
                      this.state.satellites[this.state.satellite].EndTime
                    ).toLocaleDateString()
                  : "-"}
              </h6>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md="auto">
              <Globe
                ref={this.globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                width={800}
                height={360}
                pointsData={this.state.gData}
                pointAltitude="altitude"
                labelsData={this.state.gLabels}
                labelSize={10}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
