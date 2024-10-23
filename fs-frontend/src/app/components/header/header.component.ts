import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatToolbarModule,MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {
  public disableLogin: boolean = false;
  public authenticated: boolean = false;
  constructor(private _loginSvc:LoginService){
    _loginSvc.loggedIn.subscribe(this.onLoginChange);    
  }

  onLoginChange=(loggedIn: boolean)=>{
    this.authenticated = loggedIn;
    console.log("Change:"+this.authenticated)
  }
  logout(){
    this._loginSvc.logout();
  }
  async login(){
    this.disableLogin=true;
    await this._loginSvc.login("silber@udel.edu","pass");
    this.disableLogin=false;
  }
}
