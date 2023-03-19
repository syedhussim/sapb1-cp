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
exports.Client = void 0;
const WebRequest_1 = require("./WebRequest");
const Resource_1 = require("./Resource");
const Query_1 = require("./Query");
class Client {
    constructor(session) {
        this._session = session;
    }
    static session(user, password, company) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                https: true,
                hostname: '89.197.8.147',
                port: 50000,
                path: '/b1s/v1/Login',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                }
            };
            let response = yield WebRequest_1.WebRequest.request(options, JSON.stringify({
                UserName: user,
                Password: password,
                CompanyDB: company
            }));
            let sessionData = {
                B1SESSION: '',
                ROUTEID: ''
            };
            if (response.statusCode == 200) {
                for (let cookie of response.headers['set-cookie']) {
                    let name = cookie.substring(0, cookie.indexOf('='));
                    let value = cookie.substring(cookie.indexOf('=') + 1, cookie.length);
                    sessionData[name] = value.split(';')[0];
                }
            }
            return new Client(sessionData);
        });
    }
    query(path, option) {
        return new Query_1.Query(this._session, path, option);
    }
    resource(name) {
        return new Resource_1.Resource(this._session, name);
    }
}
exports.Client = Client;
