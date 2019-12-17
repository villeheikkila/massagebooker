import React, { useState } from 'react';

export const Modal = ({ joinSession, description }) => {
    const [open, setOpen] = useState(false);

    const handleClose = func => {
        func();
        setOpen(false);
    };

    return (
        <>
            {!open && (
                <button className="join_button" onClick={() => setOpen(true)}>
                    Join
                </button>
            )}
            {open && (
                <div className="modal_wrapper">
                    <div>
                        <textarea
                            placeholder="Describe problem areas"
                            value={description.value}
                            onChange={description.handleFieldChange}
                            rows="3"
                        ></textarea>
                    </div>

                    <div>
                        <button onClick={() => setOpen(false)} className="modal_cancel_button">
                            Cancel
                        </button>
                        <button onClick={() => handleClose(joinSession)} className="modal_submit_button">
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
