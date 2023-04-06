import axios from "axios";
import React, {Component} from "react";
import '../helpers/iframeLoader.js';
import uuid from "react-uuid";

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';
        this.state = {
            pageList: [],
            newPageName: ''
        }
        this.route = {
            projectRoute: './project/',
            apiRoute: './api/'
        }
        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init = (page) => {
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }

    open = (page) => {
        this.currentPage = page;

        axios
            .get(this.route.projectRoute + page + `?rnd=${Math.random()}`)
            .then(res => this.parseStringToDOM(res.data))
            .then(this.wrapTextNodes)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(this.serializeDOMToString)
            .then(html => axios.post(this.route.apiRoute + 'saveTempPage.php', {html}))
            .then(() => this.iframe.load(this.route.projectRoute + 'temp.html'))
            .then(() => this.enableEditing());
    }

    parseStringToDOM = (str) => {
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    wrapTextNodes = (dom) => {
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

    serializeDOMToString = (dom) => {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    enableEditing = () => {
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
            element.contentEditable = 'true';
            element.addEventListener('input', () => {
                this.onTextEdit(element);
            });
        });
    }

    onTextEdit = (element) => {
        const id = element.getAttribute('nodeId');
        this.virtualDom.body.querySelector(`[nodeId="${id}"]`).innerHTML = element.innerHTML;
    }

    save = () => {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        this.unwrapTextNodes(newDom);
        const html = this.serializeDOMToString(newDom);
        axios
            .post(this.route.apiRoute + 'savePage.php', {pageName: this.currentPage, html});
    }

    unwrapTextNodes = (dom) => {
        dom.body.querySelectorAll('text-editor').forEach(element => {
           element.parentNode.replaceChild(element.firstChild, element);
        });
    }


    loadPageList = () => {
        axios
            .get(this.route.apiRoute +'index.php')
            .then(res => this.setState({pageList: res.data}));
    }

    createNewPage() {
        axios
            .post(this.route.apiRoute + 'createNewPage.php', {"name": this.state.newPageName})
            .then(this.loadPageList())
            .catch(() => alert('Page dont exist!'));
    }

    deletePage(page) {
        axios
            .post(this.route.apiRoute + 'deletePage.php', {"name": page})
            .then(this.loadPageList())
            .catch(() => alert('Page dont exist!'));
    }

    render() {

        // const pages = pageList.map(page => {
        //     return (
        //        <h1 key={uuid()}>
        //            {page}
        //            <button onClick={() => this.deletePage(page)}>(X)</button>
        //        </h1>
        //     )
        // });

        return (
            <>
                <button
                    onClick={() => this.save()}
                    style={{
                        position: "absolute",
                        zIndex: 1000,
                        background: 'white',
                        padding: '8px',
                        border: 'none',
                        color: '#232323'
                    }}
                >
                    Click
                </button>
                <iframe src={this.currentPage} frameBorder="0"></iframe>

                {/*<label>*/}
                {/*    <input onInput={(e) => this.setNewPageName(e.target.value)} type="text"/>*/}
                {/*</label>*/}
                {/*<button onClick={this.createNewPage}>*/}
                {/*    Create page*/}
                {/*</button>*/}
                {/*{pages}*/}
            </>
        );
    }
}