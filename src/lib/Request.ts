import { IncomingMessage } from 'http';

export class Request{

    private readonly _request : IncomingMessage;
    private readonly _registry : Map<string, any>;
    private readonly _url : URL;
    private readonly _method : HttpMethod;
    private readonly _query : URLSearchParams;

    constructor(request : IncomingMessage, registry : Map<string, any>){

        const protocol = request.socket.localPort == 443 ? 'https' : 'http';

        this._request = request;
        this._registry = registry;
        this._url = new URL(protocol + '://' + request.headers.host + request.url);
        this._query = new URLSearchParams(this._url.search);
        this._method = this._toHttpMethod(request.method?.toUpperCase() || 'GET');
    }

    registry() : Map<string, any>{
        return this._registry
    }

    url(){
        return this._url;
    }

    method(){
        return this._method;
    }

    query(){
        return this._query;
    }

    private _toHttpMethod(method : string){
        switch(method){
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

export enum HttpMethod{
    GET,
    POST,
    PUT,
    DELETE
}