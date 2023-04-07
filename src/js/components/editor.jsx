import axios from "axios";
import React, {Component} from "react";
import '../helpers/iframeLoader.js';
import DomHelper from "../helpers/domHelper.js";
import EditorText from "./editorText.js";
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
            .then(res => DomHelper.parseStringToDOM(res.data))
            .then(DomHelper.wrapTextNodes)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DomHelper.serializeDOMToString)
            .then(html => axios.post(this.route.apiRoute + 'saveTempPage.php', {html}))
            .then(() => this.iframe.load(this.route.projectRoute + 'temp.html'))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles());
    }
    
    enableEditing = () => {
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
            const id = element.getAttribute('nodeId');
            const virtualElement = this.virtualDom.body.querySelector(`[nodeId="${id}"]`);
            new EditorText(element, virtualElement);
        });
    }
    
    injectStyles() {
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML = `
            text-editor:hover, text-editor:focus {
                outline: 2px solid orange;
                outline-offset: 4px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    }

    save = () => {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DomHelper.unwrapTextNodes(newDom);
        const html = DomHelper.serializeDOMToString(newDom);
        axios
            .post(this.route.apiRoute + 'savePage.php', {pageName: this.currentPage, html});
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
                    Save
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