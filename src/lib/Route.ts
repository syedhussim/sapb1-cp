import { HttpMethod } from './Request';

export class Route{

    private _httpMethod : HttpMethod;
    private _path : string;
    private _callable : CallableFunction;

    constructor(httpMethod : HttpMethod, path : string, callable : CallableFunction){
        this._httpMethod = httpMethod;
        this._path = path;
        this._callable = callable;
    }

    method() : HttpMethod{
        return this._httpMethod;
    }

    path() : string{
        return this._path;
    }

    callable() : CallableFunction{
        return this._callable;
    }
}