import { Inject, Injectable } from "@angular/core";

//Definición de la interfaz MenuItem que representa la estructura de un elemento del menú en la aplicación
export interface MenuItem {

    state: string;
    name: string;
    type: string;
    icon: string;
    role: string;
}

//Contiene un array de objetos que representan los elementos del menú en la aplicación
const MENUITEMS = [
    { state: 'dashboard', name: 'Panel', type: 'link', icon: 'dashboard', role: '' },
    { state: 'category', name: 'Categorías', type: 'link', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Productos', type: 'link', icon: 'inventory_2', role: 'admin' },
    { state: 'order', name: 'Pedidos', type: 'link', icon: 'shopping_cart', role: '' },
    { state: 'factura', name: 'Facturas', type: 'link', icon: 'receipt', role: '' },
    { state: 'user', name: 'Usuarios', type: 'link', icon: 'people', role: 'admin' },

];

//Proporciona un método para obtener los elementos del menú
@Injectable()
export class MenuItems {
    getMenuitem(): MenuItem[] {
        return MENUITEMS;
    }
}