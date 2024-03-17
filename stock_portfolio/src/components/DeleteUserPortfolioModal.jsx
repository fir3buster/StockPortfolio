import React from "react";
import ReactDOM from "react-dom";
import styles from "./UserModal.module.css";

const Overlay = ({ onClose, portfolio, getAllPortfoliosData }) => {
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    console.log("Deleting portfolio from AIRTABLE userPortfolioData");
    console.log(JSON.stringify(portfolio));
    console.log(JSON.stringify(getAllPortfoliosData));

    if (!portfolio) {
        console.log("No portfolio is selected!");
        return;
    }

    // delete existing user from airtable
    const deletePortfolio = async () => {
        console.log("Deleting...");
        try {
            const res = await fetch(
                `${airtableUrl}UserData?records[]=${portfolio}`,
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
                getAllPortfoliosData(); // Update user data after successful deletion
                onClose();
            } else {
                throw new Error("UserPortfolio Delete Response was not OK!");
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.model}>
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
                    <button onClick={deletePortfolio} className="col-md-3">
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

const DeleteUserPortfolioModal = ({
    onClose,
    portfolio,
    getAllPortfoliosData,
}) => {
    return (
        <div>
            {ReactDOM.createPortal(
                <Overlay
                    onClose={onClose}
                    portfolio={portfolio}
                    getAllPortfoliosData={getAllPortfoliosData}
                ></Overlay>,
                document.querySelector("#userPortfolioModal-root")
            )}
        </div>
    );
};

export default DeleteUserPortfolioModal;
