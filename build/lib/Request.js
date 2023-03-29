"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.Request = void 0;
class Request {
    constructor(request) {
        var _a;
        const protocol = request.socket.localPort == 443 ? 'https' : 'http';
        this._request = request;
        this._url = new URL(protocol + '://' + request.headers.host + request.url);
        this._query = new URLSearchParams(this._url.search);
        this._method = this._toHttpMethod(((_a = request.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'GET');
    }
    url() {
        return this._url;
    }
    method() {
        return this._method;
    }
    query() {
        return this._query;
    }
    _toHttpMethod(method) {
        switch (method) {
            case 'GET':
                return HttpMethod.GET;
            case 'POST':
                return HttpMethod.POST;
            case 'PUT':
                return HttpMethod.PUT;
            case 'DELETE':
                return HttpMethod.DELETE;
        }
        return HttpMethod.GET;
    }
}
exports.Request = Request;
var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 0] = "GET";
    HttpMethod[HttpMethod["POST"] = 1] = "POST";
    HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
    HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
