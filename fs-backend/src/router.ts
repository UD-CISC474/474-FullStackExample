import express from "express";
import {SecurityRouter} from "./modules/security/security.router";
import { InventoryRouter } from "./modules/inventory/inventory.router";
import { OrderRouter } from "./modules/orders/order.router";

export class ApiRouter {
    private router: express.Router = express.Router();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.use("/security", new SecurityRouter().getRouter());
        this.router.use("/items",new InventoryRouter().getRouter());
        this.router.use("/orders",new OrderRouter().getRouter());
        return this.router;
    }
}