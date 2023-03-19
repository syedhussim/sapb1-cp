import { Application } from "./lib/Application";
import { Request } from "./lib/Request";
import { Response } from "./lib/Response";
import { Client } from "./lib/sap/Client";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

const app = new Application();

app.load((req : Request, res : Response) =>{

});

app.get('/', async(req : Request, res : Response) =>{
    await res.view('/views/test.tpl');
});

app.get('/api/orders.json', async(req : Request, res : Response) =>{

    let sapClient = await Client.session("manager", "harshal", "DEV_SADP");
    let orders = await sapClient.query(
            '$crossjoin(Orders,Orders/DocumentLines)', 
            `
            $expand=Orders($select=DocEntry, DocNum),Orders/DocumentLines($select=ItemCode,LineNum,ItemDescription)
            &$filter=Orders/DocEntry eq Orders/DocumentLines/DocEntry and Orders/DocNum eq 104099`)
        .execute();

    res.json(orders);
});

app.get('/api/order/get.json', async(req : Request, res : Response) =>{
    res.json(
        { order_number : '12345', total : 23.00, address : '123456788 avenue road' }
    );
});

// app.post('/', (req : Request, res : Response) =>{
//     res.json({
//         success : 200,
//         msg : 'done'
//     });
// });

app.start({});

