import React from 'react';
import './App.css';
import { LeafletMap } from './pages/Map'
import { DataService } from './services/DataService';
import Gorod from "./static/Gorod.svg"
import { City, IDataService, OverviewResponse } from './interfaces/IDataService';

interface IState {
  lvl: number;
  city: City | null;
  cities: City[];
  swlat: number;
  swlng: number;
  nelat: number;
  nelng: number;
  overview: OverviewResponse;
}

class App extends React.Component<{}, IState> {
  dataService: IDataService | null = null;
  timeout : NodeJS.Timeout | null = null;

  constructor(props: any) {
    super(props)
    this.state = ({
      lvl: 0,
      city: null,
      cities: [],
      swlat: 0,
      swlng: 0,
      nelat: 0,
      nelng: 0,
      overview: new OverviewResponse()
    })

    this.dataService = new DataService();
  }

  private handleClick = (city: City) => {
    this.setState(() => ({city}))
  }

  componentDidMount() {
    // const dataservice = new DataService();
    ($(".js-range-slider-2") as any).ionRangeSlider({
      skin: "big",
      min: 0,
      max: 100,
      from: 0,
      step: 1,            // default 1 (set step)
      grid: true,         // default false (enable grid)
      grid_num: 10,        // default 4 (set number of grid cells)
      grid_snap: false    // default false (snap grid to step)
    })
  }

  componentDidUpdate() {

    ($(".js-range-slider-2") as any).ionRangeSlider({
      skin: "big",
      min: 0,
      max: 100,
      from: 0,
      step: 1,            // default 1 (set step)
      grid: true,         // default false (enable grid)
      grid_num: 10,        // default 4 (set number of grid cells)
      grid_snap: false    // default false (snap grid to step)
    })
  }

  render() {

    let s = null;
    let city = this.state.city || ( this.state.cities && this.state.cities.length > 0 && this.state.cities[0]);

    if (city) { 
      s = <div className="smallStakan">
        <label className="lab">
          <div className="fil" id="fill" style={{ height: `${Math.min(100 - (Math.max(city.elevation, 0) - this.state.lvl) / Math.max(city.elevation, 1) * 100, 100)}%` }}>
          </div>
        </label>
        <h1>{city.name}</h1>
        <h4>City population: </h4>
        <h5>{city.population == 0 ? '<no-info>' : `${Math.round(city.population)} people`}</h5>
        <h4>City elevation: {city.elevation}m</h4>
        <h4>Cities affected: {this.state.overview.cities}</h4>
        <h4>People affected</h4>
        <h5>{this.state.overview.people == 0 ? '<no-info>' : `${Math.round(this.state.overview.people)} people`}</h5>
        <h4>Major cities affected:</h4>
        <ul style={{padding: 0}}> 
          {this.state.overview.list.cities.map(c => <li>{c.name} - {c.population} people</li>).filter((_, i) => i < 5)}
        </ul>
        <h2>Sea level: {this.state.lvl} m</h2>
        <img src={Gorod} className="gorod"></img>
      </div>
    }
    
    return (
      <div className="cont">
        <div className="stakan">
          {s}
        </div>
        <div className="map">
          <LeafletMap onClick={this.handleClick} lvl={this.state.lvl} needMapUpdate={this.fetchCities} cities={this.state.cities}/>
        </div>
        <div style={{width: `${(window.innerWidth - 350 || 850) - 350}px`}}className="polzynok" onClick={this.myfunc}>
          <input type="number" className="js-range-slider-2" name="my_range"/>
        </div>
      </div>
    );
  }

  fetchCities = async (swlat: number, swlng: number, nelat: number, nelng: number) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(async () => {
      const { cities } = await this.dataService!.getCitiesLevel(this.state.lvl, swlat, swlng , nelat, nelng);
      const overview = await this.dataService!.getCitiesOverview(this.state.lvl);
      console.log(overview)
      this.setState(() => ({ cities, swlat, swlng, nelat, nelng, overview}));
    }, 300);
    
  }

  myfunc = () => {
    const a = Number($(".irs-single")[0].innerText)
    this.setState(() => ({
      lvl: a
    }), () => {
      const { swlat, swlng, nelat, nelng} = this.state
      this.fetchCities(swlat, swlng, nelat, nelng)
    })
  }
}

export default App;
