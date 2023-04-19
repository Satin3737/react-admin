export default class DomHelper {
    
    static parseStringToDOM = (str) => {
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }
    
    static wrapTextNodes = (dom) => {
        const body = dom.body;
        let textNodes = [];
        
        function findAllTextNodes(element) {
            element.childNodes.forEach(node => {
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) {
                    textNodes.push(node);
                } else {
                    findAllTextNodes(node);
                }
            })
        }
        
        findAllTextNodes(body);
        
        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute('nodeId', i);
        });
        
        return dom;
    }
    
    static serializeDOMToString = (dom) => {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }
    
    static unwrapTextNodes = (dom) => {
        dom.body.querySelectorAll('text-editor').forEach(element => {
            element.parentNode.replaceChild(element.firstChild, element);
        });
    }
    
    static wrapImages = (dom) => {
        dom.body.querySelectorAll('img').forEach((img, i) => {
            img.setAttribute('editable-img-id', i);
        });
        return dom;
    }
    
    static unwrapImages = (dom) => {
        dom.body.querySelectorAll('[editable-img-id]').forEach(img => {
            img.removeAttribute('editable-img-id');
        });
    }
}