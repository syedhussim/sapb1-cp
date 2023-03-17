"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
class Route {
    constructor(httpMethod, path, callable) {
        this._httpMethod = httpMethod;
        this._path = path;
        this._callable = callable;
    }
    method() {
        return this._httpMethod;
    }
    path() {
        return this._path;
    }
    callable() {
        return this._callable;
    }
}
exports.Route = Route;
