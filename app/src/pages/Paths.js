import React from "react";
import Globe from "react-globe.gl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import _ from "lodash";

export default class Paths extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: null,
      observatories: null,
      satellites: null,
      gData: [],
      gLabels: [],
      pathData: [],
      interval: 2,
      time: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.globeEl = React.createRef();
  }
  componentDidMount() {
    this.getObservatories();
    const globe = this.globeEl;
    if (globe.current) {
      globe.current.controls().autoRotate = true;
      globe.current.controls().autoRotateSpeed = 3;
    }
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

  processObservatories = () => {
    const observatories = this.state.observatories.map((observatory) => {
      return observatory.Name;
    });
    const data = this.convertArrayToObject(this.state.observatories);
    this.setState({
      observatories: observatories,
      satellites: data,
    });
    this.getLocations();
  };

  processDateTime = (dt) => {
    return dt.substring(0, dt.indexOf(".")).replace(/[-:]/g, "");
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
    const satellite = this.state.satellites["ISS"];
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

  processLocation = (satellite, interval = 2) => {
    const lat = _.takeRight(
      this.state.locations[0].Coordinates[1][0].Latitude[1],
      interval * 60
    );
    const lng = _.takeRight(
      this.state.locations[0].Coordinates[1][0].Longitude[1],
      interval * 60
    );
    let pathData = [];
    for (let i = 0; i < Math.min(lat.length, lng.length); i++) {
      pathData.push([lat[i], lng[i], 100]);
    }

    const position = this.getPosition(satellite);
    this.setState({
      gData: position[0],
      gLabels: position[1],
      pathData: [pathData],
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    const satellite = this.state.satellites["ISS"];
    if ("interval" === event.target.name) {
      this.processLocation(satellite, event.target.value);
    } else {
      const position = this.getPosition(satellite, event.target.value);
      this.setState({
        gData: position[0],
        gLabels: position[1],
      });
    }
  };

  getPosition = (satellite, time = 1440) => {
    const data = this.state.locations.map((location) => ({
      name: satellite.Name,
      lat: location.Coordinates[1][0].Latitude[1][1440 - time],
      lng: location.Coordinates[1][0].Longitude[1][1440 - time],
      altitude: (location.RadialLength[1][1440 - time] - 6378.137) / 1000,
    }));

    const labels = this.state.locations.map((location) => ({
      text: `${satellite.Name}: ${
        location.Coordinates[1][0].Latitude[1][1440 - time]
      } ${location.Coordinates[1][0].Longitude[1][1440 - time]}`,
      id: satellite.Id,
      lat: location.Coordinates[1][0].Latitude[1][1440 - time],
      lng: location.Coordinates[1][0].Longitude[1][1440 - time],
    }));
    return [data, labels];
  };

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center">
            <Col md="auto">
              <h1 className="brand" style={{ fontSize: "8rem" }}>
                ORBITAL PATHS
              </h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="auto">
              <h3>
                International Space Station Orbital Path. More Paths Coming Soon
              </h3>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md="auto">
              <InputGroup className="mb-3">
                <Form.Control
                  as="select"
                  name="interval"
                  value={this.state.interval}
                  onChange={this.handleChange}
                  disabled={this.state.gData.length === 0}
                >
                  {[...Array(23).keys()].map((x, index) => {
                    return <option key={index}>{x + 2}</option>;
                  })}
                </Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text>Path Hours</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formBasicRange">
                <Form.Label className="mono">
                  {this.state.time > 0
                    ? `ISS Location: -${this.state.time} min (-${Math.round(
                        this.state.time / 60,
                        2
                      )} hr)`
                    : "ISS Location: Current"}
                </Form.Label>
                <Form.Control
                  type="range"
                  name="time"
                  value={this.state.time}
                  min={0}
                  max={60 * 24}
                  onChange={this.handleChange}
                  disabled={this.state.gData.length === 0}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Globe
              ref={this.globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              width={800}
              height={350}
              pointsData={this.state.gData}
              pointAltitude="altitude"
              pointColor={() => "red"}
              pathsData={this.state.pathData}
              pathColor={() => ["#fffaaa", "#fffaaa"]}
              pathPointAlt={0.1}
              pathStroke={2}
              labelsData={this.state.gLabels}
              labelSize={8}
            />
          </Row>
        </Container>
      </div>
    );
  }
}
