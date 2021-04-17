import React, { Component } from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  Button,
  FormGroup,
  Input,
  Col
} from 'reactstrap';

import Weather from './Weather';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: null,
      cityList: [],
      newCityName: '',
      error: '',
    };
  }

  getCityList = async () => {
    try {
      const res = await fetch('/api/cities');
      const data = await res.json();

      let cityList = data.map(r => r.city_name);
      this.setState({ cityList });

    } catch (error) {
      console.log(error);
    }
  };

  handleInputChange = (e) => {
    this.setState({ newCityName: e.target.value });
  };

  handleAddCity = () => {
    let input = this.state.newCityName.trim();
    if (!input) {
      return this.setState({ weather: null, error: 'Please input a city name.', newCityName: '' });
    }

    let lowerCase = input.toLowerCase();
    let city = lowerCase.split(' ').map(a => a[0].toUpperCase() + a.slice(1)).join(' ');

    fetch(`/api/weather/${city}`)
      .then(res => res.json())
      .then(data => {
        if (data.type === 'error') {
          throw new Error(data.message);
        }
        else {
          this.setState({ newCityName: '', weather: data, error: '' });
          return fetch('/api/cities', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city })
          })
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.type === 'error' && res.message === `duplicate key value violates unique constraint "cities_city_name_key"`) {
          throw new Error('Duplicate city name.');
        }
        this.getCityList();
        this.setState({ newCityName: '' });
      })
      .catch(err => {
        return this.setState({ weather: null, error: err.message});
      });
  };

  handleChangeCityAndGetWeather = async (e) => {
    try {
      let city = e.target.value;
      let res = await fetch(`/api/weather/${city}`);
      let data = await res.json();

      if (data.type === 'error') {
        return this.setState({ weather: null, error: data.message });
      }
      else return this.setState({ weather: data, error: '' });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getCityList();
  }

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand href="/">MyWeather</NavbarBrand>
        </Navbar>
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">MyWeather</h1>
              <p className="lead">The current weather for your favorite cities!</p>
              <InputGroup>
                <Input
                  placeholder="New city name..."
                  value={this.state.newCityName}
                  onChange={this.handleInputChange}
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" onClick={this.handleAddCity}>Add City</Button>
                </InputGroupAddon>

              </InputGroup>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="display-5">Current Weather</h1>
            <FormGroup>
              <Input type="select" onChange={this.handleChangeCityAndGetWeather}>
                {this.state.cityList.length === 0 && <option>No cities added yet.</option>}
                {this.state.cityList.length > 0 && <option>Select a city.</option>}
                {this.state.cityList.map((city, i) => <option key={i}>{city}</option>)}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <div>
          {
            this.state.error ?
              <p style={{ color: "red" }}> {this.state.error}</p>
              :
              <Weather data={this.state.weather} />
          }
        </div>

      </Container>
    );
  }
}

export default App;
