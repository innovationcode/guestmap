import React, {Component} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import { Form, FormGroup, Input, Card, Button, CardTitle, CardText, Row, Col, Label } from 'reactstrap';
import Joi from '@hapi/joi';

import './App.css';



var myIcon = L.icon({
  iconUrl: 'https://png.pngtree.com/png-clipart/20190516/original/pngtree-location-vector-icon-png-image_3722521.jpg',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor:[0, -41]
})

//Validating input 
const schema = Joi.object({
  name: Joi.string()
           .min(1)
           .max(100)
           .required(),

  message: Joi.string()
              .alphanum()
              .min(1)
              .max(500)
              .required(),
});

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'production_url';

class App extends Component {
  state = {
    location : {
      lat: 51.505,
      lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name : '',
      message : ''
    },
    sendingMessage : false,
    sentMessage: false,
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        location : {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        haveUsersLocation: true,
        zoom: 13,
      }); 
    }, () => { //callback in navigator.geolocation if location not allowed then find using IP 
             console.log("Location not provided...")
             fetch('https://ipapi.co/json')
                .then(res => res.json())
                .then(location => {
                    console.log(location);
                      this.setState({
                          location: {
                              lat: location.latitude,
                              lng: location.longitude
                          },
                          haveUsersLocation: true,
                          zoom: 13,
                      });
                 })
              } // callback end here 
    ); //navigator.location end
  } //componentDidmout end..

  formIsValid = () => {
      const userMessage = {
        name : this.state.userMessage.name,
        message: this.state.userMessage.message
      };
      const result = schema.validate(userMessage);
      return !result.error && this.state.haveUsersLocation ?  true : false;
  }

  formSubmitted = (event) => {
      event.preventDefault();
      console.log(this.state.userMessage);
      
      if(this.formIsValid()) {
          this.setState({
            sendingMessage: true,
          })
          fetch(API_URL, {
              method: 'POST',
              headers: {
                  'content-type' : 'application/json',
                  //'Accept': 'application/json'
              },
              body: JSON.stringify({
                  name : this.state.userMessage.name,
                  message: this.state.userMessage.message,
                  latitude: this.state.location.lat,
                  longitude:this.state.location.lng,
              })
          }).then(res => res.json())
            .then(message => {console.log(message);
              setTimeout(() => {
                this.setState({
                  sendingMessage : false,
                  sentMessage: true,
                });
              }, 2000);  
            })
      }

  }
  
  valueChanged = (event) => {
      const{name, value} = event.target;
      this.setState((prevState) => ({
        userMessage: {
          ...prevState.userMessage,
          [name] : value
        }
      }))
  }

  render() {
    const position = [this.state.location.lat, this.state.location.lng]

    return (
      <div className = "map">
        <Map className = "map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.haveUsersLocation ?
              <Marker position={position} icon = {myIcon}>
                <Popup>
                  🌄 Atharva Dhake 😎 <br /> Tanishka 💦 🍠 🎉
                </Popup>
              </Marker> : ""
          }
        </Map>
        <Card body className = "message-form">
          <CardTitle>Welcome to GuestMap!</CardTitle>
          <CardText>Leave a message with your location!</CardText>
          <CardText>Thanks for stopping by!</CardText>
          {/* render the form if this.sendingMessage and sentMessage no either show loding or thanks message */}
          {!this.state.sendingMessage && !this.state.sentMessage && this.state.haveUsersLocation ?
              <Form onSubmit = {this.formSubmitted}>
                  <FormGroup>
                      <Label for = "name">Name</Label>
                      <Input 
                          onChange = {this.valueChanged}
                          type = "text" 
                          name = "name" 
                          id = "name" 
                          placeholder= "Enter your name"
                      />
                  </FormGroup>
                  <FormGroup>
                      <Label for = "message">Name</Label>
                      <Input 
                          onChange = {this.valueChanged}
                          type = "textarea" 
                          name = "message" 
                          id = "message" 
                          placeholder= "Enter your message"
                      />
                  </FormGroup>
                  <Button type = "submit" color= "info" disabled= {!this.formIsValid()}>Send</Button>
              </Form> : 
                  this.state.sendingMessage && ! this.state.haveUsersLocation ? 
                  <video autoPlay loop src = "https://media.giphy.com/media/BCIRKxED2Y2JO/giphy.mp4" ></video> :
                  <CardText>Thanks for sending Message..</CardText>
          }
        </Card>
      </div>  
    );
  }
}

export default App;
