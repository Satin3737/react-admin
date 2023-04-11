import React from "react";
import uuid from "react-uuid";

const ChooseModal = ({targetId, data, redirect}) => {
    const list = data.map(page => {
        if (page.time) {
            return (
                <li key={uuid()}>
                    <a
                        href="#"
                        className="uk-link-muted uk-modal-close"
                        onClick={(e) => redirect(e, page.file)}
                    >
                        Backup from {page.time}
                    </a>
                </li>
            );
        } else {
            return (
                <li key={uuid()}>
                    <a
                        href="#"
                        className="uk-link-muted uk-modal-close"
                        onClick={(e) => redirect(e, page)}
                    >
                        {page}
                    </a>
                </li>
            );
        }
    });

    let message;
    if (data.length < 1) {
        message = <div>Backups not found!</div>;
    }

    return (
        <div id={targetId} container="false" data-uk-modal="true">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Open</h2>
                {message}
                <ul className="uk-list-divider">
                    {list}
                </ul>
                <p className="uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                </p>
            </div>
        </div>
    )
}

export default ChooseModal;