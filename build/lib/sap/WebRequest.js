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
exports.WebRequest = void 0;
class WebRequest {
    static request(options = {}, postData = '') {
        return __awaiter(this, void 0, void 0, function* () {
            let client = options.https ? require('https') : require('http');
            let response = yield new Promise((resolve, reject) => {
                const req = client.request(options, (response) => {
                    let chuncks = [];
                    response.on('data', (data) => {
                        chuncks.push(data);
                    });
                    response.on('end', () => {
                        resolve({
                            statusCode: response.statusCode,
                            headers: response.headers,
                            data: chuncks.join('')
                        });
                    });
                });
                req.on('error', function (err) {
                    reject(err);
                });
                if (postData) {
                    req.write(postData);
                }
                req.end();
            });
            return response;
        });
    }
}
exports.WebRequest = WebRequest;
