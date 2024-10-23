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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityController = void 0;
const mongodb_service_1 = require("../database/mongodb.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const security_settings_1 = require("./security.settings");
/* SecurityController
    * @class: SecurityController
    * @remarks: A class that contains the controller functions for the security module
    * 			  postLogin: a function that handles the login request
    * 			  postRegister: a function that handles the register request
    * 			  getTest: a function that handles the test request
    */
class SecurityController {
    constructor() {
        this.mongoDBService = new mongodb_service_1.MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
        this.settings = new security_settings_1.SecuritySettings();
        this.getAuthorize = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            //renew the token.
            res.send({ token: this.makeToken(req.body.user) });
        });
        /* postLogin(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                    expects username and password in body of request
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the login request
            @async
        */
        this.postLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //check body for username and password
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const user = { username: req.body.username, password: req.body.password, roles: this.settings.defaultRoles };
                if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
                    res.status(400).send({ error: "Username and password are required" });
                }
                else {
                    try {
                        let result = yield this.mongoDBService.connect();
                        if (!result) {
                            res.status(500).send({ error: "Database connection failed" });
                            return;
                        }
                        let dbUser = yield this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: user.username });
                        if (!dbUser) {
                            throw { error: "User not found" };
                        }
                        bcryptjs_1.default.compare(user.password, dbUser.password, (err, result) => {
                            if (err) {
                                res.send({ error: "Password comparison failed" });
                            }
                            else if (result) {
                                dbUser.password = "****";
                                res.send({ token: this.makeToken(dbUser) });
                            }
                            else {
                                res.send({ error: "Password does not match" });
                            }
                        });
                    }
                    catch (err) {
                        console.error(err);
                        res.status(500).send(err);
                    }
                    finally {
                        this.mongoDBService.close();
                        resolve();
                    }
                }
            }));
        });
        /* postRegister(req: express.Request, res: express.Response): Promise<void>
            @param {express.Request} req: The request object
                expects username and password in body of request
            @param {express.Response} res: The response object
            @returns {Promise<void>}:
            @remarks: Handles the register request on post
            @async
        */
        this.postRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = { username: req.body.username, password: req.body.password, roles: this.settings.defaultRoles };
            if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
                res.status(400).send({ error: "Username and password are required" });
            }
            else {
                try {
                    let result = yield this.mongoDBService.connect();
                    if (!result) {
                        res.status(500).send({ error: "Database connection failed" });
                        return;
                    }
                    let dbUser = yield this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: user.username });
                    if (dbUser) {
                        throw { error: "User already exists" };
                    }
                    user.password = yield this.encryptPassword(user.password);
                    result = yield this.mongoDBService.insertOne(this.settings.database, this.settings.collection, user);
                    if (!result) {
                        throw { error: "Database insert failed" };
                    }
                    dbUser = yield this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: user.username });
                    if (!dbUser) {
                        throw { error: "Database insert failed" };
                    }
                    dbUser.password = "****";
                    res.send({ token: this.makeToken(dbUser) });
                }
                catch (err) {
                    console.error(err);
                    res.status(500).send(err);
                }
                finally {
                    this.mongoDBService.close();
                }
            }
        });
    }
    /* makeToken(user: UserLoginModel): string
        @param {UserLoginModel}: The user to encode
        @returns {string}: The token
        @remarks: Creates a token from the user
    */
    makeToken(user) {
        var token = jsonwebtoken_1.default.sign(user, process.env.secret || "secret");
        return token;
    }
    /* encryptPassword(password: string): Promise<string>
        @param {string}: password - The password to encrypt
        @returns {Promise<string>}: The encrypted password
        @remarks: Encrypts the password
        @async
    */
    encryptPassword(password) {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            let hashval = "";
            bcryptjs_1.default.genSalt(saltRounds, (err, salt) => {
                if (err)
                    throw err;
                bcryptjs_1.default.hash(password, salt, (err, hash) => {
                    if (err)
                        throw err;
                    resolve(hash);
                });
            });
        });
    }
}
exports.SecurityController = SecurityController;
//# sourceMappingURL=security.controller.js.map