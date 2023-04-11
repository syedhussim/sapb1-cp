"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./lib/Application");
const Client_1 = require("./lib/sap/Client");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
const app = new Application_1.Application();
app.load((registry) => __awaiter(void 0, void 0, void 0, function* () {
    registry.set('sapClient', yield Client_1.Client.session("manager", "harshal", "SADP"));
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield res.view('/views/index.tpl');
}));
app.get('/api/orders.json', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sapClient = req.registry().get('sapClient');
        let orders = yield sapClient.resource('Orders')
            .select('DocEntry,DocNum,DocCurrency,DocTotalFc,Address,DocDueDate')
            .orderBy('CreationDate', 'desc')
            .list();
        res.json(orders);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get('/api/order/get.json', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query().has('doc_entry')) {
        let docEntry = req.query().get('doc_entry');
        let sapClient = req.registry().get('sapClient');
        let rows = yield sapClient.query('$crossjoin(Orders,Orders/DocumentLines)', `$expand=Orders($select=DocEntry,DocNum,DocDueDate,DocCurrency,DocTotalFc,Address,NumAtCard),Orders/DocumentLines($select=ItemCode,ItemDescription,Currency,Price,Quantity)
            &$filter=Orders/DocEntry eq Orders/DocumentLines/DocEntry 
            and Orders/DocEntry eq ${docEntry}`)
            .execute();
        let order = {
            Lines: []
        };
        for (let row of rows) {
            order = Object.assign(order, row.Orders);
            order.Lines.push(row['Orders/DocumentLines']);
        }
        res.json(order);
    }
}));
app.start({});
