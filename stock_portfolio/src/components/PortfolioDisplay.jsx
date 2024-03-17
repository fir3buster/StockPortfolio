import React, { useState, useEffect } from "react";
import UserDisplay from "./UserDisplay";
import AddUserPortfolioModal from "./AddUserPortfolioModal";
import DeleteUserPortfolioModal from "./DeleteUserPortfolioModal";
import UpdateUserPortfolioModal from "./UpdateUserPortfolioModal";

const PortfolioDisplay = (props) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(); // id of user in userData table
    const [allPortfolios, setAllPortfolios] = useState([]);
    const [selectedUserPortfolios, setSelectedUserPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState([]);
    const [stock, setStock] = useState("");
    const [showAddUserPortfolioModal, setShowAddUserPortfolioModal] =
        useState(false);
    const [showUpdateUserPortfolioModal, setShowUpdateUserPortfolioModal] =
        useState(false);
    const [showDeleteUserPortfolioModal, setShowDeleteUserPortfolioModal] =
        useState(false);

    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    // get all users from UserDisplay component through lifting state
    const handleUsersData = (usersData) => {
        setUsers(usersData);
    };

    // get all portfolio records
    const getAllPortfoliosData = async () => {
        try {
            console.log("Getting all portfolios data from airtable...");
            const res = await fetch(`${airtableUrl}UserPortfolioData?`, {
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                },
            });

            if (res.ok) {
                const portfolioData = await res.json();
                setAllPortfolios(portfolioData);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // get userPortfolio records based on UserId from stock data
    const getSelectedUserPortfolios = async (selectedUser = null) => {
        // selectedUser => based on user id
        // check if the selectedUser is in usersList
        // check if the selectedUser contains any portfolio
        console.log(`Selected USER: ${selectedUser}`);
        if (selectedUser === null) {
            console.log("User not selected yet!");
            return;
        }
        // const userPortFoliosData =
        //     user.fields["portfolio_name (from UserPortfolioData)"];
        // console.log(userPortFoliosData);

        
        const user = users.records.find((user) => user.id === selectedUser);
        const userPortfolios = allPortfolios.records.filter((user) => {
            console.log(user.fields.UserData[0])
            console.log(selectedUser)
            return user.fields.UserData[0] === selectedUser;
        });

        console.log(JSON.stringify(user));
        console.log(userPortfolios);
        if (user && userPortfolios.length > 0) {
            setSelectedUserPortfolios(userPortfolios);
        } else {
            // not found
            if (!user) {
                console.log("Please select a user!");
            } else {
                console.log(
                    `User ${user.fields.staff_name} does not have portfolio!`
                );
            }
            return;
        }
    };

    // Event handler to handle selection change
    const handleUserSelectionChange = (event) => {
        setSelectedUser(event.target.value);
        setSelectedPortfolio([]);
        // getSelectedUserPortfolio(event.target.value);
    };

    const handleUserPortfolioSelectionChange = (event) => {
        setSelectedPortfolio(event.target.value);
    };

    // event handler button click
    const handleAddUserPortfolioClick = () => {
        setShowAddUserPortfolioModal(true);
    };

    const handleUpdateUserPortfolioClick = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setShowUpdateUserPortfolioModal(true);
    };

    const handleDeleteUserPortfolioClick = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setShowDeleteUserPortfolioModal(true);
    };

    const handlePortfolioModalClose = () => {
        setShowAddUserPortfolioModal(false);
        setShowUpdateUserPortfolioModal(false);
        setShowDeleteUserPortfolioModal(false);
    };

    useEffect(() => {
        getAllPortfoliosData();
    }, []);

    useEffect(() => {
        getSelectedUserPortfolios(selectedUser);
    }, [selectedUser]);

    return (
        <div>
            <UserDisplay handleUsersData={handleUsersData} />
            <br />
            <h2>UserPortfolios</h2>
            {JSON.stringify(allPortfolios)}
            <br />
            <br />
            <h2>Create Portfolio</h2>
            <button onClick={handleAddUserPortfolioClick}>
                Create Portfolio
            </button>
            <br />
            {/* {selectedPortfolio && JSON.stringify(selectedPortfolio)} */}
            {selectedPortfolio.length > 0 && (
                <div key={selectedPortfolio}>
                    <span>name ={selectedPortfolio}</span>
                    <button
                        onClick={() =>
                            handleDeleteUserPortfolioClick(selectedPortfolio)
                        }
                    >
                        Delete
                    </button>
                    <button
                        onClick={() =>
                            handleUpdateUserPortfolioClick(selectedPortfolio)
                        }
                    >
                        Update
                    </button>
                </div>
            )}

            <br />
            <br />

            <h2>selectedUser portfolio</h2>
            {JSON.stringify(users.records)}
            <br />
            <select value={selectedUser} onChange={handleUserSelectionChange}>
                <option value="">Select a user...</option>
                {users.records &&
                    users.records.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.fields.staff_name}
                        </option>
                    ))}
            </select>
            {selectedUser}
            <br />
            <br />
            <h2>getting selected user portfolio</h2>
            {JSON.stringify(selectedUserPortfolios)}
            <br />
            <select
                value={selectedPortfolio}
                onChange={handleUserPortfolioSelectionChange}
            >
                <option value="">Select a portfolio...</option>
                {selectedUser &&
                    selectedUserPortfolios &&
                    selectedUserPortfolios.map((portfolio) => (
                        <option key={portfolio.id} value={portfolio.id}>
                            {portfolio.fields.portfolio_name}
                        </option>
                    ))}
            </select>
            <h2>selected portfolio</h2>
            {selectedPortfolio}
            <br />

            <br />

            {/* ADD PORTFOLIO */}
            {showAddUserPortfolioModal && (
                <AddUserPortfolioModal
                    onClose={handlePortfolioModalClose}
                    users={users}
                    getAllPortfoliosData={getAllPortfoliosData}
                ></AddUserPortfolioModal>
            )}
            <br />
            {/* DELETE PORTFOLIO */}
            {showDeleteUserPortfolioModal && (
                <DeleteUserPortfolioModal
                    onClose={handlePortfolioModalClose}
                    portfolio={selectedPortfolio}
                    getAllPortfoliosData={getAllPortfoliosData}
                ></DeleteUserPortfolioModal>
            )}
            <br />
            {showUpdateUserPortfolioModal && (
                <UpdateUserPortfolioModal
                    onClose={handlePortfolioModalClose}
                    allPortfolios={allPortfolios}
                    portfolio={selectedPortfolio}
                    getAllPortfoliosData={getAllPortfoliosData}
                ></UpdateUserPortfolioModal>
            )}
        </div>
    );
};

export default PortfolioDisplay;
