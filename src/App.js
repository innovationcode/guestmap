import React, {Component} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import './App.css';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';


var myIcon = L.icon({
  iconUrl: 'https://png.pngtree.com/png-clipart/20190516/original/pngtree-location-vector-icon-png-image_3722521.jpg',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor:[0, -41]
})

class App extends Component {
  state = {
    location : {
      lat: 51.505,
      lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
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
          <CardTitle>Special Title Treatment</CardTitle>
          <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
          <Button>Go somewhere</Button>
        </Card>
      </div>  
    );
  }
}

export default App;
