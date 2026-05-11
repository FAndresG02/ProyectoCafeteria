import { Routes } from '@angular/router';
import { Full } from './components/common/layouts/full/full';
import { Home } from './components/pages/home/home';
import { RouteGuardService } from './services/route-guard-service';
import { ManageCategory } from './components/pages/manage-category/manage-category';
import { ManageProduct } from './components/pages/manage-product/manage-product';
import { ManageOrder } from './components/pages/manage-order/manage-order';
import { ViewFactura } from './components/pages/view-factura/view-factura';
import { ManageUser } from './components/pages/manage-user/manage-user';

export const routes: Routes = [
    // Ruta raíz que carga el componente Home
    { path: '', component: Home },

    {
        // Ruta principal 'cafe'
        path: 'cafe',
        // Usa el componente Full como layout contenedor
        component: Full,
        // Define rutas hijas dentro de 'cafe'
        children: [

            // Redirige a 'dashboard' si la ruta está vacía
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            {
                // Ruta 'cafe/dashboard'
                path: 'dashboard',
                // Carga perezosa del componente Dashboard
                loadComponent: () =>
                    // Import dinámico del componente Dashboard
                    import('./components/pages/dashboard/dashboard').then(m => m.Dashboard),
                // Protege la ruta con el servicio de guardia de rutas
                canActivate: [RouteGuardService],
                // Define los roles esperados para acceder a esta ruta
                data: { expectedRole: ['admin', 'user'] }
            },
            {
                // Ruta 'cafe/best-seller'
                path: 'best-seller',
                // Carga perezosa del componente BestSeller
                loadComponent: () =>
                    // Import dinámico del componente BestSeller
                    import('./components/pages/best-seller/best-seller').then(m => m.BestSeller),
                // Protege la ruta con el servicio de guardia de rutas
                canActivate: [RouteGuardService],
                // Define los roles esperados para acceder a esta ruta
                data: { expectedRole: ['admin', 'user'] }
            },
            {
                //Ruta 'cafe/categoy'
                path: 'category',
                //Recarga el componente ManageCategory
                component: ManageCategory,
                // Protege la ruta con el servicio de guardia de rutas
                canActivate: [RouteGuardService],
                // Define los roles esperados para acceder a esta ruta osea solo usuarios 
                data: {
                    expectedRole: ['admin']
                }
            },
            {
                //Ruta 'cafe/product'
                path: 'product',
                //Recarga el componente ManageCategory
                component: ManageProduct,
                // Protege la ruta con el servicio de guardia de rutas
                canActivate: [RouteGuardService],
                // Define los roles esperados para acceder a esta ruta osea solo usuarios 
                data: {
                    expectedRole: ['admin']
                }
            },
            {
                //Ruta 'cafe/order'
                path: 'order',
                //Recarga el componente ManageOrder
                component: ManageOrder,
                // Protege la ruta con el servicio de guardia de rutas
                canActivate: [RouteGuardService],
                // Define los roles esperados para acceder a esta ruta osea solo usuarios admin y user
                data: {
                    expectedRole: ['admin', 'user']
                }
            },
            {
                //Ruta 'cafe/factura'
                path: 'factura',
                //Recarga el componente ManageOrder
                component: ViewFactura,
                // Protege la ruta con el servicio de guardia de rutas
                canActivate: [RouteGuardService],
                // Define los roles esperados para acceder a esta ruta osea solo usuarios admin y user
                data: {
                    expectedRole: ['admin', 'user']
                }
            },
            {
                //Ruta 'cafe/user'
                path: 'user',
                //Recarga el componente ManageOrder
                component: ManageUser,
                // Protege la ruta con el servicio de guardia de rutas
                canActivate: [RouteGuardService],
                // Define los roles esperados para acceder a esta ruta osea solo usuarios admin
                data: {
                    expectedRole: ['admin']
                }
            }

        ]
    },

    // Ruta comodín para manejar rutas no encontradas (fallback)
    { path: '**', component: Home },

];
