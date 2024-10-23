import express from "express";
import { InventoryController } from "./inventory.controller";
import { SecurityMiddleware } from "../security/security.middleware";


/* InventoryRouter
	* @class: InventoryRouter
	* @remarks: A class that contains the routes for the inventory module
	* 			  getRouter: a function that returns a router object
	*/
export class InventoryRouter {
    private router: express.Router = express.Router();
    private controller: InventoryController = new InventoryController();

    // Creates the routes for this router and returns a populated router object
    /* getRouter(): express.Router
        @returns {express.Router}
        @remarks: creates the routes for this router
    */
    public getRouter(): express.Router {
        this.router.get("/", [], this.controller.getInventory);
		this.router.get("/:id", [], this.controller.getItem);
		this.router.post("/", [SecurityMiddleware.validateUser,SecurityMiddleware.hasRole("admin")], this.controller.postAddItem);
		this.router.put("/:id", [SecurityMiddleware.validateUser,SecurityMiddleware.hasRole("admin")], this.controller.putUpdateItem);
		this.router.delete("/:id", [SecurityMiddleware.validateUser,SecurityMiddleware.hasRole("admin")], this.controller.deleteItem);
        return this.router;
    }
}