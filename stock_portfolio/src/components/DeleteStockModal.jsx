import React from 'react';
import ReactDOM from "react-dom";
import styles from "./PortfolioModal.module.css";


const Overlay = ({ onClose, stock, getAllUserStockData }) => {
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    console.log(JSON.stringify(stock));
    // delete existing stock from airtable
    const deleteStock = async () => {
        try {
            const res = await fetch(
                `${airtableUrl}UserStockData?records[]=${stock.id}`,
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
                getAllUserStockData(); // Update user data after successful deletion
                onClose();
            } else {
                throw new Error("UserData Delete Response was not OK!");
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
                    <button onClick={deleteStock} className="col-md-3">
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

const DeleteStockModal = ({ onClose, stock, getAllUserStockData }) => {
    return (
        <div>
            {/* {JSON.stringify(user)} */}
            {ReactDOM.createPortal(
                <Overlay
                    onClose={onClose}
                    stock={stock}
                    getAllUserStockData={getAllUserStockData}
                ></Overlay>,
                document.querySelector("#userPortfolioModal-root")
            )}
        </div>
    );
};

export default DeleteStockModal;