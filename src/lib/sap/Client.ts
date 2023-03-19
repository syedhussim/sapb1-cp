import { WebRequest } from "./WebRequest";
import { Resource } from "./Resource";
import { Query } from "./Query";

export class Client{

    private readonly _session : any;

    constructor(session : any){
        this._session = session;
    }

    static async session(user : string, password : string, company : string) : Promise<Client>{

        let options = {
            https : true,
            hostname : '89.197.8.147',
            port : 50000,
            path : '/b1s/v1/Login',
            method : 'POST',
            headers: { 
                'User-Agent': 'Mozilla/5.0', 
                'Content-Type' : 'application/json'
            }
        };

        let response : any = await WebRequest.request(options, JSON.stringify({
            UserName : user,
            Password : password,
            CompanyDB : company
        }));

        let sessionData : any = {
            B1SESSION : '',
            ROUTEID : ''
        };

        if(response.statusCode == 200){
            for(let cookie of response.headers['set-cookie']){
                let name = cookie.substring(0,cookie.indexOf('='));
                let value = cookie.substring(cookie.indexOf('=')+1, cookie.length);

                sessionData[name] = value.split(';')[0];
            }
        }

        return new Client(sessionData);
    }

    query(path : string, option : string){
        return new Query(this._session, path, option);
    }

    resource(name : string){
        return new Resource(this._session, name);
    }
}