"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const inventory_controller_1 = require("./inventory.controller");
const security_middleware_1 = require("../security/security.middleware");
/* InventoryRouter
    * @class: InventoryRouter
    * @remarks: A class that contains the routes for the inventory module
    * 			  getRouter: a function that returns a router object
    */
class InventoryRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new inventory_controller_1.InventoryController();
    }
    // Creates the routes for this router and returns a populated router object
    /* getRouter(): express.Router
        @returns {express.Router}
        @remarks: creates the routes for this router
    */
    getRouter() {
        this.router.get("/", [], this.controller.getInventory);
        this.router.get("/count", [], this.controller.getInventoryCount);
        this.router.get("/:id", [], this.controller.getItem);
        this.router.post("/", [security_middleware_1.SecurityMiddleware.validateUser, security_middleware_1.SecurityMiddleware.hasRole("admin")], this.controller.postAddItem);
        this.router.put("/:id", [security_middleware_1.SecurityMiddleware.validateUser, security_middleware_1.SecurityMiddleware.hasRole("admin")], this.controller.putUpdateItem);
        this.router.delete("/:id", [security_middleware_1.SecurityMiddleware.validateUser, security_middleware_1.SecurityMiddleware.hasRole("admin")], this.controller.deleteItem);
        return this.router;
    }
}
exports.InventoryRouter = InventoryRouter;
//# sourceMappingURL=inventory.router.js.map