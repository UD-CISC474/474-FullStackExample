"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const security_middleware_1 = require("../security/security.middleware");
/* OrderRouter
    * @class: OrderRouter
    * @remarks: A class that contains the routes for the order module
    * 			  getRouter: a function that returns a router object
    */
class OrderRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new order_controller_1.OrderController;
    }
    // Creates the routes for this router and returns a populated router object
    /* getRouter(): express.Router
        @returns {express.Router}
        @remarks: creates the routes for this router
    */
    getRouter() {
        this.router.get("/all", [security_middleware_1.SecurityMiddleware.validateUser], this.controller.getAllOrders);
        this.router.get("/user", [security_middleware_1.SecurityMiddleware.validateUser], this.controller.getOrders);
        this.router.get("/user/:orderno", [security_middleware_1.SecurityMiddleware.validateUser], this.controller.getOrder);
        this.router.post("/", [security_middleware_1.SecurityMiddleware.validateUser], this.controller.postAddOrder);
        this.router.put("/:orderno", [security_middleware_1.SecurityMiddleware.validateUser, security_middleware_1.SecurityMiddleware.hasRole("admin")], this.controller.putUpdateOrder);
        this.router.delete("/:orderno", [security_middleware_1.SecurityMiddleware.validateUser, security_middleware_1.SecurityMiddleware.hasRole("admin")], this.controller.deleteOrder);
        return this.router;
    }
}
exports.OrderRouter = OrderRouter;
//# sourceMappingURL=order.router.js.map