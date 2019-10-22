import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet';
import { City } from '../interfaces/IDataService';

interface IProps {
  onClick: (city: City) => void;
  needMapUpdate: (swlat: number, swlng: number, nelat: number, nelng: number) => void
  lvl: number;
  cities: City[],
}

class State {
  zoom: number = 5;
}

export class LeafletMap extends Component<IProps, State> {
  state: State = {
    zoom: 4,
  }

  async componentDidMount() {
    this.updateCities();
  }

  map: any;

  render() {
    const minZoom = 10;
    const zoom = Math.max(minZoom, this.state.zoom);
    // const position: [number, number] = [this.state.lat, this.state.lng]
    return (
      <Map onClick={this.handleClick} ref={(ref) => { this.map = ref; }} center={[51.505,  -0.09]} zoom={7} onViewportChange={this.handleViewportChange}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          this.props.cities.map((city, i) => 
          <Marker icon={new Leaflet.Icon.Default({shadowUrl: undefined, className: city.destroyed ? 'bad' : 'good', iconUrl: undefined})} key={i} position={[city.lat, city.lng]}></Marker>)
        }
      </Map>
    )
  }

  private handleClick = (e: any) => {
    let n = null;
    let min = 0.1;
    console.log(e);
    const latlng = e.latlng;
    const lat = latlng.lat;
    const lng = latlng.lng;

    for (const city of this.props.cities) {
      const dx = city.lat - lat;
      const dy = city.lng - lng;

      const v = dx * dx + dy*dy;
      if (v < min) {
        n = city;
        min = v;
      }

    }

    console.log(min);
    if (n != null) {
      this.props.onClick(n);
    }
  }

  private handleViewportChange = (viewport: any) => {
    this.setState({zoom: Math.max(10, viewport.zoom)})
    this.updateCities();
  }

  private updateCities = async () => {
    try {
      const bounds = this.map.leafletElement.getBounds();
      this.props.needMapUpdate(bounds._southWest.lat, bounds._southWest.lng , bounds._northEast.lat, bounds._northEast.lng)
    } catch(error) {
      console.error(error);
    }
  }
}
