import { Application } from "./lib/Application";
import { Request } from "./lib/Request";
import { Response } from "./lib/Response";
import { Client } from "./lib/sap/Client";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

const app = new Application();

app.load(async(registry : Map<string, any>) => {
    registry.set('sapClient', await Client.session("manager", "harshal", "SADP"));
});

app.get('/', async(req : Request, res : Response) => {
    await res.view('/views/index.tpl');
});

app.get('/api/orders.json', async(req : Request, res : Response) => {

    try{

        let sapClient = req.registry().get('sapClient');

        let orders = await sapClient.resource('Orders')
            .select('DocEntry,DocNum,DocCurrency,DocTotalFc,Address,DocDueDate')
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

        let sapClient = req.registry().get('sapClient');

        let rows = await sapClient.query(
            '$crossjoin(Orders,Orders/DocumentLines)', `$expand=Orders($select=DocEntry,DocNum,DocDueDate,DocCurrency,DocTotalFc,Address,NumAtCard),Orders/DocumentLines($select=ItemCode,ItemDescription,Currency,Price,Quantity)
            &$filter=Orders/DocEntry eq Orders/DocumentLines/DocEntry 
            and Orders/DocEntry eq ${docEntry}`)
            .execute();

        let order : any = {
            Lines : []
        };

        for(let row of rows){
            order = Object.assign(order, row.Orders);
            order.Lines.push(row['Orders/DocumentLines']);
        }

        res.json(order);
    }
});

app.start({});

