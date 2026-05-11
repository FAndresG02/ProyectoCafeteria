import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  url = environment.API_URL;

  constructor(private http: HttpClient) { }

  generateReport(data: any) {
    return this.http.post(`${this.url}/factura/generateReport`, data,
      { headers: { 'Content-Type': 'application/json' } });
  }

  getFacturas() {
    return this.http.get(`${this.url}/factura/getFacturas`);
  }

  getPdf(data: any) {
    return this.http.post(`${this.url}/factura/getPdf`, data, {
      responseType: 'blob'
    });
  }

  deleteFactura(id: any) {
    return this.http.delete(`${this.url}/factura/delete/${id}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

}
