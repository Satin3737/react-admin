import React from "react";

const ConfirmModal = ({targetId, method}) => {
    return (
        <div id={targetId} container="false" data-uk-modal="true">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Saving</h2>
                <p>Did you wanna save it?</p>
                <p className="uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Cancel</button>
                    <button
                        className="uk-button uk-button-primary uk-modal-close"
                        type="button"
                        onClick={() => method()}
                    >Save</button>
                </p>
            </div>
        </div>
    )
}

export default ConfirmModal;