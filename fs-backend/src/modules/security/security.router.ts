import express from "express";
import {SecurityController} from "./security.controller";
import { SecurityMiddleware } from "./security.middleware";

/* SecurityRouter
    * @class: SecurityRouter
    * @remarks: A class that contains the routes for the security module
    * 			  getRouter: a function that returns a router object
    */
export class SecurityRouter {
    private router: express.Router = express.Router();
    private controller: SecurityController = new SecurityController();

    // Creates the routes for this router and returns a populated router object
    /* getRouter(): express.Router
        @returns {express.Router}
        @remarks: creates the routes for this router
    */
    public getRouter(): express.Router {
        this.router.post("/login", this.controller.postLogin);
        this.router.post("/register", this.controller.postRegister);
        this.router.get("/authorize",[SecurityMiddleware.validateUser], this.controller.getAuthorize);
        return this.router;
    }
}