class AppBase{

    constructor(){
        this.mount();
    }

    async mount(){}

    clearRender(host, templateId, data = {}, callback = {}){
        document.getElementById(host).replaceChildren();
        this.render(host, templateId, data, callback);
    }

    render(host, templateId, data = {}, callback = {}){

        let template = document.getElementById(templateId);
        let clone = template.content.cloneNode(true);

        if(callback.loaded){
            callback.loaded(clone);
        }

        let nodeList = clone.querySelectorAll('*');

        for(let node of nodeList){
            let attributes = node.attributes;
       
            for(let attribute of attributes){

                let val = attribute.nodeValue;

                switch(attribute.nodeName){
                    case 'data-src':
                        node.src = data[attribute.nodeValue] || val;
                        break;
                    case 'data-name':
                        node.innerHTML = data[attribute.nodeValue] || val;
                        break;
                    case 'id': 
                        node.setAttribute('id', data[attribute.nodeValue] || val);
                        break;
                    case 'value':
                        node.value = data[attribute.nodeValue] || val;
                        break;
                    default:
                        if(attribute.nodeName.substring(0,5) == 'data-'){
                            attribute.nodeValue = data[attribute.nodeValue];
                        }else if (attribute.nodeName.substring(0,3) == 'on-'){

                            let en = attribute.nodeName.substring(attribute.nodeName.indexOf('-')+1);
                            let fn = this[attribute.nodeValue];
                            let that = this;
                            node.addEventListener(en, function(ev){
                                fn.call(that, node, ev);
                            });

                            node.removeAttribute(attribute.nodeName);
                        }
                    
                }
            }
        }

        let hostElement = document.getElementById(host);
        hostElement.appendChild(clone);

        if(callback.mounted){
            callback.mounted(hostElement, clone);
        }
    }

    on(eventType, selector, fn){
        if(selector.substring(0,1) == '#'){ 
            let e = document.querySelector(selector);
            if(e){
                e.addEventListener(eventType, function(ev) { fn(e, ev); });
            }
        }else{
            let nl = document.querySelectorAll(selector);
            for(let e of nl){
                e.addEventListener(eventType, function(ev) { fn(e, ev); });
            }
        }
    }
}