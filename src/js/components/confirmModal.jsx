import React from "react";

const ConfirmModal = ({targetId, method, texts}) => {
    const {title, description, button} = texts;
    
    return (
        <div id={targetId} container="false" data-uk-modal="true">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">{title}</h2>
                <p>{description}</p>
                <p className="uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Cancel</button>
                    <button
                        className="uk-button uk-button-primary uk-modal-close"
                        type="button"
                        onClick={() => method()}
                    >{button}</button>
                </p>
            </div>
        </div>
    )
}

export default ConfirmModal;