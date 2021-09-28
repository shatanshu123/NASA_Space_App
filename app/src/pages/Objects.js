import React from "react";
import Globe from "react-globe.gl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import countries from "../data/countries.json";
import scores from "../data/scores.json";

const CATEGORIES = [
  "ORBITAL_PAYLOAD_COUNT",
  "ORBITAL_ROCKET_BODY_COUNT",
  "ORBITAL_DEBRIS_COUNT",
  "ORBITAL_TOTAL_COUNT",
  "DECAYED_PAYLOAD_COUNT",
  "DECAYED_PAYLOAD_COUNT",
  "DECAYED_ROCKET_BODY_COUNT",
  "DECAYED_DEBRIS_COUNT",
  "DECAYED_TOTAL_COUNT",
  "COUNTRY_TOTAL",
];

export default class Objects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: [],
      gLabels: [],
      gData: [],
      category: "COUNTRY_TOTAL",
    };
    this.handleChange = this.handleChange.bind(this);
    this.globeEl = React.createRef();
  }
  componentDidMount() {
    const globe = this.globeEl;
    if (globe.current) {
      globe.current.controls().autoRotate = true;
      globe.current.controls().autoRotateSpeed = 1;
    }
    this.processData(this.state.category);
  }

  convertArrayToObject = (array) => {
    const obj = {};
    return array.reduce((obj, record) => {
      return {
        ...obj,
        [record.COUNTRY]: {
          COUNTRY: record.COUNTRY,
          SPADOC_CD: record.SPADOC_CD,
          ORBITAL_TBA: record.ORBITAL_TBA,
          ORBITAL_PAYLOAD_COUNT: record.ORBITAL_PAYLOAD_COUNT,
          ORBITAL_ROCKET_BODY_COUNT: record.ORBITAL_ROCKET_BODY_COUNT,
          ORBITAL_DEBRIS_COUNT: record.ORBITAL_DEBRIS_COUNT,
          ORBITAL_TOTAL_COUNT: record.ORBITAL_TOTAL_COUNT,
          DECAYED_PAYLOAD_COUNT: record.DECAYED_PAYLOAD_COUNT,
          DECAYED_ROCKET_BODY_COUNT: record.DECAYED_ROCKET_BODY_COUNT,
          DECAYED_DEBRIS_COUNT: record.DECAYED_DEBRIS_COUNT,
          DECAYED_TOTAL_COUNT: record.DECAYED_TOTAL_COUNT,
          COUNTRY_TOTAL: record.COUNTRY_TOTAL,
        },
      };
    }, obj);
  };

  processData = (category) => {
    const obj = this.convertArrayToObject(scores);
    const data = countries.map((item) => ({
      lat: item.latlng[0],
      lng: item.latlng[1],
      count: obj[item.name.toUpperCase()]
        ? obj[item.name.toUpperCase()][category] / 100
        : 0,
      text: obj[item.name.toUpperCase()]
        ? `${item.name} -  ${obj[item.name.toUpperCase()][category]}`
        : `${item.name} -  0`,
    }));
    const labels = countries.map((item) => ({
      lat: item.latlng[0],
      lng: item.latlng[1],
      text: obj[item.name.toUpperCase()]
        ? `${item.name} - ${obj[item.name.toUpperCase()][category]}`
        : `${item.name} - 0`,
    }));
    this.setState({ gData: data, gLabels: labels });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    this.processData(event.target.value);
  };

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center">
            <Col md="auto">
              <h1 className="brand" style={{ fontSize: "8rem" }}>
                SPACE OBJECTS
              </h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={12}>
              <h3>
                The eternal Space Race. Compare your country's orbital exploits
                against the World.
              </h3>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md="auto">
              <InputGroup className="mb-3">
                <Form.Control
                  as="select"
                  name="category"
                  value={this.state.category}
                  onChange={this.handleChange}
                >
                  {CATEGORIES.map((category, index) => {
                    return <option key={index}>{category}</option>;
                  })}
                </Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text>Category</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
            <Col md="auto">
              <Globe
                ref={this.globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                width={800}
                height={400}
                pointsData={this.state.gData}
                pointLabel="text"
                pointAltitude="count"
                labelsData={this.state.gLabels}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
