import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private _loginSvc:LoginService){}
  ngOnInit(): void {
    this._loginSvc.login("silber@udel.edu","pass").then(async (result)=>{
      console.log("Login result: "+result);
      console.log("Token: "+this._loginSvc.token);
      let res=await this._loginSvc.authorize();
      console.log("Authorize result: "+res);
    }).catch((error)=>{
      console.error("Login error: "+error);
    });
  
  }
}