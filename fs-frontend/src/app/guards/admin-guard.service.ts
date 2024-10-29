import { inject, Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';


export function roleGuardFn(rule:string): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => MaybeAsync<GuardResult>{
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):MaybeAsync<GuardResult>=>{
    const svc = inject(LoginService);
    const router = inject(Router);
    return new Promise((resolve, reject) => {
      svc.authorize().then((res) => {
        if(res){
          svc.hasRole(rule).then((res) => {
            if (res) resolve(res);
            else {
              router.navigate(['/login']);
              resolve(false);
            }
          }).catch((err) => {
            console.error(err);
            router.navigate(['/login']);
            resolve(false);
          });
        }else{
          router.navigate(['/login']);
          resolve(false);
        }
      }).catch((err) => {
        console.error(err);
        router.navigate(['/login']);
        resolve(false);
      });
    });
    return false;
  }
}

