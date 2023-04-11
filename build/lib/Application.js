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
exports.Application = void 0;
const http_1 = require("http");
const Route_1 = require("./Route");
const Request_1 = require("./Request");
const Response_1 = require("./Response");
const promises_1 = require("fs/promises");
const path = require("path");
class Application {
    constructor() {
        this._registry = new Map();
        this._routes = [];
    }
    load(callable) {
        callable(this._registry);
        return this;
    }
    get(path, callable) {
        let route = new Route_1.Route(Request_1.HttpMethod.GET, path, callable);
        this._routes.push(route);
        return this;
    }
    post(path, callable) {
        let route = new Route_1.Route(Request_1.HttpMethod.POST, path, callable);
        this._routes.push(route);
        return this;
    }
    start(config) {
        (0, http_1.createServer)((req, res) => __awaiter(this, void 0, void 0, function* () {
            let request = new Request_1.Request(req, this._registry);
            let response = new Response_1.Response(res);
            yield this._tryFile(request, response);
            if (!response.flushed()) {
                for (let route of this._routes) {
                    if (request.url().pathname == route.path() && request.method() == route.method()) {
                        let callable = route.callable();
                        switch (request.method()) {
                            case Request_1.HttpMethod.GET:
                                yield callable(request, response);
                                break;
                            case Request_1.HttpMethod.POST:
                                yield callable(request, response);
                                break;
                        }
                        return;
                    }
                }
                if (!response.flushed()) {
                    response.html('404 - Not found', 404);
                }
            }
        })).listen(8989);
    }
    _tryFile(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (request.url().pathname.lastIndexOf('.') > -1) {
                    let ext = request.url().pathname.split('.').pop() || '';
                    if (ext) {
                        let buffer = yield (0, promises_1.readFile)(path.resolve().concat('/public').concat(request.url().pathname));
                        if (response.mimeTypes().has(ext)) {
                            response.write(buffer)
                                .contentType(response.mimeTypes().get(ext) || '')
                                .flush();
                        }
                    }
                }
            }
            catch (e) {
                //console.log(e);
            }
        });
    }
}
exports.Application = Application;
