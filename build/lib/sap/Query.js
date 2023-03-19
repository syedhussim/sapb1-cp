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
exports.Query = void 0;
const WebRequest_1 = require("./WebRequest");
class Query {
    constructor(session, path, option) {
        this._session = session;
        this._path = path;
        this._option = option;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let cookie = '';
            for (let [name, value] of Object.entries(this._session)) {
                cookie += name + '=' + value + ';';
            }
            let options = {
                https: true,
                hostname: '89.197.8.147',
                port: 50000,
                path: '/b1s/v1/QueryService_PostQuery',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json',
                    'Cookie': cookie
                }
            };
            let response = yield WebRequest_1.WebRequest.request(options, JSON.stringify({
                QueryPath: this._path,
                QueryOption: this._option
            }));
            if (response.statusCode == 200) {
                return JSON.parse(response.data).value;
            }
        });
    }
}
exports.Query = Query;
