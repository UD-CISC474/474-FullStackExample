import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(private _loginSvc:LoginService,private _router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return new Promise((resolve, reject) => {
      this._loginSvc.authorize().then((res) => {
        if(res){
          this._loginSvc.isAdmin().then((res) => {
            resolve(res);
          }).catch((err) => {
            console.error(err);
            this._router.navigate(['/login']);
            resolve(false);
          });
        }else{
          this._router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}

