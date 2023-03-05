import axios from "axios";
import React, {useEffect, useState} from "react";
import uuid from "react-uuid";

const Editor = () => {

    const [pageList, setPageList] = useState([]);
    const [newPageName, setNewPageName] = useState('');

    const loadPageList = () => {
        axios
            .get('./files/api')
            .then(res => {
                setPageList(res.data);
            });
    }

    const createNewPage = () => {
        if (newPageName === '') {
            return;
        }
        axios
            .post('./files/api/createNewPage.php', {
                'name': newPageName
            })
            .then(loadPageList)
            .catch(() => alert('Page already exist!'));
    }

    const deletePage = (page) => {
        axios
            .post('./files/api/deletePage.php', {
                'name': page
            })
            .then(loadPageList)
            .catch(() => alert('Page not exist!'));
    }

    useEffect(() => {
        loadPageList();
    }, []);

    const pages = pageList.map(page => {
        return (
           <h1 key={uuid()}>
               {page}
               <button onClick={() => deletePage(page)}>(X)</button>
           </h1>
        )
    });

    return (
        <>
            <label>
                <input onInput={(e) => setNewPageName(e.target.value)} type="text"/>
            </label>
            <button onClick={createNewPage}>
                Create page
            </button>
            {pages}
        </>
    );

}

export default Editor;