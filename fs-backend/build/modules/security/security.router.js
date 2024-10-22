"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityRouter = void 0;
const express_1 = __importDefault(require("express"));
const security_controller_1 = require("./security.controller");
/* SecurityRouter
    * @class: SecurityRouter
    * @remarks: A class that contains the routes for the security module
    * 			  getRouter: a function that returns a router object
    */
class SecurityRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new security_controller_1.SecurityController();
    }
    // Creates the routes for this router and returns a populated router object
    /* getRouter(): express.Router
        @returns {express.Router}
        @remarks: creates the routes for this router
    */
    getRouter() {
        this.router.post("/login", this.controller.postLogin);
        this.router.post("/register", this.controller.postRegister);
        return this.router;
    }
}
exports.SecurityRouter = SecurityRouter;
//# sourceMappingURL=security.router.js.map