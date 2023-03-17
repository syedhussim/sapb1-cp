<!DOCTYPE html><html lang="en">    <head>        <title></title>        <meta charset="UTF-8">        
<link rel="stylesheet" href="/style.css"/></head>

<body>

    <script type="text/javascript">

        async function load(){
            let result = await fetch('/api/orders.json');
            console.log(await result.json());
        }

        load();
    </script>
</body>

</html>