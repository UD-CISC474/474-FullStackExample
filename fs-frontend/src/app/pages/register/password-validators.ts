import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"
import { Config } from "../../config";

export const passwordMatchValidator=function (): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
	  const password = control.get('password');
	  const confirmPassword = control.get('password2');
  
	  if (password && confirmPassword && password.value !== confirmPassword.value) {
		return { 'passwordMismatch': true };
	  }
	  return null;
	};
  }

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';
  if (value.length < Config.minPasswordLength) {
    return { passwordStrength: `Password must be at least ${Config.minPasswordLength} characters long` };
  }

  let upperCaseCharacters = /[A-Z]+/g
  if (upperCaseCharacters.test(value) === false) {
    return { passwordStrength: `text has to contine Upper case characters,current value ${value}` };
  }

  let lowerCaseCharacters = /[a-z]+/g
  if (lowerCaseCharacters.test(value) === false) {
    return { passwordStrength: `text has to contine lower case characters,current value ${value}` };
  }


  let numberCharacters = /[0-9]+/g
  if (numberCharacters.test(value) === false) {
    return { passwordStrength: `text has to contine number characters,current value ${value}` };
  }

  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (specialCharacters.test(value) === false) {
    return { passwordStrength: `text has to contine special character,current value ${value}` };
  }
  return null;
}