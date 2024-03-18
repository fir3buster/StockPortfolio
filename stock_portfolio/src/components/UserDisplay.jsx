import React, { useState, useRef, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";
import UpdateUserModal from "./UpdateUserModal";
import styles from "./User.module.css";

const UserDisplay = ({ handleUsersData }) => {
    const [Users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [singleUser, setSingleUser] = useState("");
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    // get all users data from airtable
    const getUserData = async () => {
        try {
            console.log("Getting all users data from airtable...");
            const res = await fetch(`${airtableUrl}UserData?`, {
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                },
            });

            if (res.ok) {
                const userData = await res.json();
                setUsers(userData);
                handleUsersData(userData);
            }
        } catch (error) {
            console.log(error);
            console.log(error.message);
        }
    };

    const handleAddUserClick = () => {
        setShowAddUserModal(true);
    };

    const handleUpdateUserClick = (user) => {
        console.log(JSON.stringify(user));
        setSelectedUser(user);
        setShowUpdateUserModal(true);
    };

    const handleDeleteUserClick = (user) => {
        console.log(JSON.stringify(user));
        setSelectedUser(user);
        setShowDeleteUserModal(true);
    };

    const handleModalClose = () => {
        setShowAddUserModal(false);
        setShowUpdateUserModal(false);
        setShowDeleteUserModal(false);
    };

    useEffect(() => {
        getUserData();
    }, []);

    // useEffect(() => {
    //     console.log(JSON.stringify(selectedUser));
    // }, [selectedUser]); // Run this effect whenever selectedUser changes

    return (
        <div className={styles["container"]}>
            <div className={styles["user-container"]}>
                <div className={styles["user-title"]}>
                    <h1>User</h1>
                    <button
                        onClick={handleAddUserClick}
                        type="button"
                        class="btn btn-secondary"
                    >
                        Create User
                    </button>
                </div>

                {/* {JSON.stringify(Users.records)} */}
                {/* {Users ? (
                <ul>
                    {Users.records &&
                        Users.records.map((user) => (
                            <li key={user.id}>
                                name = {user.fields.staff_name}
                            </li>
                        ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )} */}
                <div className={styles["user-list"]}>
                    {Users.records &&
                        Users.records.map((user) => (
                            <div key={user.id} className={styles["user-item"]}>
                                <div>{user.fields.staff_name}</div>
                                <button
                                    className={styles["update"]}
                                    onClick={() => handleUpdateUserClick(user)}
                                >
                                    Update
                                </button>
                                <button
                                    className={styles["delete"]}
                                    onClick={() => handleDeleteUserClick(user)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                </div>

                {/* ADD-USER */}
                {showAddUserModal && (
                    <AddUserModal
                        onClose={handleModalClose}
                        getUserData={getUserData}
                    ></AddUserModal>
                )}

                <br />
                {/* DELETE-USER */}
                {showDeleteUserModal && (
                    <DeleteUserModal
                        onClose={handleModalClose}
                        user={selectedUser}
                        getUserData={getUserData}
                    ></DeleteUserModal>
                )}

                <br />
                {showUpdateUserModal && (
                    <UpdateUserModal
                        onClose={handleModalClose}
                        user={selectedUser}
                        getUserData={getUserData}
                    ></UpdateUserModal>
                )}
            </div>
        </div>
    );
};

export default UserDisplay;
