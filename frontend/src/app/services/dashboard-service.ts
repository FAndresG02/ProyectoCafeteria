import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  //Url base para las solicitudes al backend, obtenida del archivo de environment
    url = environment.API_URL;

    constructor(private http: HttpClient){}

    getDetails(){
      return this.http.get(`${this.url}/dashboard/details`);
    }
}
