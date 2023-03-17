import { Application } from "./lib/Application";
import { Request } from "./lib/Request";
import { Response } from "./lib/Response";

const app = new Application();

app.load((req : Request, res : Response) =>{

});

app.get('/', async(req : Request, res : Response) =>{
    await res.view('/views/test.tpl');
});

app.get('/api/orders.json', async(req : Request, res : Response) =>{
    await res.json([
        { name : 'Syed' }
    ]);
});

// app.post('/', (req : Request, res : Response) =>{
//     res.json({
//         success : 200,
//         msg : 'done'
//     });
// });

app.start({});

