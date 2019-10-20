import React from 'react';
import './App.css';
import { LeafletMap } from './pages/Map'
import { DataService } from './services/DataService';
import Gorod from "./static/Gorod.svg"
import { YearsResponse, CitiesResponse } from './interfaces/IDataService';

interface IState {
  years: YearsResponse;
  cities: CitiesResponse;
}
class App extends React.Component<{}, IState> {

  async componentDidMount() {
    const dataservice = new DataService();
    const years = await dataservice.getYears();
    const cities = await dataservice.getCities();
    this.setState(
      {
        years: years,
        cities: cities,
      }
    );

    ($(".js-range-slider") as any).ionRangeSlider({
      skin: "big",
      min: 1880,
      max: 2013,
      from: 1880,
      step: 1,            // default 1 (set step)
      grid: true,         // default false (enable grid)
      grid_num: 10,        // default 4 (set number of grid cells)
      grid_snap: false    // default false (snap grid to step)
    })
  }

  componentDidUpdate() {
    ($(".js-range-slider") as any).ionRangeSlider({
      skin: "big",
      min: 1880,
      max: 2013,
      from: 1880,
      step: 1,            // default 1 (set step)
      grid: true,         // default false (enable grid)
      grid_num: 4,        // default 4 (set number of grid cells)
      grid_snap: false    // default false (snap grid to step)
    })
  }

  render() {
    return (
      <div className="cont">
        <div className="stakan">
          <div className="smallStakan">
            <label className="lab">
              <div className="fil" id="fill" style={{ height: "100%" }}>
                <img src={Gorod} className="gorod"></img>
              </div>
            </label>

          </div>
        </div>
        <div className="map">
          <LeafletMap dataService={new DataService()} />
        </div>
        <div className="polzynok">
          <input type="text" className="js-range-slider" name="my_range" />
        </div>
      </div>
    );
  }
}

export default App;
