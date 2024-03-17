import React, { useState, useEffect } from "react";
import UserDisplay from "./UserDisplay";

const PortfolioDisplay = (props) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(); // id of user in userData table
    const [allPortfolios, setAllPortfolios] = useState([]);
    const [selectedUserPortfolios, setSelectedUserPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState([]);
    const [stock, setStock] = useState("");
    const [showAddPortfolioModel, setShowPortfolioModal] = useState(false);
    const [showUpdatePortfolioModel, setShowUpdatePortfolioModel] =
        useState(false);
    const [showDeletePortfolioMode, setShowDeletePortfolioModel] =
        useState(false);

    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    // get all users from UserDisplay component through lifting state
    const handleUsersData = (usersData) => {
        setUsers(usersData);
    };

    // get all portfolio records
    const getAllPortfolios = async () => {
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
        console.log(selectedUser);
        if (selectedUser === null) {
            console.log("User not selected yet!");
            return;
        }
        // const userPortFoliosData =
        //     user.fields["portfolio_name (from UserPortfolioData)"];
        // console.log(userPortFoliosData);

        const user = users.records.find((user) => user.id === selectedUser);
        const userPortfolios = allPortfolios.records.filter(
            (user) => user.fields.UserData[0] === selectedUser
        );

        // console.log(JSON.stringify(userPortfolios));
        if (user && userPortfolios.length > 0) {
            setSelectedUserPortfolios(userPortfolios);
        } else {
            // not found
            console.log(`User ${user.fields.staff_name} does not have portfolio!`);
            return;
        }
    };

    // Event handler to handle selection change
    const handleUserSelectionChange = (event) => {
        setSelectedUser(event.target.value);
        // getSelectedUserPortfolio(event.target.value);
    };

    const handleUserPortfolioSelectionChange = (event) => {
        setSelectedPortfolio(event.target.value);
    };

    useEffect(() => {
        getAllPortfolios();
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
            <select value={selectedPortfolio} onChange={handleUserPortfolioSelectionChange}>
                <option value="">Select a portfolio...</option>
                {selectedUserPortfolios &&
                    selectedUserPortfolios.map((portfolio) => (
                        <option key={portfolio.id} value={portfolio.id}>
                            {portfolio.fields.portfolio_name}
                        </option>
                    ))}
            </select>
            <h2>selected portfolio</h2>
            {selectedPortfolio}
            <br />
        </div>
    );
};

export default PortfolioDisplay;
