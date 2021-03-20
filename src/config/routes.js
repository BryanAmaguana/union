/* importacion de los layout */

import LayoutAdmin from '../layouts/LayoutAdmin';
import LayoutPersonal from '../layouts/LayoutPersonal'
import LayoutPublico from '../layouts/LayoutPublico'

/* Importacion paginas Administrador */

import AdminHome from '../pages/Admin';
import AdminSingIn from '../pages/Admin/SignIn/SingIn';
import AdminUsers from '../pages/Admin/Users';
import AdminRol from '../pages/Admin/Rol';
import AdminPersona from '../pages/Admin/Persona';
import AdminBus from '../pages/Admin/Bus';
import AdminTarjeta from '../pages/Admin/Tarjeta';
import AdminRuta from '../pages/Admin/Ruta';
import AdminTipo from '../pages/Admin/Tipo_Pasajero';
import AdminPasajero from '../pages/Admin/Pasajero';
import AdminCobro from '../pages/Admin/CobroPasaje';

/* Importacion Publico */
import HomePublico from '../pages/Publico/Home';
import ContactPublico from '../pages/Publico/Contact';

/* Importacion Personal */
import HomePersonal from '../pages/Personal/Personal';
import PersonalLogin from '../pages/Personal/SingIn';

/* Error 404 */
import Error404 from '../pages/Publico/Error404';

const routes = [
    {
        path: "/admin",
        component: LayoutAdmin,
        exact: false,
        routes: [
            {
                path: "/admin",
                component: AdminHome,
                exact: true
            },
            {
                path: '/admin/login',
                component: AdminSingIn,
                exact: true
            },
            {
                path: '/admin/usuario',
                component: AdminUsers,
                exact: true
            },
            {
                path: '/admin/rol',
                component: AdminRol,
                exact: true
            },
            {
                path: '/admin/persona',
                component: AdminPersona,
                exact: true
            },
            {
                path: '/admin/bus',
                component: AdminBus,
                exact: true
            },
            {
                path: '/admin/tarjeta',
                component: AdminTarjeta,
                exact: true
            },
            {
                path: '/admin/ruta',
                component: AdminRuta,
                exact: true
            },
            {
                path: '/admin/tipo',
                component: AdminTipo,
                exact: true
            },
            {
                path: '/admin/pasajero',
                component: AdminPasajero,
                exact: true
            },
            {
                path: '/admin/cobro',
                component: AdminCobro,
                exact: true
            },
            {
                component: Error404
            }
        ]
    },
    {
        path: "/personal",
        component: LayoutPersonal,
        exact: false,
        routes: [
            {
                path: "/personal",
                component: HomePersonal,
                exact: true
            },
            {
                path: "/personal/login",
                component: PersonalLogin,
                exact: true 
            },
            {
                component: Error404
            }
        ]
    },
    {
        path: "/",
        component: LayoutPublico,
        exact: false,
        routes: [
            {
                path: "/",
                component: HomePublico,
                exact: true
            },
            {
                path: "/contact",
                component: ContactPublico,
                exact: true 
            },
            {
                component: Error404
            }
        ]
    }
]

export default routes;