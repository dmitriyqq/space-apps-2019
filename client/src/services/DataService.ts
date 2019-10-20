import {YearsResponse, IDataService, CitiesResponse} from '../interfaces/IDataService'

export class DataService implements IDataService{
    base: string = 'http://localhost:5000'

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

    public async getCities(): Promise<CitiesResponse> {
        try {
            var resp = await fetch(`${this.base}/cities2`);
            var json = await resp.json();
            return json as CitiesResponse;
        } catch (error){
            console.error(error);
            return new CitiesResponse();
        }
    }
}