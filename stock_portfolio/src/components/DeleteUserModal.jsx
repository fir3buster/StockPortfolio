import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./UserModal.module.css";

const Overlay = ({ onClose, user, getUserData }) => {
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    console.log(JSON.stringify(user));
    // delete existing user from airtable
    const deleteUser = async () => {
        try {
            const res = await fetch(
                `${airtableUrl}UserData?records[]=${user.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + airtableApiToken,
                        "Content-Type": "application/json",
                    },
                    // body: `records[]=${user.id}`,
                }
            );

            if (res.ok) {
                getUserData(); // Update user data after successful deletion
                onClose();
            } else {
                throw new Error("UserData Delete Response was not OK!");
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className={styles.backdropDel}>
            <div className={styles.modalDel}>
                {/* {JSON.stringify(user.fields.staff_name)} */}
                <br />
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        Are you sure you want to delete?
                    </div>
                    <div className="col-md-4"></div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-3"></div>
                    <button onClick={deleteUser} className="col-md-3">
                        Delete
                    </button>
                    <button className="col-md-3" onClick={onClose}>
                        Cancel
                    </button>
                    <div className="col-md-3"></div>
                </div>
            </div>
        </div>
    );
};

const DeleteUserModal = ({ onClose, user, getUserData }) => {
    return (
        <div>
            {/* {JSON.stringify(user)} */}
            {ReactDOM.createPortal(
                <Overlay
                    onClose={onClose}
                    user={user}
                    getUserData={getUserData}
                ></Overlay>,
                document.querySelector("#userModal-root")
            )}
        </div>
    );
};

export default DeleteUserModal;
