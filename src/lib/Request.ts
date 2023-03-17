import { IncomingMessage } from 'http';

export class Request{

    private readonly _request : IncomingMessage;
    private readonly _url : URL;
    private readonly _method : HttpMethod;

    constructor(request : IncomingMessage){

        const protocol = request.socket.localPort == 443 ? 'https' : 'http';

        this._request = request;
        this._url = new URL(protocol + '://' + request.headers.host + request.url);
        this._method = this._toHttpMethod(request.method?.toUpperCase() || 'GET');
    }

    url(){
        return this._url;
    }

    method(){
        return this._method;
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