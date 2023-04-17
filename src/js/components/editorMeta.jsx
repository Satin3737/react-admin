import React, {Component} from "react";
import Uikit from "uikit";

export default class EditorMeta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meta: {
                title: '',
                keywords: '',
                description: ''
            }
        }
    }
    
    componentDidMount = () => {
        this.getMeta(this.props.virtualDom);
    }
    
    componentDidUpdate = (prevProps) => {
        if (this.props.virtualDom !== prevProps.virtualDom) {
            this.getMeta(this.props.virtualDom);
        }
    }
    
    getMeta = (virtualDom) => {
        this.title = virtualDom.head.querySelector('title') || virtualDom.head.appendChild(virtualDom.createElement('title'));
        
        this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
        if (!this.keywords) {
            this.keywords = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            this.keywords.setAttribute('name', 'keywords');
            this.keywords.setAttribute('content', '');
        }
        
        this.description = virtualDom.head.querySelector('meta[name="description"]');
        if (!this.description) {
            this.description = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            this.description.setAttribute('name', 'description');
            this.description.setAttribute('content', '');
        }
        
        this.setState({
            meta: {
                title: this.title.innerHTML,
                keywords: this.keywords.getAttribute('content'),
                description: this.description.getAttribute('content')
            }
        });
    }
    
    applyMeta = () => {
        this.title.innerHTML = this.state.meta.title;
        this.keywords.setAttribute('content', this.state.meta.keywords);
        this.description.setAttribute('content', this.state.meta.description);
    }
    
    onValueChange = (e) => {
        const target = e.target;
        e.persist();
        if (target.getAttribute('data-title')) {
            this.setState(({meta}) => {
                const newMeta = {...meta, title: target.value}
                return {meta: newMeta}
            });
        } else if (target.getAttribute('data-keywords')) {
            this.setState(({meta}) => {
                const newMeta = {...meta, keywords: target.value}
                return {meta: newMeta}
            });
        } else if (target.getAttribute('data-description')) {
            this.setState(({meta}) => {
                const newMeta = {...meta, description: target.value}
                return {meta: newMeta}
            });
        }
    }
    
    render() {
        const {targetId} = this.props;
        const {title, keywords, description} = this.state.meta;
        return (
            <div id={targetId} container="false" data-uk-modal="true">
                <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">Edit Meta Tags</h2>
                    
                    <form>
                        <div className="uk-margin">
                            <input
                                className="uk-input"
                                type="text"
                                placeholder="Title"
                                aria-label="Title"
                                value={title}
                                data-title
                                onChange={(e) => this.onValueChange(e)}
                            />
                        </div>
                        
                        <div className="uk-margin">
                            <textarea
                                className="uk-textarea"
                                rows="5"
                                placeholder="Keywords"
                                aria-label="Keywords"
                                value={keywords}
                                data-keywords
                                onChange={(e) => this.onValueChange(e)}
                            ></textarea>
                        </div>
                        
                        <div className="uk-margin">
                            <textarea
                                className="uk-textarea"
                                rows="5"
                                placeholder="Description"
                                aria-label="Description"
                                value={description}
                                data-description
                                onChange={(e) => this.onValueChange(e)}
                            ></textarea>
                        </div>
                        
                    </form>
                    
                    <p className="uk-text-right">
                        <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Cancel</button>
                        <button
                            className="uk-button uk-button-primary uk-modal-close"
                            type="button"
                            onClick={this.applyMeta}
                        >Save</button>
                    </p>
                </div>
            </div>
        )
    }
}