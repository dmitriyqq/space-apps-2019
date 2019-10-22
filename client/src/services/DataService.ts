import {YearsResponse, IDataService, CitiesResponse, OverviewResponse} from '../interfaces/IDataService'

export class DataService implements IDataService{
    base: string = 'https://shulaikin.tech:5000';

    public async getYears(): Promise<YearsResponse> {
        try {
            var resp = await fetch(`${this.base}/years`);
            var json = await resp.json();
            return json as YearsResponse;
        } catch (error){
            console.error(error);
            return new YearsResponse();
        }
    }

    public async getCitiesLevel(level: number, swlat: number, swlng: number, nelat: number, nelng: number): Promise<CitiesResponse> {
        try {
            var resp = await fetch(`${this.base}/cities_below_level`, {method: 'POST', headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },body : JSON.stringify({
                level, swlat, swlng, nelat, nelng
            })});
            var json = await resp.json();
            return json as CitiesResponse;
        } catch (error){
            console.error(error);
            return new CitiesResponse();
        }
    }

    public async getCitiesOverview(level: number): Promise<OverviewResponse> {
        try {
            var resp = await fetch(`${this.base}/total_cities_below_level`, {method: 'POST', headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },body : JSON.stringify({
                level
            })});
            var json = await resp.json();
            return json as OverviewResponse;
        } catch (error){
            console.error(error);
            return new OverviewResponse();
        }
    }
}