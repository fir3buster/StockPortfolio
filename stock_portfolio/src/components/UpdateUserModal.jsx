import React, { useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./UserModal.module.css";

const Overlay = ({ onClose, user, getUserData }) => {
    const staffNameRef = useRef();
    const staffRoleRef = useRef();
    const staffIdRef = useRef();
    const emailAddRef = useRef();
    const phoneNoRef = useRef();

    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    console.log(JSON.stringify(user));
    // update existing user from airtable
    console.log("Updating user information to AIRTABLE userData");
    const updateUser = async () => {
        try {
            const staffName = staffNameRef.current.value;
            const staffRole = staffRoleRef.current.value;
            const staffId = staffIdRef.current.value;
            const emailAdd = emailAddRef.current.value;
            const phoneNo = phoneNoRef.current.value;
            const res = await fetch(`${airtableUrl}UserData`, {
                method: "PATCH",
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    records: [
                        {
                            id: user.id,
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
                throw new Error("UserData Put Response was not OK!");
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
                        defaultValue={user.fields.staff_name}
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
                        defaultValue={user.fields.role}
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
                        defaultValue={user.fields.staff_id}
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
                        defaultValue={user.fields.email_address}
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
                        defaultValue={user.fields.phone_no}
                    />
                    <div className="col-md-1"></div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-3"></div>
                    <button onClick={updateUser} className="col-md-3">
                        Update
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

const UpdateUserModal = ({ onClose, user, getUserData }) => {
    return (
        <div>
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

export default UpdateUserModal;
