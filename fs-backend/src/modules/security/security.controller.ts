import express from "express";
import { UserLoginModel } from "./security.models";
import { MongoDBService } from "../database/mongodb.service";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SecuritySettings } from "./security.settings";

/* SecurityController
    * @class: SecurityController
    * @remarks: A class that contains the controller functions for the security module
    * 			  postLogin: a function that handles the login request
    * 			  postRegister: a function that handles the register request
    * 			  getTest: a function that handles the test request
    */
export class SecurityController {

    private mongoDBService: MongoDBService = new MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
    private settings:SecuritySettings=new SecuritySettings();

    /* makeToken(user: UserLoginModel): string
        @param {UserLoginModel}: The user to encode
        @returns {string}: The token
        @remarks: Creates a token from the user
    */
    private makeToken(user: UserLoginModel): string {

        var token = jwt.sign(user, process.env.secret || "secret");
        return token;
    }

    /* encryptPassword(password: string): Promise<string>
        @param {string}: password - The password to encrypt
        @returns {Promise<string>}: The encrypted password
        @remarks: Encrypts the password
        @async
    */
    private encryptPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            let hashval: string = "";
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    resolve(hash);
                });
            });
        });
    }

    
    /* postLogin(req: express.Request, res: express.Response): Promise<void>
        @param {express.Request} req: The request object
                expects username and password in body of request
        @param {express.Response} res: The response object
        @returns {Promise<void>}:
        @remarks: Handles the login request
        @async
    */
    public postLogin = async (req: express.Request, res: express.Response): Promise<void> => {
        //check body for username and password
        return new Promise(async (resolve, reject) => {
            const user: UserLoginModel = { username: req.body.username, password: req.body.password ,roles:this.settings.defaultRoles};
            if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
                res.status(400).send({ error: "Username and password are required" });
            } else {
                try {
                    let result = await this.mongoDBService.connect();
                    if (!result) {
                        res.status(500).send({ error: "Database connection failed" });
                        return;
                    }
                    let dbUser: UserLoginModel | null = await this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: user.username });
                    if (!dbUser) {
                        throw { error: "User not found" };
                    }
                    bcrypt.compare(user.password, dbUser.password, (err, result) => {
                        if (err) {
                            res.send({ error: "Password comparison failed" });
                        } else if (result) {
                            dbUser.password = "****";
                            res.send({ token: this.makeToken(dbUser) });
                        } else {
                            res.send({ error: "Password does not match" });
                        }
                    });
                } catch (err) {
                    console.error(err);
                    res.status(500).send(err);
                } finally {
                    this.mongoDBService.close();
                    resolve();
                }
            }
        });
    }

    /* postRegister(req: express.Request, res: express.Response): Promise<void>
        @param {express.Request} req: The request object
            expects username and password in body of request
        @param {express.Response} res: The response object
        @returns {Promise<void>}:
        @remarks: Handles the register request on post
        @async
    */
    public postRegister = async (req: express.Request, res: express.Response): Promise<void> => {
        const user: UserLoginModel = { username: req.body.username, password: req.body.password,roles:this.settings.defaultRoles };
        if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
            res.status(400).send({ error: "Username and password are required" });
        } else {
            try {
                let result = await this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let dbUser: UserLoginModel | null = await this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: user.username });
                if (dbUser) {
                    throw { error: "User already exists" };
                }
                user.password = await this.encryptPassword(user.password);
                result = await this.mongoDBService.insertOne(this.settings.database, this.settings.collection, user);
                if (!result) {
                    throw { error: "Database insert failed" };
                }
                dbUser = await this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: user.username });
                if (!dbUser) {
                    throw { error: "Database insert failed" };
                }
                dbUser.password = "****";
                res.send({ token: this.makeToken(dbUser) });
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            } finally {
                this.mongoDBService.close();
            }
        }
    }

}