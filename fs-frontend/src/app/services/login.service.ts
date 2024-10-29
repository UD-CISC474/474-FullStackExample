import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../config';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserLoginModel } from '../models/users.model';

interface TokenResponseObject {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient,private _router:Router) { 
    this.loggedIn.next(this.token.length > 0);
  }
  /* *********************************NOTE*********************************/
  /* These method is used to get/set the token from/to local storage.     */
  /* By using localstorage we can persist the token across page reloads.  */
  /* and short intervals (based on token expiration time).                */
  /* *********************************NOTE*********************************/
  public get token(): string {
    return localStorage.getItem('token') || '';
  }
  public set token(value: string) {
    localStorage.setItem('token', value);
    this.loggedIn.next(value.length > 0);
  }

  public loggedIn: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  
  public async hasRole(role:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<UserLoginModel>(Config.apiBaseUrl + `/security/user`).subscribe({
        next: (response) => {
          if (response.roles)
            resolve(response.roles.indexOf(role) >= 0);
          else
            resolve(false);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  //verifies the token with the server and refreshes it.
  public async authorize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<TokenResponseObject>(Config.apiBaseUrl + '/security/authorize').subscribe({
        next: (response) => {
          this.token = response.token;
          resolve(response.token.length > 0);
        },
        error: (error) => {
          reject(error);
        }
      });
    }); 
  }

  /* *********************************NOTE*********************************/
  /* This method returns a promise so that we can use the async/await     */
  /* pattern in the component.  httpClient returns an observable, which   */
  /* would require us to subscribe to it in the component.                */
  /* for simpplicity, we are just returning the promise.                  */
  /* *********************************NOTE*********************************/
  public login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<TokenResponseObject>(Config.apiBaseUrl+"/security/login", { username: username, password: password }).subscribe({
        next: (response) => {
          if (response.token && response.token.length > 0) {
            this.token = response.token
            resolve(true);
          } else {
            this.token = "";
            resolve(false);
          }
        },
        error: (error) => {
          this.token="";
          console.error(error);
          reject(error);
        }
      });
    });
  }
  public logout(): void {
    this.token = '';
  }

  public async register(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<TokenResponseObject>(Config.apiBaseUrl+"/security/register", { username: username, password: password }).subscribe({
        next: (response) => {
          if (response.token && response.token.length > 0) {
            this.token = response.token;
            this._router.navigate(['/home']);
            resolve(true);
          } else {
            this.token = "";
            resolve(false);
          }
        },
        error: (error) => {
          this.token="";
          console.error(error);
          reject(error);
        }
      });
    });
  }
}
