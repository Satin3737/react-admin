import axios from "axios";
import React, {Component} from "react";
import Uikit from "uikit";
import '../helpers/iframeLoader.js';
import DomHelper from "../helpers/domHelper.js";
import EditorText from "./editorText.jsx";
import Spinner from "./spinner.jsx";
import ConfirmModal from "./confirmModal.jsx";
import ChooseModal from "./chooseModal.jsx";
import Panel from "./panel.jsx";
import EditorMeta from "./editorMeta.jsx";
import EditorImages from "./editorImages.jsx";
import Helper from "../helpers/helper.js";
import Login from "./login.jsx";

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';
        this.state = {
            pageList: [],
            backupsList: [],
            newPageName: '',
            loading: true,
            auth: false,
            loginError: '',
        }
        this.route = {
            projectRoute: './project/',
            apiRoute: './api/',
            backupsRoute: './backups/'
        }
    }

    componentDidMount = () => {
        this.checkAuth();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (this.state.auth !== prevState.auth) {
            this.init(null, this.currentPage);
        }
    }
    
    checkAuth = () => {
        axios
            .get(this.route.apiRoute + 'checkAuth.php')
            .then(res => {
                this.setState({
                    auth: res.data.auth
                });
            });
        
    }
    
    login = (pass) => {
        if (pass.length >= 6) {
            axios
                .post(this.route.apiRoute + 'login.php', {'password': pass})
                .then(res => {
                    this.setState({
                        auth: res.data.auth,
                        loginError: res.data.auth ? '' : 'Wrong password'
                    });
                });
        } else {
            this.setState({
                loginError: 'Password must be at least 6 characters'
            });
        }
    }
    
    logout = () => {
        axios
            .get(this.route.apiRoute + 'logout.php')
            .then(() => {
                window.location.replace('/');
            });
    }

    init = (e, page) => {
        if (e) {
            e.preventDefault();
        }
        if (this.state.auth) {
            this.isLoading();
            this.iframe = document.querySelector('iframe');
            this.open(page, this.isLoaded);
            this.loadPageList();
            this.loadBackupsList();
        }
    }

    open = (page, cb) => {
        this.currentPage = page;

        axios
            .get(this.route.projectRoute + page + `?rnd=${Math.random()}`)
            .then(res => DomHelper.parseStringToDOM(res.data))
            .then(DomHelper.wrapTextNodes)
            .then(DomHelper.wrapImages)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DomHelper.serializeDOMToString)
            .then(html => axios.post(this.route.apiRoute + 'saveTempPage.php', {html}))
            .then(() => this.iframe.load(this.route.projectRoute + 'someTempPage.html'))
            .then(() => axios.post(this.route.apiRoute + 'deleteTempPage.php'))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(cb);

        this.loadBackupsList();
    }
    
    enableEditing = () => {
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
            const id = element.getAttribute('nodeId');
            const virtualElement = this.virtualDom.body.querySelector(`[nodeId="${id}"]`);
            new EditorText(element, virtualElement);
        });
        
        this.iframe.contentDocument.body.querySelectorAll('[editable-img-id]').forEach(element => {
            const id = element.getAttribute('editable-img-id');
            const virtualElement = this.virtualDom.body.querySelector(`[editable-img-id="${id}"]`);
            new EditorImages(element, virtualElement, this.isLoading, this.isLoaded, this.showNotifications);
        });
    }
    
    injectStyles = () => {
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML = `
            text-editor:hover,
            text-editor:focus,
            [editable-img-id]:hover,
            [editable-img-id]:focus {
                outline: 2px solid orange;
                outline-offset: 4px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    }

    save = async () => {
        this.isLoading();
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DomHelper.unwrapTextNodes(newDom);
        DomHelper.unwrapImages(newDom);
        const html = DomHelper.serializeDOMToString(newDom);
        await axios
            .post(this.route.apiRoute + 'savePage.php', {pageName: this.currentPage, html})
            .then(() => Helper.showNotifications('Saved', 'success'))
            .catch(() => Helper.showNotifications('Saving error', 'danger'))
            .finally(this.isLoaded);

        this.loadBackupsList();
    }
    
    loadPageList = () => {
        axios
            .get(this.route.apiRoute +'pageList.php')
            .then(res => this.setState({pageList: res.data}));
    }

    loadBackupsList = () => {
        axios
            .get(this.route.backupsRoute + 'backups.json')
            .then(res => this.setState({backupsList: res.data.filter(backup => backup.page === this.currentPage)}))
            .catch(() => console.log('no backups'));
    }

    restoreBackup = (e, backup) => {
        if (e) {
            e.preventDefault();
        }
        Uikit.modal.confirm('Do you really want to restore this page from chosen backup?')
            .then(() => {
                this.isLoading();
                return axios
                    .post(this.route.apiRoute + 'restoreBackup.php', {'page': this.currentPage, 'file': backup});
            })
            .then(() => {
               this.open(this.currentPage, this.isLoaded);
            });
    }

    isLoading = () => {
        this.setState({
           loading: true
        });
    }

    isLoaded = () => {
        this.setState({
            loading: false
        });
    }
    
    render() {
        const {loading, pageList, backupsList, auth, loginError} = this.state;
        let spinner;
        loading ? spinner = <Spinner active/> : spinner = <Spinner/>;
        
        if (!auth) {
            return <Login login={this.login} loginError={loginError}/>;
        }
    
        return (
            <>
                {spinner}
                <Panel/>
                <iframe src="" frameBorder="0"></iframe>
                <input id="img-upload" type="file" accept="image/*" style={{display: 'none'}}/>
                <ChooseModal targetId={'modal-open'} data={pageList} redirect={this.init}/>
                <ChooseModal targetId={'modal-backup'} data={backupsList} redirect={this.restoreBackup}/>
                <ConfirmModal
                    targetId={'modal-save'}
                    method={this.save}
                    texts={{
                        title: 'Saving',
                        description: 'Did you wanna save it?',
                        button: 'Save'
                    }}
                />
                <ConfirmModal
                    targetId={'modal-logout'}
                    method={this.logout}
                    texts={{
                        title: 'Logout',
                        description: 'Did you wanna logout?',
                        button: 'Logout'
                    }}
                />
                {this.virtualDom ? <EditorMeta targetId={'modal-meta'} virtualDom={this.virtualDom}/> : null}
            </>
        );
    }
}
