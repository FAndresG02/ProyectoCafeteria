import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  url = environment.API_URL

  constructor(private http: HttpClient){}

  add(data: any){
    return this.http.post(`${this.url}/category/add`, data, {headers: { 'Content-Type': 'application/json' }});
  }

  get(){
    return this.http.get(`${this.url}/category/get`);
  }

  update(data: any){
    return this.http.post(`${this.url}/category/update`, data, {headers: { 'Content-Type': 'application/json' }});
  } 

  //Metodo para extraer las categorias filtradas por el valor de true en el campo filterValue
  //usa el emismo metodo get() definio en el backend pero con un query param para filtrar los resultados
  //extrae solo las categorias que tienen productos asociados, lo que es util para mostrar solo las categorias disponibles al gestionar las órdenes
  getFilteredCategorys(){
    return this.http.get(`${this.url}/category/get?filterValue=true`);
  }
}
