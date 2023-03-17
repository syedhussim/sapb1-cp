import { ServerResponse } from 'http';
import { readFile } from 'fs/promises';
import path = require('path');

export class Response{

    private readonly _response : ServerResponse;
    private _httpCode : number;
    private _headers : Map<string, string>;
    private _cookies : Map<string, string>;
    private _mimeTypes : Map<string, string>;
    private _redirectLocation : string;
    private _output : string;
    private _flushed : boolean;

    constructor(response : ServerResponse){
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

    httpCode(code : number){
        this._httpCode = code;
        return this;
    }

    cookies(){
        return this._cookies;
    }

    mimeTypes(){
        return this._mimeTypes;
    }

    contentType(type : string){
        if(!this._headers.has('Content-Type')){
            this._headers.set("Content-Type", type);
        }
        return this;
    }

    headers(){
        return this._headers;
    }

    write(data : any){
        this._output = data;
        return this;
    }

    html(string : string, httpCode : number = 200){
        if(httpCode){
            this.httpCode(httpCode);
        }
        this.contentType('text/html').write(string).flush();
    }

    json(data : object, httpCode : number = 200){
        if(httpCode){
            this.httpCode(httpCode);
        }
        this.contentType('application/json').write(JSON.stringify(data)).flush();
    }

    async view(file : string, httpCode : number = 200){
        if(httpCode){
            this.httpCode(httpCode);
        }
        let data = await readFile(path.resolve() + file);
        this.contentType('text/html').write(data.toString()).flush();
    }

    redirect(location : string, code = 302){
        this._redirectLocation = location;
        this.httpCode(code);
        this.flush();
    }

    flushed(){
        return this._flushed;
    }

    flush(){

        if(this._flushed){
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

        let objHeaders : any = {};

        for(let [header, value] of this._headers){
            objHeaders[header] = value;
        }

        this._response.writeHead(this._httpCode, objHeaders);
        this._response.end(this._output);
        this._flushed = true;
    }
}