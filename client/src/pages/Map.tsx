import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet';
import { IDataService, City, CitiesResponse } from '../interfaces/IDataService';
import logo from '../logo.svg';

const goodicon = new Leaflet.Icon({shadowUrl: undefined, className: 'goodicon'});
const badicon = new Leaflet.Icon({shadowUrl: undefined, className: 'badicon'});

const icon = new Leaflet.Icon({shadowUrl: undefined, iconUrl: logo});

type State = {
  lat: number,
  lng: number,
  zoom: number,
  cities: City[],
}

interface IProps {
  dataService: IDataService;
  lvl: number;
}

export class LeafletMap extends Component<IProps, State> {
  state: State = {
    lat: 51.505,
    lng: -0.09,
    zoom: 4,
    cities: []
  }

  async componentDidMount() {
    this.updateCities();
  }

  map: any;

  render() {
    const maxZoom = 10;
    const zoom = Math.min(maxZoom, this.state.zoom);

    const position: [number, number] = [this.state.lat, this.state.lng]
    return (
      <Map ref={(ref) => { this.map = ref; }} center={position} zoom={10} onViewportChange={this.handleViewportChange}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          this.state.cities.filter(city => city.population > 1000).map((city, i) => 
          <Marker icon={new Leaflet.Icon.Default({shadowUrl: undefined, className: city.destroyed ? 'bad' : 'good', iconUrl: undefined})} key={i} position={[city.lat, city.lng]}></Marker>)
        }
      </Map>
    )
  }

  private handleViewportChange = () => {
    this.updateCities();
  }

  private updateCities = async () => {
    if (this.map && this.map.leafletElement) {
      try {
      const bounds = this.map.leafletElement.getBounds();

      
      const { cities } = await this.props.dataService.getCitiesLevel(
        this.props.lvl, bounds._southWest.lat, bounds._southWest.lng , bounds._northEast.lat, bounds._northEast.lng);
      
      this.setState(() => ({ cities }))
      } catch(error) {
        console.error(error);
      }
      
    }
  }
}
