<!DOCTYPE html>
<html lang="en">
    <head>        
        <title></title>        
        <meta charset="UTF-8">  
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/base.css"/>  
        <link rel="stylesheet" href="/purplesudo s.css"/>    
        <link rel="stylesheet" href="/style.css"/>
        <script type="text/javascript" src="/app.js"></script>
    </head>

    <body id="app"></body>

    <template id="app-bar-template">
        <div class="app-bar"></div>
    </template>

    <template id="app-panel-template">
        <div class="app-panel" id="app-panel"></div>
    </template>

    <template id="order-row-template">
        <div class="data-row pl-20 pr-20 pt-15 pb-15 fx-jc-sb" data-doc_entry="DocEntry" on-click="viewOrder">
            <div class="dy-fx fx-fd-cn">
                <label data-name="DocNum" class="fs-16 mb-5 fw-500"></label>
                <label data-name="DocDueDate" class="fs-14 fc-5"></label>
            </div>
            <div class="dy-fx fx-ai-cr">
                <label data-name="DocCurrency" class="fs-12 mr-5"></label>
                <label data-name="DocTotalFc" class="fw-500 fc-4"></label>
            </div>
        </div>
    </template>

    <template id="app-content-template">
        <div class="app-container">
            <div class="dy-fx fx-fd-cn wh-100-pc ml-20 mr-20 bg-1" id="data">
            </div>
        </div>
    </template>

    <template id="order-header-template">

        <div class="app-content-header">
            <h4 class="fw-500 fs-22" data-name="DocNum"></h4>
            <div class="dy-fx fx-ai-cr">
                <h4 class="fs-22 mr-10" data-name="DocCurrency"></h4>
                <h4 class="fw-500 fs-22 fc-4" data-name="DocTotalFc"></h4>
            </div>
        </div>

        <div class="bg-6 pg-20">
            <div class="dy-fx fx-fd-cn mb-20">
                <label class="fs-14 mb-5 fw-500">Doc Due Date</label>
                <label data-name="DocDueDate"></label>
            </div>

            <div class="dy-fx fx-fd-cn mb-20">
                <label class="fs-14 mb-5 fw-500">Delivery Address</label>
                <label data-name="Address"></label>
            </div>
        </div>

        <div id="lines" class="dy-fx fx-fd-cn wh-100-pc"></div>
    </template>

    <template id="order-line-template">
        <div class="data-row pl-20 pr-20 pt-15 pb-15 fx-jc-sb fx-ai-cr">
            <div class="dy-fx fx-fd-cn wh-100-pc">
                <div data-name="ItemCode" class="fs-16 mb-5 fw-500"></div>
                <div data-name="ItemDescription" class="fs-14 fc-5"></div>
            </div>
            <div class="dy-fx fx-ai-cr wh-150-px">
                <label class="fs-14 mr-5 fc-5">QTY</label>
                <label data-name="Quantity" class="fw-500 fc-2"></label>
            </div>
            <div class="dy-fx fx-ai-cr wh-150-px">
                <label data-name="Currency" class="fs-14 mr-5 fc-5"></label>
                <label data-name="Price" class="fw-500 fc-4"></label>
            </div>
        </div>
    </template>

    <script type="text/javascript">

        class App extends AppBase{

            async mount(){

                this.render('app', 'app-bar-template');
                this.render('app', 'app-panel-template');
                this.render('app', 'app-content-template');

                let result = await fetch('/api/orders.json');
                let orders = await result.json();

                for(let order of orders){
                    this.render('app-panel', 'order-row-template', order);
                }
            }

            async viewOrder(sender){

                sender.classList.add('data-row-selected');

                let docEntry = sender.dataset.doc_entry;

                let result = await fetch('/api/order/get.json?doc_entry=' + docEntry);
                let order = await result.json();

                this.clearRender('data', 'order-header-template', order);

                for(let line of order.Lines){
                    this.render('lines', 'order-line-template', line);
                }
            }
        }

        const app = new App();

    </script>

</html>