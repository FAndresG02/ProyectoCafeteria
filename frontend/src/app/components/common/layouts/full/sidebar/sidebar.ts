import { Component, OnDestroy, inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { MenuItems } from '../../../../../interface/menu-items';
import { jwtDecode } from 'jwt-decode';
import { MATERIAL_IMPORTS } from '../../../shared/material.imports';
import { COMMON_IMPORTS } from '../../../shared/common.imports';
import { AccordionDirective, AccordionLinkDirective, AccordionAnchorDirective } from "../../../shared/accordion";

@Component({
  selector: 'app-sidebar',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS,
    AccordionDirective,
    AccordionLinkDirective,
    AccordionAnchorDirective
],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnDestroy {

  //Propiedad para almacenar la consulta de medios que determina si la pantalla es móvil o no
  mobileQuery: MediaQueryList;
  //Propiedad para almacenar el rol del usuario, obtenida del token de autenticación
  userRole: any;
  //Propiedad para almacenar el token de autenticación, obtenida del almacenamiento local
  token: any = localStorage.getItem('token');
  //Propiedad para almacenar la carga útil del token de autenticación, decodificada a partir del token
  tokenPayload: any;

  //Propiedad para almacenar la función de escucha de cambios en la consulta de medios
  //Se utiliza para detectar cambios en el tamaño de la pantalla
  private _mobileQueryListener: () => void;

  constructor(
    //MediaMatcher permite crear consultas de medios para detectar el tamaño de la pantalla
    media: MediaMatcher,
    //ChangeDetectorRef permite detectar cambios en la vista y actualizarla en consecuencia
    changeDetectorRef: ChangeDetectorRef,
    //MenuItems proporciona los elementos del menú para la barra lateral
    public menuItems: MenuItems
  ) {

    //Decodifica el token de autenticación para obtener la carga útil, que contiene información sobre el usuario, como su rol
    this.tokenPayload = jwtDecode(this.token);
    //Asigna el rol del usuario a la propiedad userRole admin o user dependiendo del token
    this.userRole = this.tokenPayload?.role;
    //Crea una consulta de medios que se activa cuando el ancho de la pantalla es menor a 768 píxeles
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    //Define la función de escucha para detectar cambios en la consulta de medios, que actualiza la vista cuando el tamaño de la pantalla cambia
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    // addEventListener reemplaza el deprecado addListener
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

  }

  ngOnDestroy(): void {
    // // Elimina el listener de cambios en la consulta de medios cuando el componente se destruye para evitar fugas de memoria
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
