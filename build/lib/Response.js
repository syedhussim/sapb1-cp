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
exports.Response = void 0;
const promises_1 = require("fs/promises");
const path = require("path");
class Response {
    constructor(response) {
        this._response = response;
        this._httpCode = 200;
        this._headers = new Map();
        this._cookies = new Map();
        this._redirectLocation = '';
        this._output = '';
        this._flushed = false;
        this._mimeTypes = new Map();
        this._mimeTypes.set('txt', 'text/plain');
        this._mimeTypes.set('html', 'text/html');
        this._mimeTypes.set('js', 'text/javascript');
        this._mimeTypes.set('css', 'text/css');
        this._mimeTypes.set('svg', 'image/svg+xml');
    }
    httpCode(code) {
        this._httpCode = code;
        return this;
    }
    cookies() {
        return this._cookies;
    }
    mimeTypes() {
        return this._mimeTypes;
    }
    contentType(type) {
        if (!this._headers.has('Content-Type')) {
            this._headers.set("Content-Type", type);
        }
        return this;
    }
    headers() {
        return this._headers;
    }
    write(data) {
        this._output = data;
        return this;
    }
    html(string, httpCode = 200) {
        if (httpCode) {
            this.httpCode(httpCode);
        }
        this.contentType('text/html').write(string).flush();
    }
    json(data, httpCode = 200) {
        if (httpCode) {
            this.httpCode(httpCode);
        }
        this.contentType('application/json').write(JSON.stringify(data)).flush();
    }
    view(file, httpCode = 200) {
        return __awaiter(this, void 0, void 0, function* () {
            if (httpCode) {
                this.httpCode(httpCode);
            }
            let data = yield (0, promises_1.readFile)(path.resolve() + file);
            this.contentType('text/html').write(data.toString()).flush();
        });
    }
    redirect(location, code = 302) {
        this._redirectLocation = location;
        this.httpCode(code);
        this.flush();
    }
    flushed() {
        return this._flushed;
    }
    flush() {
        if (this._flushed) {
            return;
        }
        let cookieHeader = '';
        // for(let [cookieName, cookie] of this._cookies){
        //     if(cookie instanceof Object){
        //         cookieHeader += `${cookieName}=${cookie.value};path=${cookie.path}; HttpOnly; SameSite=${cookie.samesite};${cookie.secure ? 'Secure' : ''};`;
        //     }else{
        //         cookieHeader += `${cookieName}=${cookie}`;
        //     }
        // }
        // if(cookieHeader){
        //     this.addHeader("Set-Cookie", cookieHeader);
        // }
        // if(this._redirectLocation){
        //     this.addHeader('Location', this._redirectLocation);
        // }
        let objHeaders = {};
        for (let [header, value] of this._headers) {
            objHeaders[header] = value;
        }
        this._response.writeHead(this._httpCode, objHeaders);
        this._response.end(this._output);
        this._flushed = true;
    }
}
exports.Response = Response;
