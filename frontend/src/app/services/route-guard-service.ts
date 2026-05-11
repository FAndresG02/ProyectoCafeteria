import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Snackbar } from './snackbar';
import { GlobalConstants } from '../components/common/shared/global-constants';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {

  constructor(
    //Inyección de AuthService para verificar la autenticación del usuario
    public authService: AuthService,
    //Inyección de Router para redirigir a los usuarios no autenticados
    public router: Router,
    //Inyección de Snackbar para mostrar mensajes de error a los usuarios no autorizados
    private snackbarService: Snackbar
  ) { }

  //Metodo canActivate para proteger las rutas, verificando el token y el rol del usuario
  canActivate(route: ActivatedRouteSnapshot): boolean {

    //Obtiene el array de roles esperados para la ruta desde los datos de la ruta
    let expectedRoleArray = route.data['expectedRole'];

    //Obtiene el token del almacenamiento local
    const token: any = localStorage.getItem('token');

    //tokenPayload es una variable que almacenará la información decodificada del token, incluyendo el rol del usuario
    var tokenPayload: any;

    try {
      //Decodifica el token para obtener su payload, que contiene información sobre el usuario, incluyendo su rol
      //"admin", "user", etc.
      tokenPayload = jwtDecode(token);
    } catch (error) {
      //Si el token no es válido o ha expirado, se limpia el almacenamiento local, 
      // se redirige al usuario a la página de inicio de sesión y se retorna false
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    //Inicializa una variable para almacenar el rol esperado del usuario
    let expectedRole = '';

    //Itera sobre el array de roles esperados para la ruta 
    for (let i = 0; i < expectedRoleArray['length']; i++) {
      //Si el rol del usuario en el token coincide con alguno de los roles esperados para la ruta
      if (expectedRoleArray[i] == tokenPayload.role) {
        //Se asigna el rol esperado a la variable expectedRole
        expectedRole = tokenPayload.role;
      }
    }

    //Verifica si el rol del usuario en el token coincide con alguno de los roles esperados para la ruta
    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      //Si el usuario está autenticado y su rol coincide con el rol esperado para la ruta, se permite el acceso
      if (this.authService.isAuthenticated() && tokenPayload.role == expectedRole) {
        return true;
      }

      //Si el usuario está autenticado pero su rol no coincide con el rol esperado para la ruta
      //se muestra un mensaje de error y se redirige al usuario a su dashboard
      this.snackbarService.openSnackBar(GlobalConstants.unauthorizedMessage, GlobalConstants.error);
      this.router.navigate(['/cafe/dashboard']);
      return false;

    } else {

      //Si el usuario no está autenticado o su rol no coincide con el rol esperado para la ruta
      //se muestra un mensaje de error, se redirige al usuario a la página de inicio de sesión y se retorna false
      this.router.navigate(['/']);
      localStorage.clear();
      return false;

    }
  }
}