import axios from "axios";
import React, {useEffect, useState} from "react";
import '../helpers/iframeLoader.js';
import uuid from "react-uuid";

const Editor = () => {

    let iframe;
    let virtualDom;
    const route = './files/project/';

    const [pageList, setPageList] = useState([]);
    const [newPageName, setNewPageName] = useState('');
    const [currentPage, setCurrentPage] = useState('index.html');

    const init = (page) => {
        iframe = document.querySelector('iframe');
        open(page);
        loadPageList();
    }

    const open = (page) => {
        setCurrentPage(route + page + `?rnd=${Math.random()}`);

        axios.get(route + page)
            .then(res => parseStringToDOM(res.data))
            .then(wrapTextNodes)
            .then(dom => {
                virtualDom = dom;
                return dom;
            })
            .then(serializeDOMToString)
            .then(html => axios.post('./files/api/saveTempPage.php', {html}))
            .then(() => iframe.load(route + 'temp.html'))
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
        iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
            element.contentEditable = 'true';
            element.addEventListener('input', () => {
                onTextEdit(element);
            });
        });
    }

    const onTextEdit = (element) => {
        const id = element.getAttribute('nodeId');
        virtualDom.body.querySelector(`[nodeId="${id}"]`).innerHTML = element.innerHTML;
    }

    const loadPageList = () => {
        axios
            .get('./files/api/index.php')
            .then(res => {
                setPageList(res.data);
                console.log(res.data)
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