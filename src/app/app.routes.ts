import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CartPage } from './cart-page/cart-page';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: CartPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' },
];