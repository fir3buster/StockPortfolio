import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./UserModal.module.css";

const Overlay = ({ onClose, getUserData }) => {
    const staffNameRef = useRef();
    const staffRoleRef = useRef();
    const staffIdRef = useRef();
    const emailAddRef = useRef();
    const phoneNoRef = useRef();
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    // add new user into the airtable
    const addUser = async () => {
        try {
            const staffName = staffNameRef.current.value;
            const staffRole = staffRoleRef.current.value;
            const staffId = staffIdRef.current.value;
            const emailAdd = emailAddRef.current.value;
            const phoneNo = phoneNoRef.current.value;

            const res = await fetch(`${airtableUrl}UserData`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    records: [
                        {
                            fields: {
                                staff_name: staffName,
                                role: staffRole,
                                staff_id: staffId,
                                email_address: emailAdd,
                                phone_no: phoneNo,
                            },
                        },
                    ],
                }),
            });

            if (res.ok) {
                getUserData();
                onClose();
                staffNameRef.current.value = "";
                staffRoleRef.current.value = "";
                staffIdRef.current.value = "";
                emailAddRef.current.value = "";
                phoneNoRef.current.value = "";
            } else {
                throw new Error("UserData Post Response was not OK!");
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        // <div>
        //     <h2>Add New User</h2>
        //     {JSON.stringify(Users)}
        //     <input type="text" ref={staffNameRef} placeholder="name"></input>
        //     <input type="text" ref={staffRoleRef} placeholder="role"></input>
        //     <input type="text" ref={staffIdRef} placeholder="id"></input>
        //     <input type="text" ref={emailAddRef} placeholder="email address"></input>
        //     <input type="text" ref={phoneNoRef} placeholder="phone number"></input>
        // </div>

        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <br />
                <br />
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Name</div>
                    <input
                        ref={staffNameRef}
                        type="text"
                        className="col-md-7"
                        // on useRef, default value
                        defaultValue="Name"
                    />
                    <div className="col-md-1"></div>
                </div>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Role</div>
                    <input
                        ref={staffRoleRef}
                        type="text"
                        className="col-md-7"
                        // on useRef, default value
                        defaultValue="Role"
                    />
                    <div className="col-md-1"></div>
                </div>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Staff ID</div>
                    <input
                        ref={staffIdRef}
                        type="text"
                        className="col-md-7"
                        // on useRef, default value
                        defaultValue="ID"
                    />
                    <div className="col-md-1"></div>
                </div>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Email Address</div>
                    <input
                        ref={emailAddRef}
                        type="text"
                        className="col-md-7"
                        // on useRef, default value
                        defaultValue="Email"
                    />
                    <div className="col-md-1"></div>
                </div>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Phone No</div>
                    <input
                        ref={phoneNoRef}
                        type="text"
                        className="col-md-7"
                        // on useRef, default value
                        defaultValue="Phone"
                    />
                    <div className="col-md-1"></div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-3"></div>
                    <button onClick={addUser} className="col-md-3">
                        Create
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

const AddUserModal = ({ onClose, getUserData }) => {
    return (
        <div>
            {ReactDOM.createPortal(
                <Overlay onClose={onClose} getUserData={getUserData}></Overlay>,
                document.querySelector("#userModal-root")
            )}
        </div>
    );
};
export default AddUserModal;
