import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  //Url base para las solicitudes al backend, obtenida del archivo de environment
  url = environment.API_URL;

  //Inyección de HttpClient para realizar solicitudes HTTP al backend
  constructor(private http: HttpClient) {}

  //Metodo para registrar un nuevo usuario
  //headers: es necesario para que el backend pueda interpretar correctamente el cuerpo de la solicitud como JSON
  signup(data: any) {
    return this.http.post(`${this.url}/user/signup`, data, {headers: { 'Content-Type': 'application/json' }});
  }

  //Metodo para cambiar la contraseña
  //headers: es necesario para que el backend pueda interpretar correctamente el cuerpo de la solicitud como JSON
  forgotPassword(data: any) {
    return this.http.post(`${this.url}/user/forgotPassword`, data, {headers: { 'Content-Type': 'application/json' }});
  }

  //Metodo para iniciar sesión
  login(data: any) {
    return this.http.post(`${this.url}/user/login`, data, {headers: { 'Content-Type': 'application/json' }});
  }

  //Metodo para verificar si el token de autenticación es válido
  checkToken() {
    return this.http.get(`${this.url}/user/checkToken`);
  }

  //Metodo para cerrar sesión, elimina el token de autenticación del almacenamiento local
  changePassword(data: any) {
    return this.http.post(`${this.url}/user/changePassword`, data, {headers: { 'Content-Type': 'application/json' }});
  }

  //Metodo para obtener la lista de usuarios registrados en el sistema
  getUsers(){
    return this.http.get(`${this.url}/user/get`);
  }

  //Metodo para actualizar la información del usuario
  update(data: any){
    return this.http.post(`${this.url}/user/update`, data, {headers: { 'Content-Type': 'application/json' }});
  }
}
