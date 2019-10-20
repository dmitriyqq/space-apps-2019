import React from 'react';
import './App.css';
import { LeafletMap } from './pages/Map'
import { DataService } from './services/DataService';
import Gorod from "./static/Gorod.svg"

interface IState {
  lvl: number;
}
class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props)
    this.state = ({
      lvl: 0
    })
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
          <LeafletMap dataService={new DataService()} lvl={this.state.lvl} />
        </div>
        <div className="polzynok" onClick={this.myfunc}>
          <input type="number" className="js-range-slider-2" name="my_range"/>
        </div>
      </div>
    );
  }
  myfunc = () => {
    const a = Number($(".irs-single")[0].innerText)
    this.setState({
      lvl: a
    })
  }
}

export default App;
