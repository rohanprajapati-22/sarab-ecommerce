import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CartPage } from './cart-page/cart-page';
import { Login } from './login/login';
import { Register } from './register/register';
import { AdminLayout } from './admin/admin-layout';
import { AdminLogin } from './admin/admin-login';
import { OrdersList } from './admin/orders/orders-list';
import { OrderDetails } from './admin/orders/order-details';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: CartPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: OrdersList },
      { path: 'orders/:id', component: OrderDetails },
    ],
  },
  { path: 'admin/login', component: AdminLogin },
  { path: '**', redirectTo: '' },
];