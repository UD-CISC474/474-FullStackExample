"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const mongodb_service_1 = require("../database/mongodb.service");
const order_settings_1 = require("./order.settings");
/* InventoryController
    * @class: InventoryController
    * @remarks: A class that contains the controller functions for the inventory module
    * 			  getInventory: a function that handles the get inventory request
    * 			  getItem: a function that handles the get item request
    */
class OrderController {
    constructor() {
        this.mongoDBService = new mongodb_service_1.MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
        this.settings = new order_settings_1.OrderSettings();
        /* generateOrderNumber():string
            @returns {string}: A string that represents the next order number
            @remarks: Generates the next order number
            @throws: {Error}: Throws an error if the order number cannot be generated
        */
        this.generateOrderNumber = () => __awaiter(this, void 0, void 0, function* () {
            //.findOneAndUpdate({_id: ObjectId('5ed7f23789bcd51e9c6a82e0')}, {$inc: {nextTicket: 1}}, {returnOriginal: false})
            //see if orderNumber collection exists and if not seed it
            const result = yield this.mongoDBService.connect();
            if (!result) {
                throw ("Database connection failed");
            }
            let collection = yield this.mongoDBService.find(this.settings.database, this.settings.orderNumberCollection, {});
            if (collection.length === 0) {
                yield this.mongoDBService.insertOne(this.settings.database, this.settings.orderNumberCollection, { nextOrder: 1000 });
            }
            //get the last order number
            let ordernumber = yield this.mongoDBService.findOneAndUpdate(this.settings.database, this.settings.collection, {}, { $inc: { nextTicket: 1 } });
            if (!ordernumber) {
                throw ("Failed to generate order number");
            }
            return (ordernumber.nextOrder + 1).toString();
        });
        /* getAllOrders(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the get orders request
            @async
        */
        this.getAllOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let orders = this.mongoDBService.find(this.settings.database, this.settings.collection, {});
                res.send(orders);
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* getOrders(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the get orders request
            @async
        */
        this.getOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let orders = this.mongoDBService.find(this.settings.database, this.settings.collection, { user: req.body.user._id });
                res.send(orders);
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* getOrder(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                expects the order number of the order to be in the params array of the request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the get order request
            @async
        */
        this.getOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let items = this.mongoDBService.findOne(this.settings.database, this.settings.collection, { OrderNumber: req.params.orderno, user: req.body.user._id });
                res.send(items);
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* postAddOrder(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                expects the order to be in the body of the request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the add order request
            @async
        */
        this.postAddOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let order = {
                    orderNumber: yield this.generateOrderNumber(),
                    orderDate: new Date(),
                    billingAddress: req.body.BillingAddress,
                    shippingAddress: req.body.ShippingAddress,
                    email: req.body.user.email,
                    lineItems: req.body.LineItems,
                    user: req.body.user._id
                };
                const success = yield this.mongoDBService.insertOne(this.settings.database, this.settings.collection, order);
                if (success)
                    res.send({ success: true });
                else
                    res.status(500).send({ error: "Failed to add order" });
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* putUpdateOrder(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                expects the order to be in the body of the request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the update order request
            @async
        */
        this.putUpdateOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let order = {
                    orderNumber: req.body.OrderNumber,
                    orderDate: req.body.OrderDate,
                    billingAddress: req.body.BillingAddress,
                    shippingAddress: req.body.ShippingAddress,
                    email: req.body.user.email,
                    lineItems: req.body.LineItems,
                    user: req.body.user._id
                };
                const success = yield this.mongoDBService.updateOne(this.settings.database, this.settings.collection, { OrderNumber: req.params.orderno }, order);
                if (success)
                    res.send({ success: true });
                else
                    res.status(500).send({ error: "Failed to update order" });
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* deleteOrder(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                expects the order number of the order to be in the params array of the request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the delete order request
            @async
        */
        this.deleteOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                const item = yield this.mongoDBService.findOne(this.settings.database, this.settings.collection, { _id: req.params.id });
                if (!item) {
                    res.status(404).send({ error: "Item not found" });
                    return;
                }
                item._id = undefined;
                let success = yield this.mongoDBService.insertOne(this.settings.database, this.settings.archiveCollection, item);
                if (!success) {
                    console.log("Failed to archive item");
                    return;
                }
                success = yield this.mongoDBService.deleteOne(this.settings.database, this.settings.collection, { _id: req.params.id });
                if (!success) {
                    res.status(500).send({ error: "Failed to delete item" });
                    return;
                }
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map