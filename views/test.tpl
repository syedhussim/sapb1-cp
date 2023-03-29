<!DOCTYPE html>
<html lang="en">
    <head>        
        <title></title>        
        <meta charset="UTF-8">  
        <link rel="stylesheet" href="/base.css"/>  
        <link rel="stylesheet" href="/green.css"/>    
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
        <div class="data-row fx-jc-sb" data-doc_entry="DocEntry" on-click="viewOrder">
            <label data-name="DocNum"></label>
            <label data-name="DocTotalFc"></label>
        </div>
    </template>

    <template id="app-content-template">
        <div class="app-container">
            <div class="dy-fx wh-100-pc ml-20 mr-20 bg-1 ">
                <div id="data"></div>
            </div>
        </div>
    </template>

    <template id="order-header-template">
        <div>
            <div data-name="order_number"></div>
            <div data-name="address"></div>
            <div data-name="total"></div>
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

                let docEntry = sender.dataset.doc_entry;

                let result = await fetch('/api/order/get.json?doc_entry=' + docEntry);
                let order = await result.json();

                this.clearRender('data', 'order-header-template', order);
            }
        }

        const app = new App();

    </script>

</html>