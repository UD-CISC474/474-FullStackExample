import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	//lazy loading of login page
	{ path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) }
];
