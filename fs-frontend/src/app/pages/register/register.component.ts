import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator, PasswordStrengthValidator } from './password-validators';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink,MatCardModule,MatFormFieldModule,MatButtonModule,MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public errorMsg:string="";
  public disableRegister: boolean = false;
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [PasswordStrengthValidator]),
    password2: new FormControl(null, []),
  },{validators:passwordMatchValidator()});

  constructor(
    private _loginSvc:LoginService,
    private _router: Router
  ) { }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
    this.disableRegister=true;
    this._loginSvc.register(this.registerForm.value.email, this.registerForm.value.password).then((res) => {
      if (res) {
        this._router.navigate(['/home']);
      }else{
        this.errorMsg="Registration failed";
      }
      this.disableRegister=false;
    }).catch((err) => {
      console.error(err.error);
      this.errorMsg="Registration failed: "+err.error.error;
      this.disableRegister=false;
    });
  }

}

