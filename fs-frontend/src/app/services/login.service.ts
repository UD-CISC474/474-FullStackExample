import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../config';

interface TokenResponseObject {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }
  public get token(): string {
    return localStorage.getItem('token') || '';
  }
  public set token(value: string) {
    localStorage.setItem('token', value);
  }

  public get loggedIn(): boolean {
    return this.token.length > 0;
  }

  public async login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<TokenResponseObject>(Config.apiBaseUrl, { username: username, password: password }).subscribe({
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
          reject(error);
        }
      });
    });
  }
  public logout(): void {
    this.token = '';
  }

}
