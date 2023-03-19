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
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let sapClient = yield Client_1.Client.session("manager", "harshal", "DEV_SADP");
        let orders = yield sapClient.query('$crossjoin(Orders,Orders/DocumentLines)', '$expand=Orders($select=DocEntry, DocNum),Orders/DocumentLines($select=ItemCode,LineNum,ItemDescription)&$filter=Orders/DocEntry eq Orders/DocumentLines/DocEntry and Orders/DocEntry ge 3 and Orders/DocumentLines/LineNum eq 0')
            .execute();
        console.log(orders);
    });
}
test();
const app = new Application_1.Application();
app.load((req, res) => {
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield res.view('/views/test.tpl');
}));
app.get('/api/orders.json', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json([
        { order_number: '12345', total: 23.00 },
        { order_number: '76544', total: 43.00 },
        { order_number: '33567', total: 93.00 }
    ]);
}));
app.get('/api/order/get.json', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ order_number: '12345', total: 23.00, address: '123456788 avenue road' });
}));
// app.post('/', (req : Request, res : Response) =>{
//     res.json({
//         success : 200,
//         msg : 'done'
//     });
// });
app.start({});
