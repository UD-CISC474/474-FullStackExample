import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { AdminGuardService } from './guards/admin-guard.service';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	//lazy loading of login page
	{ path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
	{ path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) }
	{ path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),canActivate: [AuthGuardService] },
	{ path: 'admin',loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),canActivate: [AdminGuardService]}
];
