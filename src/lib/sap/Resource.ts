import { WebRequest } from "./WebRequest";

export class Resource{

    private readonly _session : any;
    private readonly _name : string;
    private _query : string[];

    constructor(session : any, name : string){
        this._session = session;
        this._name = name;
        this._query = [];
    }

    select(fields : string) : Resource{
        this._query.push('$select=' + encodeURIComponent(fields));
        return this;
    }

    limit(top : number, skip : number) : Resource{
        this._query.push('&$top=' + top);
        this._query.push('&$skip=' + skip);
        return this;
    }

    async list(){

        let cookie : string = '';

        for(let [name, value] of Object.entries(this._session)){
            cookie += name + '=' + value + ';'
        }

        let query = '';

        for(let item of this._query){
            query += item;
        }

        let options = {
            https : true,
            hostname : '89.197.8.147',
            port : 50000,
            path : '/b1s/v1/' + this._name + '?' + query,
            method : 'GET',
            headers: { 
                'User-Agent': 'Mozilla/5.0', 
                'Content-Type' : 'application/json',
                'Cookie' : cookie
            }
        };
        
        let response : any = await WebRequest.request(options);

        if(response.statusCode == 200){
            return JSON.parse(response.data).value;
        }
    }
}