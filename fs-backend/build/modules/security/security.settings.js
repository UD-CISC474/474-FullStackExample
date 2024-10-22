"use strict";
/*
    This file is used to define the security settings for the application.
    The settings are used to configure the security module and can be accessed using the SecuritySettings class.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecuritySettings = void 0;
/* SecuritySettings
    * @class: SecuritySettings
    * @remarks: A class that contains the security settings for the application
    * 			  database: a string that represents the database name
    * 			  collection: a string that represents the collection name
    * 			  defaultRoles: an array of strings that represents the default roles
    */
class SecuritySettings {
    constructor() {
        this.database = "474";
        this.collection = "users";
        this.defaultRoles = ["user"];
    }
}
exports.SecuritySettings = SecuritySettings;
//# sourceMappingURL=security.settings.js.map