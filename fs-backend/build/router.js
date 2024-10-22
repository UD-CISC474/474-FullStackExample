"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = void 0;
const express_1 = __importDefault(require("express"));
const security_router_1 = require("./modules/security/security.router");
const inventory_router_1 = require("./modules/inventory/inventory.router");
const order_router_1 = require("./modules/orders/order.router");
class ApiRouter {
    constructor() {
        this.router = express_1.default.Router();
    }
    // Creates the routes for this router and returns a populated router object
    getRouter() {
        this.router.use("/security", new security_router_1.SecurityRouter().getRouter());
        this.router.use("/items", new inventory_router_1.InventoryRouter().getRouter());
        this.router.use("/orders", new order_router_1.OrderRouter().getRouter());
        return this.router;
    }
}
exports.ApiRouter = ApiRouter;
//# sourceMappingURL=router.js.map