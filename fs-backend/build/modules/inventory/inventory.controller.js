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
exports.InventoryController = void 0;
const mongodb_service_1 = require("../database/mongodb.service");
const inventory_settings_1 = require("./inventory.settings");
/* InventoryController
    * @class: InventoryController
    * @remarks: A class that contains the controller functions for the inventory module
    * 			  getInventory: a function that handles the get inventory request
    * 			  getItem: a function that handles the get item request
    */
class InventoryController {
    constructor() {
        this.mongoDBService = new mongodb_service_1.MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
        this.settings = new inventory_settings_1.InventorySettings();
        /* getInventory(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the get inventory request
            @async
        */
        this.getInventory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let items = yield this.mongoDBService.find(this.settings.database, this.settings.collection, {});
                res.send(items);
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* getItem(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                expects the partnumber of the item to be in the params array of the request object as id
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the get item request
            @async
        */
        this.getItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let items = yield this.mongoDBService.findOne(this.settings.database, this.settings.collection, { partno: req.params.id });
                if (!items) {
                    res.send(404).send({ error: "Item not found" });
                    return;
                }
                res.send(items);
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* postAddItem(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                expects the id of the item to be in the params array of the request object
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the add item request
            @async
        */
        this.postAddItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let item = {
                    name: req.body.name,
                    description: req.body.description,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    partno: req.body.partno
                };
                const success = yield this.mongoDBService.insertOne(this.settings.database, this.settings.collection, item);
                if (success)
                    res.send({ success: true });
                else
                    res.status(500).send({ error: "Failed to add item" });
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* putUpdateItem(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
            expects the partno of the item to be in the params array of the request object as id
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the update item request
            @async
        */
        this.putUpdateItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let item = {
                    name: req.body.name,
                    description: req.body.description,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    partno: req.body.partno
                };
                let command = { $set: item };
                const success = yield this.mongoDBService.updateOne(this.settings.database, this.settings.collection, { partno: req.params.id }, command);
                if (success)
                    res.send({ success: true });
                else
                    res.status(500).send({ error: "Failed to update item" });
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
        });
        /* deleteItem(req: express.Request, res: express.Response): Promise<void>
                @param {express.Request} req: The request object
                expects the partno of the item to be in the params array of the request object as id
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the delete item request and archives the item
            @async
        */
        this.deleteItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                const item = yield this.mongoDBService.findOne(this.settings.database, this.settings.collection, { partno: req.params.id });
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
                success = yield this.mongoDBService.deleteOne(this.settings.database, this.settings.collection, { partno: req.params.id });
                if (!success) {
                    res.status(500).send({ error: "Failed to delete item" });
                    return;
                }
            }
            catch (error) {
                res.status(500).send({ error: error });
            }
            res.send({ success: true });
        });
    }
}
exports.InventoryController = InventoryController;
//# sourceMappingURL=inventory.controller.js.map