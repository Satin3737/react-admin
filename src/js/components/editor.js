import axios from "axios";
import React, {useEffect, useState} from "react";
import '../helpers/iframeLoader.js';
import uuid from "react-uuid";

const Editor = () => {

    let iframe;
    let virtualDom;
    const projectRoute = './files/project/';
    const apiRoute = './files/api/';

    // const [virtualDom, setVirtualDom] = useState(null);
    const [pageList, setPageList] = useState([]);
    const [newPageName, setNewPageName] = useState('');
    const [currentPage, setCurrentPage] = useState('index.html');

    const init = (page) => {
        console.log('init');
        iframe = document.querySelector('iframe');
        open(page);
        loadPageList();
    }

    const open = (page) => {
        console.log('open');
        setCurrentPage(projectRoute + page);

        axios.get(projectRoute + page + `?rnd=${Math.random()}`)
            .then(res => parseStringToDOM(res.data))
            .then(wrapTextNodes)
            .then(dom => {
                virtualDom = dom;
                console.log(virtualDom)
                return dom;
            })
            .then(serializeDOMToString)
            .then(html => axios.post(apiRoute + 'saveTempPage.php', {html}))
            .then(() => iframe.load(projectRoute + 'temp.html'))
            .then(() => enableEditing());
    }

    const parseStringToDOM = (str) => {
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    const wrapTextNodes = (dom) => {
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

    const serializeDOMToString = (dom) => {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    const enableEditing = () => {
        console.log(virtualDom)
        iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
            element.contentEditable = 'true';
            element.addEventListener('input', () => {
                console.log(element)
                onTextEdit(element);
            });
        });
        console.log('edit')
    }

    const onTextEdit = (element) => {
        console.log(virtualDom)
        console.log('input')
        const id = element.getAttribute('nodeId');
        virtualDom.body.querySelector(`[nodeId="${id}"]`).innerHTML = element.innerHTML;
    }

    const save = () => {
        console.log('save');
        console.log(virtualDom)
        const newDom = virtualDom.cloneNode(virtualDom);
        unwrapTextNodes(newDom);
        const html = serializeDOMToString(newDom);
        console.log(html)
        axios.post(apiRoute + 'savePage.php', {
           pageName: currentPage,
           html: html
        });
    }

    const unwrapTextNodes = (dom) => {
        dom.body.querySelectorAll('text-editor').forEach(element => {
           element.parentNode.replaceChild(element.firstChild, element);
        });
    }

    const loadPageList = () => {
        console.log('load');
        axios
            .get(apiRoute +'index.php')
            .then(res => {
                setPageList(res.data);
            });
    }

    // const createNewPage = () => {
    //     if (newPageName === '') {
    //         return;
    //     }
    //     axios
    //         .post('./files/api/createNewPage.php', {
    //             'name': newPageName
    //         })
    //         .then(loadPageList)
    //         .catch(() => alert('Page already exist!'));
    // }
    //
    // const deletePage = (page) => {
    //     axios
    //         .post('./files/api/deletePage.php', {
    //             'name': page
    //         })
    //         .then(loadPageList)
    //         .catch(() => alert('Page not exist!'));
    // }

    useEffect(() => {
        init(currentPage);
    }, []);

    // const pages = pageList.map(page => {
    //     return (
    //        <h1 key={uuid()}>
    //            {page}
    //            <button onClick={() => deletePage(page)}>(X)</button>
    //        </h1>
    //     )
    // });

    return (
        <>
            <button
                onClick={() => save()}
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
            <iframe src={currentPage} frameBorder="0"></iframe>

            {/*<label>*/}
            {/*    <input onInput={(e) => setNewPageName(e.target.value)} type="text"/>*/}
            {/*</label>*/}
            {/*<button onClick={createNewPage}>*/}
            {/*    Create page*/}
            {/*</button>*/}
            {/*{pages}*/}
        </>
    );

}

export default Editor;