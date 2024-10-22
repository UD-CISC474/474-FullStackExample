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
exports.MongoDBService = exports.ObjectId = void 0;
const mongodb_1 = require("mongodb");
var mongodb_2 = require("mongodb");
Object.defineProperty(exports, "ObjectId", { enumerable: true, get: function () { return mongodb_2.ObjectId; } });
class MongoDBService {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.client = new mongodb_1.MongoClient(this.connectionString);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Connecting to MongoDB");
                yield this.client.connect();
                return true;
            }
            catch (err) {
                console.error("Error connecting to MongoDB:", err);
                return false;
            }
        });
    }
    insertOne(database, collection, document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.db(database).collection(collection).insertOne(document);
                return true;
            }
            catch (err) {
                console.error("Error inserting document into " + collection + ":", err);
                return false;
            }
        });
    }
    findOne(database, collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.db(database).collection(collection).findOne(query);
                return result;
            }
            catch (err) {
                console.error("Error finding document in " + collection + ":", err);
                return null;
            }
        });
    }
    find(database, collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.db(database).collection(collection).find(query).toArray();
                return result;
            }
            catch (err) {
                console.error("Error finding documents in " + collection + ":", err);
                return [];
            }
        });
    }
    updateOne(database, collection, query, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.db(database).collection(collection).updateOne(query, update);
                return true;
            }
            catch (err) {
                console.error("Error updating document in " + collection + ":", err);
                return false;
            }
        });
    }
    deleteOne(database, collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.db(database).collection(collection).deleteOne(query);
                return true;
            }
            catch (err) {
                console.error("Error deleting document in " + collection + ":", err);
                return false;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
            console.log("Closed connection to MongoDB");
        });
    }
    findOneAndUpdate(database, collection, query, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.db(database).collection(collection).findOneAndUpdate(query, update, {});
                if (!result) {
                    console.error("Error finding and updating document in " + collection + ": document not found");
                    return null;
                }
                return result.value;
            }
            catch (err) {
                console.error("Error finding and updating document in " + collection + ":", err);
                return null;
            }
        });
    }
}
exports.MongoDBService = MongoDBService;
//# sourceMappingURL=mongodb.service.js.map