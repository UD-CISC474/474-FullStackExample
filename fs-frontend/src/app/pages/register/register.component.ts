import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator, PasswordStrengthValidator } from './password-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink,MatCardModule,MatFormFieldModule,MatButtonModule,MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [PasswordStrengthValidator]),
    password2: new FormControl(null, []),
  },{validators:passwordMatchValidator()});

  constructor(
    private router: Router
  ) { }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
  }

}

