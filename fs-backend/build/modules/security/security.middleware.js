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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
const mongodb_service_1 = require("../database/mongodb.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const security_settings_1 = require("./security.settings");
/* SecurityMiddleware
 * @class: SecurityMiddleware
 * @remarks: A class that contains middleware functions for security
 * 			  validateUser: a function that validates the user
 * 			  hasRole: a function that checks if the user has a role
 */
class SecurityMiddleware {
    /* decodeToken(token: string): UserLoginModel|undefined
     * @param: {string} token:  - the token to decode
     * @returns {UserLoginModel|undefined}: the decoded token
     * @remarks Decodes the token
     * @static
     */
    static decodeToken(token) {
        if (!token) {
            return undefined;
        }
        token = token.replace("Bearer ", "");
        let payload = jsonwebtoken_1.default.verify(token, process.env.secret || "secret");
        return payload;
    }
}
exports.SecurityMiddleware = SecurityMiddleware;
_a = SecurityMiddleware;
SecurityMiddleware.mongoDBService = new mongodb_service_1.MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
SecurityMiddleware.settings = new security_settings_1.SecuritySettings();
/* validateUser(req: express.Request, res: express.Response, next: express.NextFunction): void
   @param {express.Request} req:  - the request object
   @param {express.Response} res:  - the response object
   @param {express.NextFunction} next:  - the next function in the chain
   @returns void
   @remarks 401 Unauthorized if the user is not logged in
   401 Unauthorized if the token is invalid
   401 Unauthorized if the user is not found in the database
   500 Internal Server Error if the database connection fails
   continues the chain of functions if the user is logged in
   @static
   @async
 */
SecurityMiddleware.validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            res.status(401).send({ error: "Unauthorized" });
        }
        else {
            let payload = _a.decodeToken(req.headers.authorization);
            if (!payload) {
                res.status(401).send({ error: "Unauthorized" });
                return;
            }
            let result = yield _a.mongoDBService.connect();
            if (!result) {
                res.status(500).send({ error: "Database connection failed" });
                return;
            }
            let dbUser = yield _a.mongoDBService.findOne(_a.settings.database, _a.settings.collection, { username: payload.username });
            if (!dbUser) {
                throw { error: "User not found" };
            }
            dbUser.password = "****";
            req.body.user = dbUser;
            next();
        }
    }
    catch (err) {
        console.error(err);
        res.status(401).send({ error: "Unauthorized" });
    }
    finally {
        _a.mongoDBService.close();
    }
});
/* hasRole(role: string): Function
 * @param: {string} role:  - the role to check for
 * @returns {Function}: a function that checks if the user has the role
 * @remarks Responds With: 403 Forbidden if the user does not have the role
 *               401 Unauthorized if the user is not logged in
 *			   	 Continues the chain of functions if user has the role.
 *  Should be called after validateUser in the chain.  Checks if the user has the role specified
 * @static
 * @async
 */
SecurityMiddleware.hasRole = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = req.body.user;
            if (!user.roles.includes(role)) {
                res.status(403).send({ error: "Forbidden" });
                return;
            }
            else {
                next();
            }
        }
        catch (err) {
            console.error(err);
            res.status(401).send({ error: "Unauthorized" });
        }
    });
};
//# sourceMappingURL=security.middleware.js.map