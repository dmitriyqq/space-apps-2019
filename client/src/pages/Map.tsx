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
  }

  render() {
    const position: [number, number] = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
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

  private handleViewportChange = (viewport: {center: [number, number], zoom: number}) => {
      // if (!this.element) {
      //   throw new Error("couldn't get map");
      // }
  }
}
