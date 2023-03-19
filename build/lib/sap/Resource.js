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
exports.Resource = void 0;
const WebRequest_1 = require("./WebRequest");
class Resource {
    constructor(session, name) {
        this._session = session;
        this._name = name;
        this._query = [];
    }
    select(fields) {
        this._query.push('$select=' + encodeURIComponent(fields));
        return this;
    }
    limit(top, skip) {
        this._query.push('&$top=' + top);
        this._query.push('&$skip=' + skip);
        return this;
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            let cookie = '';
            for (let [name, value] of Object.entries(this._session)) {
                cookie += name + '=' + value + ';';
            }
            let query = '';
            for (let item of this._query) {
                query += item;
            }
            let options = {
                https: true,
                hostname: '89.197.8.147',
                port: 50000,
                path: '/b1s/v1/' + this._name + '?' + query,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json',
                    'Cookie': cookie
                }
            };
            let response = yield WebRequest_1.WebRequest.request(options);
            if (response.statusCode == 200) {
                return JSON.parse(response.data).value;
            }
        });
    }
}
exports.Resource = Resource;
