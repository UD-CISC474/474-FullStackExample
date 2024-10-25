import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatToolbarModule,MatButtonModule,RouterLink,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {
  public disableLogin: boolean = false;
  public authenticated: boolean = false;
  public showButtons:boolean=true;
  constructor(private _loginSvc:LoginService,router:Router){
    _loginSvc.loggedIn.subscribe(this.onLoginChange);    
    router.events.subscribe({
      next:(event)=>{
        if (event instanceof NavigationEnd && (event.url.indexOf("login")>=0||event.url.indexOf("register")>=0)){
          this.showButtons=false;
        }else{
          this.showButtons=true;
        }
      }
    })

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
