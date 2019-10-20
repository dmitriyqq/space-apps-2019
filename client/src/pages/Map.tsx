import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { Map as LMap } from 'leaflet';
import { IDataService, City } from '../interfaces/IDataService';

type State = {
  lat: number,
  lng: number,
  zoom: number,
  cities: City[],
}

interface IProps {
  dataService: IDataService;
}

export class LeafletMap extends Component<IProps, State> {
  state: State = {
    lat: 51.505,
    lng: -0.09,
    zoom: 4,
    cities: []
  }

  async componentDidMount() {
    const { cities } = await this.props.dataService.getCities();
    this.setState({cities})
    this.handleViewportChange()
  }

  map: any;

  render() {
    const position: [number, number] = [this.state.lat, this.state.lng]
    return (
      <Map ref={(ref) => { this.map = ref; }} center={position} zoom={this.state.zoom} onViewportChange={this.handleViewportChange}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          this.state.cities.filter(city => city.population > 1000).map((city, i) => <Marker key={i} position={[city.lat, city.lng]}>
          </Marker>)
        }
      </Map>
    )
  }

  private handleViewportChange = () => {
      if (this.map && this.map.leafletElement) {
        console.log(this.map.leafletElement.getBounds());
        // console.log(this.map.getBounds())
      }
  }
}
