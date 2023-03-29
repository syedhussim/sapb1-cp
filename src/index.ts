import { Application } from "./lib/Application";
import { Request } from "./lib/Request";
import { Response } from "./lib/Response";
import { Client } from "./lib/sap/Client";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

const app = new Application();

app.load((req : Request, res : Response) =>{

});

app.get('/', async(req : Request, res : Response) => {
    await res.view('/views/test.tpl');
});

app.get('/api/orders.json', async(req : Request, res : Response) => {

    try{
        let sapClient = await Client.session("manager", "harshal", "DEV_SADP");

        let orders = await sapClient.resource('Orders')
            .select('DocEntry,DocNum,DocCurrency,DocTotalFc,Address,NumAtCard')
            .orderBy('CreationDate', 'desc')
            .list();

        res.json(orders);
    }catch(e){
        console.log(e);
    }

});

app.get('/api/order/get.json', async(req : Request, res : Response) => {


    if(req.query().has('doc_entry')){

        let docEntry = req.query().get('doc_entry');

        let sapClient = await Client.session("manager", "harshal", "DEV_SADP");
        let orders = await sapClient.query(
            '$crossjoin(Orders,Orders/DocumentLines)', `$expand=Orders($select=DocEntry, DocNum),Orders/DocumentLines($select=ItemCode,LineNum,ItemDescription)
            &$filter=Orders/DocEntry eq Orders/DocumentLines/DocEntry 
            and Orders/DocEntry eq ${docEntry}`)
            .execute();
            console.log(orders);
        res.json(orders);
    }
});

// app.post('/', (req : Request, res : Response) =>{
//     res.json({
//         success : 200,
//         msg : 'done'
//     });
// });

app.start({});

