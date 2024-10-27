import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _loginSvc: LoginService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return new Promise((resolve, reject) => {
      this._loginSvc.authorize().then((res) => {
        if (res) {
          resolve(true);
        } else {
          this._router.navigate(['/login']);
          resolve(false);
        }
      }).catch((err) => {
        console.error(err);
        this._router.navigate(['/login']);
        resolve(false);
      });
    });
  }
}
