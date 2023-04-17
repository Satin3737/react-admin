import React from "react";

const Panel = () => {
    return (
        <div className="panel">
            <button className="uk-button uk-button-primary uk-margin-small-right" data-uk-toggle="target: #modal-open">
                Open
            </button>
            <button className="uk-button uk-button-primary uk-margin-small-right" data-uk-toggle="target: #modal-meta">
                Edit Meta tags
            </button>
            <button className="uk-button uk-button-primary uk-margin-small-right" data-uk-toggle="target: #modal-save">
                Save
            </button>
            <button className="uk-button uk-button-primary" data-uk-toggle="target: #modal-backup">
                Backup
            </button>
        </div>
    )
}

export default Panel;