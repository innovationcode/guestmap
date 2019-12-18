import React, {Component} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import './App.css';

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
    }, () => {
      console.log("Location not provided.....")
    });
  }

  render() {
    const position = [this.state.location.lat, this.state.location.lng]

    return (
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
    );
  }
}

export default App;
