import { WebRequest } from "./WebRequest";

export class Query{

    private readonly _session : any;
    private readonly _path : string;
    private readonly _option : string;

    constructor(session : any, path : string, option : string){
        this._session = session;
        this._path = path;
        this._option = option;
    }

    async execute(){

        let cookie : string = '';

        for(let [name, value] of Object.entries(this._session)){
            cookie += name + '=' + value + ';'
        }

        let options = {
            https : true,
            hostname : '89.197.8.147',
            port : 50000,
            path : '/b1s/v1/QueryService_PostQuery',
            method : 'POST',
            headers: { 
                'User-Agent': 'Mozilla/5.0', 
                'Content-Type' : 'application/json',
                'Cookie' : cookie
            }
        };
        
        let response : any = await WebRequest.request(options, JSON.stringify({
            QueryPath : this._path,
            QueryOption : this._option
        }));

        if(response.statusCode == 200){
            return JSON.parse(response.data).value
        }
    }
}