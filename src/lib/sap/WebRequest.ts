export class WebRequest{

    static async request(options : any = {}, postData : string = ''){
       
        let client = options.https ? require('https') : require('http');

        let response = await new Promise((resolve, reject) => {
            
            const req = client.request(options, (response : any) => {

                let chuncks : string[] = [];

                response.on('data', (data : string) => {
                    chuncks.push(data);
                });

                response.on('end', () => {
                    resolve({ 
                        statusCode: response.statusCode, 
                        headers : response.headers, 
                        data : chuncks.join('')
                    });
                });
            });

            req.on('error', function(err : Error){
                reject(err);
            });

            if(postData){
                req.write(postData);
            }
            
            req.end();
        });

        return response;
    }
}