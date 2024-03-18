import React, { useState, useEffect, useRef } from "react";
import UserDisplay from "./UserDisplay";
import AddUserPortfolioModal from "./AddUserPortfolioModal";
import DeleteUserPortfolioModal from "./DeleteUserPortfolioModal";
import UpdateUserPortfolioModal from "./UpdateUserPortfolioModal";
import AddStockModal from "./AddStockModal";
import UpdateStockModal from "./UpdateStockModal";
import DeleteStockModal from "./DeleteStockModal";
import styles from "./Portfolio.module.css";
// import addImg from "../assets/addButton.png";
// import deleteImg from "../assets/deleteButton.png";
// import editImg from "../assets/editButton.png";
// import refreshImg from "../assets/refreshButton.png";

const PortfolioDisplay = ({ allStockData, users, handleButtonClick }) => {
    // const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(""); // id of user in userData table
    const [allPortfolios, setAllPortfolios] = useState([]);
    const [selectedUserPortfolios, setSelectedUserPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(""); //id of selected user portfolio in userPortfolioData table
    const [allUserStockData, setAllUserStockData] = useState([]);
    const [selectedPortfolioStocks, setSelectedPortfolioStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState([]);
    const [showAddUserPortfolioModal, setShowAddUserPortfolioModal] =
        useState(false);
    const [showUpdateUserPortfolioModal, setShowUpdateUserPortfolioModal] =
        useState(false);
    const [showDeleteUserPortfolioModal, setShowDeleteUserPortfolioModal] =
        useState(false);
    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
    const [showDeleteStockModal, setShowDeleteStockModal] = useState(false);

    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    // get all users from UserDisplay component through lifting state
    // const handleUsersData = (usersData) => {
    //     setUsers(usersData);
    // };

    // get all portfolio records
    // console.log(users);
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

    // get userPortfolio records based on UserId from UserPortfolioData
    const getSelectedUserPortfolios = async (selectedUser = "") => {
        // selectedUser => based on user id
        // check if the selectedUser is in usersList
        // check if the selectedUser contains any portfolio
        console.log(`Selected USER: ${selectedUser}`);
        if (selectedUser === "" || selectedUser === undefined) {
            console.log("User not selected yet!");
            return;
        }
        // const userPortFoliosData =
        //     user.fields["portfolio_name (from UserPortfolioData)"];
        // console.log(userPortFoliosData);

        const user = users.records.find((user) => user.id === selectedUser);
        console.log(allPortfolios.records[0].fields.UserData[0]);
        console.log(selectedUser);
        const userPortfolios = allPortfolios.records.filter((user) => {
            console.log(user);
            console.log(selectedUser);
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
            setSelectedUserPortfolios([]);
            return;
        }
    };

    // Get all UserStocksData
    const getAllUserStockData = async () => {
        try {
            console.log("Getting all UserStockData from airtable...");
            const res = await fetch(`${airtableUrl}UserStockData?`, {
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                },
            });

            if (res.ok) {
                const userStockData = await res.json();
                setAllUserStockData(userStockData);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // Get stocks records based on selectedPortfolio Id
    const getSelectedPortfolioStocks = async (
        selectedPortfolio = "",
        selectedUserPortfolios = []
    ) => {
        // selectedUser => based on user id
        // check if the selectedUser is in usersList
        // check if the selectedUser contains any portfolio
        console.log(JSON.stringify(selectedUserPortfolios));
        console.log(`Selected PORTFOLIO: ${selectedPortfolio}`);
        console.log(
            `check for SELECTED PORTFOLIOS: ${selectedUserPortfolios.length}`
        );

        if (selectedPortfolio === "") {
            console.log("Portfolio not selected yet!");
            if (selectedUserPortfolios.length === 0) {
                console.log("Users not selected yet");
            }
            setSelectedPortfolioStocks([]);
            return;
        }
        // const userPortFoliosData =
        //     user.fields["portfolio_name (from UserPortfolioData)"];
        // console.log(userPortFoliosData);

        const portfolio = selectedUserPortfolios.find(
            (portfolio) => portfolio.id === selectedPortfolio
        );

        console.log(portfolio);
        console.log(allUserStockData);
        const userStocks = allUserStockData.records.filter((portfolio) => {
            console.log(portfolio.fields.UserPortfolioData[0]);
            console.log(selectedPortfolio);
            return portfolio.fields.UserPortfolioData[0] === selectedPortfolio;
        });

        console.log(JSON.stringify(portfolio));
        console.log(userStocks);

        if (portfolio && userStocks.length > 0) {
            console.log("ready to update selectedportfoliostocks state");
            setSelectedPortfolioStocks(userStocks);
        } else {
            // not found
            if (!portfolio) {
                console.log("Please select a portfolio!");
            } else {
                console.log(
                    `portfolio ${portfolio.fields.portfolio_name} does not have stock!`
                );
            }
            setSelectedPortfolioStocks([]);
            return;
        }
    };

    // Event handler to handle selection change
    const handleUserSelectionChange = (event) => {
        setSelectedUser(event.target.value);
        setSelectedPortfolio("");
        // getSelectedUserPortfolios(event.target.value);
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

    const handleAddStockClick = () => {
        setShowAddStockModal(true);
    };

    const handleUpdateStockClick = (stock) => {
        setSelectedStock(stock);
        setShowUpdateStockModal(true);
    };

    const handleDeleteStockClick = (stock) => {
        setSelectedStock(stock);
        setShowDeleteStockModal(true);
    };

    const handleStockModalClose = () => {
        setShowAddStockModal(false);
        setShowUpdateStockModal(false);
        setShowDeleteStockModal(false);
    };

    useEffect(() => {
        getAllPortfoliosData();
    }, []);

    useEffect(() => {
        getAllUserStockData();
    }, []);

    useEffect(() => {
        getSelectedUserPortfolios(selectedUser);
    }, [selectedUser]);

    useEffect(() => {
        getSelectedPortfolioStocks(selectedPortfolio, selectedUserPortfolios);
    }, [selectedPortfolio, selectedUserPortfolios]);

    useEffect(() => {
        // Update selectedPortfolioStocks whenever allUserStockData changes
        if (allUserStockData && allUserStockData.records) {
            setSelectedPortfolioStocks(
                allUserStockData.records.filter((portfolio) => {
                    return (
                        portfolio.fields.UserPortfolioData[0] ===
                        selectedPortfolio
                    );
                })
            );
        }
    }, [allUserStockData]);

    // Working on stocksData
    // getting allstocksdata from higher level through propping

    // add stock
    // console.log(allStockData);
    // const listAllStocks = JSON.stringify(props.allStocksData)
    // console.log(listAllStocks)

    return (
        <div className={styles["container"]}>
            {/* <UserDisplay handleUsersData={handleUsersData} /> */}
            {/* <br />
            <h2>UserPortfolios</h2>
            {JSON.stringify(allPortfolios)}
            <br />
            <br />
            <h2>Create Portfolio</h2> */}
            <div className={styles["portfolio-container"]}>
                <div className={styles["title-container"]}>
                    <h1>Portfolio</h1>
                    <button
                        onClick={handleAddUserPortfolioClick}
                        type="button"
                        class="btn btn-secondary"
                    >
                        Create Portfolio
                    </button>
                </div>

                <div className={styles["selection-container"]}>
                    {/* <h2>selectedUser portfolio</h2>
                    {JSON.stringify(users.records)} */}
                    {/* <br /> */}
                    <select
                        className={styles["selection-subContainer"]}
                        value={selectedUser}
                        onChange={handleUserSelectionChange}
                    >
                        <option value="">Select a user...</option>
                        {users.records &&
                            users.records.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.fields.staff_name}
                                </option>
                            ))}
                    </select>
                    {/* {selectedUser} */}
                    {/* <br />
                <br /> */}
                    {/* <h2>getting selected user portfolio</h2> */}
                    {/* {JSON.stringify(selectedUserPortfolios)} */}
                    {/* <br /> */}
                    <select
                        className={styles["selection-subContainer"]}
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
                    {/* <h2>selected portfolio</h2>
                    {selectedPortfolio}
                    <br /> */}
                    {/* <br /> */}
                    {/* {selectedPortfolio && JSON.stringify(selectedPortfolio)} */}
                    {selectedPortfolio && (
                        <div
                            key={selectedPortfolio}
                            className={styles["action-buttons"]}
                        >
                            {/* <span>name ={selectedPortfolio}</span> */}
                            <button
                                type="button"
                                className={`btn btn-primary ${styles["button"]}`}
                                onClick={() =>
                                    handleUpdateUserPortfolioClick(
                                        selectedPortfolio
                                    )
                                }
                            >
                                Update
                            </button>

                            <button
                                type="button"
                                className={`btn btn-danger ${styles["button"]}`}
                                onClick={() =>
                                    handleDeleteUserPortfolioClick(
                                        selectedPortfolio
                                    )
                                }
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles["create-stock-container"]}>
                    <button
                        className={`btn btn-primary btn-sm ${styles.imageButton}`}
                        type="button"
                        onClick={handleButtonClick}
                    >
                        refresh
                    </button>
                    {selectedPortfolio && selectedPortfolioStocks && (
                        <button
                            className={`btn btn-secondary btn-sm ${styles.imageButton}`}
                            type="button"
                            onClick={handleAddStockClick}
                        >
                            Add
                        </button>
                    )}
                </div>

                <div className={styles["stock-list-container"]}>
                    <div className={styles["stock-header"]}>
                        <div>Stock Name</div>
                        <div>Units</div>
                        <div>Unit Price</div>
                        <div>Price</div>
                        <div>Market Value</div>
                        <div>Unrealised P/L</div>
                        <div>Actions</div>
                    </div>

                    {/* <h2>Selected portfolio stocks</h2> */}
                    {/* DISPLAY ALL STOCKS OF A SELECTED PORTFOLIIO, STYLING REQUIRED HERE */}
                    {/* {JSON.stringify(selectedPortfolioStocks)} */}

                    {selectedPortfolio &&
                    selectedPortfolioStocks &&
                    selectedPortfolioStocks.length > 0 ? (
                        selectedPortfolioStocks.map((stock) => (
                            <div
                                key={stock.id}
                                className={styles["stock-item"]}
                            >
                                <div>{stock.fields.stock_name}</div>
                                <div>{stock.fields.units}</div>
                                <div>{stock.fields.unit_price}</div>
                                <div>
                                    {stock.fields["price (from StockData)"]}
                                </div>
                                <div>{stock.fields.market_value}</div>
                                <div>{stock.fields.unrealised_gain_loss}</div>
                                <button
                                    className={`btn btn-primary btn-sm ${styles.stockButton}`}
                                    type="button"
                                    onClick={() =>
                                        handleUpdateStockClick(stock)
                                    }
                                >
                                    Update
                                </button>
                                <button
                                    className={`btn btn-danger btn-sm ${styles.stockButton}`}
                                    type="button"
                                    onClick={() =>
                                        handleDeleteStockClick(stock)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>You have no stocks in current portfolio!</p>
                    )}
                </div>

                <div className={styles["result-container"]}>
                    <h2 className={styles.result}>
                        Portfolio: ${" "}
                        {selectedPortfolioStocks.reduce((total, stock) => {
                            return (
                                total + parseFloat(stock.fields.market_value)
                            );
                        }, 0)}
                    </h2>
                    <h2 className={styles.result}>
                        Total Profit/Loss: ${" "}
                        {selectedPortfolioStocks.reduce((total, stock) => {
                            return (
                                total +
                                parseFloat(stock.fields.unrealised_gain_loss)
                            );
                        }, 0)}
                    </h2>
                </div>
            </div>
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
            {/* UPDATE PORTFOLIO */}
            {showUpdateUserPortfolioModal && (
                <UpdateUserPortfolioModal
                    onClose={handlePortfolioModalClose}
                    allPortfolios={allPortfolios}
                    portfolio={selectedPortfolio}
                    getAllPortfoliosData={getAllPortfoliosData}
                ></UpdateUserPortfolioModal>
            )}

            {/* ADD STOCK */}
            {showAddStockModal && (
                <AddStockModal
                    onClose={handleStockModalClose}
                    allUserStockData={allUserStockData}
                    allStockData={allStockData}
                    portfolio={selectedPortfolio}
                    getAllUserStockData={getAllUserStockData}
                ></AddStockModal>
            )}
            <br />
            {/* UPDATE STOCK */}
            {showUpdateStockModal && (
                <UpdateStockModal
                    onClose={handleStockModalClose}
                    stock={selectedStock}
                    getAllUserStockData={getAllUserStockData}
                ></UpdateStockModal>
            )}
            <br />
            {/* DELETE STOCK */}
            {showDeleteStockModal && (
                <DeleteStockModal
                    onClose={handleStockModalClose}
                    stock={selectedStock}
                    getAllUserStockData={getAllUserStockData}
                ></DeleteStockModal>
            )}
        </div>
    );
};

export default PortfolioDisplay;
