import { createServer } from 'http';
import { Route } from './Route';
import { Request, HttpMethod } from './Request';
import { Response } from './Response';
import { readFile } from 'fs/promises';
import path = require('path');

export class Application {

    private readonly _middleware : CallableFunction[];
    private readonly _routes : Route[];

    constructor(){
        this._middleware = [];
        this._routes = [];
    }

    load(callable : CallableFunction) : Application{
        this._middleware.push(callable);
        return this 
    }

    get(path : string, callable : CallableFunction) : Application{
        let route = new Route(HttpMethod.GET, path, callable);
        this._routes.push(route);
        return this 
    }

    post(path : string, callable : CallableFunction) : Application{
        let route = new Route(HttpMethod.POST, path, callable);
        this._routes.push(route);
        return this 
    }

    start(config : object){

        createServer(async(req, res) => {

            let request = new Request(req);
            let response = new Response(res);

            await this._tryFile(request, response);

            if(!response.flushed()){

                for(let route of this._routes){

                    if(request.url().pathname == route.path() && request.method() == route.method()){

                        let callable = route.callable();

                        switch(request.method()){
                            case HttpMethod.GET:
                                await callable(request, response);
                                break;
                            case HttpMethod.POST:
                                await callable(request, response);
                                break;
                        }
                        return;
                    }
                }

                if(!response.flushed()){
                    response.html('404 - Not found', 404);
                }
            }

        }).listen(8989);
    }

    private async _tryFile(request : Request, response : Response){
        try{

            if(request.url().pathname.lastIndexOf('.') > -1){
                let ext : string = request.url().pathname.split('.').pop() || '';

                if(ext){
                    let buffer = await readFile(path.resolve().concat('/public').concat(request.url().pathname));
                    
                    if(response.mimeTypes().has(ext)){
                        response.write(buffer)
                            .contentType(response.mimeTypes().get(ext) || '')
                            .flush();
                    }
                }
            }
        }catch(e){ 
            //console.log(e);
             }
    }
}