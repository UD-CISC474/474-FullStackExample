/*
    This file contains the models for the security module.
*/

/* UserLoginModel
    * @interface: UserLoginModel
    * @remarks: A model for the user login
    * 			  username: a string that represents the username
    * 			  password: a string that represents the password
    * 			  roles: an array of strings that represents the roles
    */
export interface UserLoginModel{
    username: string;
    password: string;
    roles: string[];
}
