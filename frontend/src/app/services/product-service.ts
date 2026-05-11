import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.API_URL;

  constructor(private http: HttpClient) {}

  add(data: any) {
    return this.http.post(`${this.url}/product/add`, data,
      { headers: { 'Content-Type': 'application/json' } });
  }

  get() {
    return this.http.get(`${this.url}/product/get`);
  }

  update(data: any) {
    return this.http.post(`${this.url}/product/update`,
      data, { headers: { 'Content-Type': 'application/json' } });
  }

  delete(id: any) {
    return this.http.delete(`${this.url}/product/delete/${id}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  updateStatus(data: any) {
    return this.http.post(`${this.url}/product/updateStatus`,
      data, { headers: { 'Content-Type': 'application/json' } });
  }

  getByCategory(id: any){
    return this.http.get(`${this.url}/product/getByCategory/${id}`);
      
  }

  getProductById(id: any){
    return this.http.get(`${this.url}/product/getProductById/${id}`);
  }
  
}
