
import express from 'express';
import { UserLoginModel } from './security.models';
import { MongoDBService } from '../database/mongodb.service';
import jwt from 'jsonwebtoken';
import { SecuritySettings } from './security.settings';

/* SecurityMiddleware
 * @class: SecurityMiddleware
 * @remarks: A class that contains middleware functions for security
 * 			  validateUser: a function that validates the user
 * 			  hasRole: a function that checks if the user has a role
 */
export class SecurityMiddleware{
	private static mongoDBService: MongoDBService = new MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
	private static settings=new SecuritySettings();

	/* decodeToken(token: string): UserLoginModel|undefined
	 * @param: {string} token:  - the token to decode
	 * @returns {UserLoginModel|undefined}: the decoded token
	 * @remarks Decodes the token
	 * @static
	 */
	private static decodeToken(token: string): UserLoginModel|undefined {
        if (!token) {
            return undefined;
        }
        token = token.replace("Bearer ", "");
        let payload = jwt.verify(token, process.env.secret || "secret");
        return payload as UserLoginModel;
    }


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
	public static validateUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        try {
            if (!req.headers.authorization) {
                res.status(401).send({ error: "Unauthorized" });
            }else{
                let payload=this.decodeToken(req.headers.authorization);
                if (!payload) {
                    res.status(401).send({ error: "Unauthorized" });
                    return;
                }
                let result = await this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let dbUser: UserLoginModel | null = await this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: payload.username });
                if (!dbUser) {
                    throw { error: "User not found" };
                }
                dbUser.password = "****";
                req.body.user = dbUser;
                next();
            }
        } catch (err) {
            console.error(err);
            res.status(401).send({ error: "Unauthorized" });
        } finally {
            this.mongoDBService.close();
        }
    }

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
	public static hasRole = (role: string) => {
		return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
			try {
				let user: UserLoginModel = req.body.user;
				if (!user.roles.includes(role)) {
					res.status(403).send({ error: "Forbidden" });
					return;
				} else {
					next();
				}
			} catch (err) {
				console.error(err);
				res.status(401).send({ error: "Unauthorized" });
			}
		}
	}
}