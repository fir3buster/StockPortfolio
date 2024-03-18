import React, {useState, useRef} from "react";
import ReactDom from "react-dom";
import styles from "./PortfolioModal.module.css";

const Overlay = ({ onClose, users, getAllPortfoliosData }) => {
    const [selectUserOption, setSelectedUserOption] = useState("");
    const selectedUserRef = useRef();
    const portfolioNameRef = useRef();
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    const addPortfolio = async () => {
        try {
            console.log("Adding/Creating Portfolio...");
            const userId = selectedUserRef.current.value;
            const userData = users.records.find((user) => user.id === userId);
            const portfolioName = portfolioNameRef.current.value;
            console.log(typeof userData)
            console.log(JSON.stringify(userData));

            if (userData) {
                const res = await fetch(`${airtableUrl}UserPortfolioData`, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + airtableApiToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        records: [
                            {
                                fields: {
                                    portfolio_name: portfolioName,
                                    UserData: [userId],
                                },
                            },
                        ],
                    }),
                });

                if (res.ok) {
                    getAllPortfoliosData();
                    onClose();
                    selectedUserRef.current.value = "";
                    portfolioNameRef.current.value = "";
                } else {
                    throw new Error(
                        "UserPortfolioData Post response was not OK!"
                    );
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleChange = () => {
        setSelectedUserOption(selectedUserRef.current.value);
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <br />
                <br />
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Name</div>
                    <select
                        ref={selectedUserRef}
                        onChange={handleChange}
                        value={selectUserOption}
                        className="col-md-7"
                    >
                        <option value="">Select a user...</option>
                        {users.records &&
                            users.records.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.fields.staff_name}
                                </option>
                            ))}
                    </select>
                    <div className="col-md-1"></div>
                </div>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Name of Portfolio</div>
                    <input
                        ref={portfolioNameRef}
                        type="text"
                        className="col-md-7"
                        // on useRef, default value
                        defaultValue="Name your portfolio"
                    />
                    <div className="col-md-1"></div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-3"></div>
                    <button onClick={addPortfolio} className="col-md-3">
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
const AddUserPortfolioModal = ({ onClose, users, getAllPortfoliosData }) => {
    return (
        <div>
            {ReactDom.createPortal(
                <Overlay
                    onClose={onClose}
                    users={users}
                    getAllPortfoliosData={getAllPortfoliosData}
                ></Overlay>,
                document.querySelector("#userPortfolioModal-root")
            )}
        </div>
    );
};

export default AddUserPortfolioModal;
