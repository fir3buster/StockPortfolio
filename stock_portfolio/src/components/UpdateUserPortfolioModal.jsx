import React, { useState, useRef } from "react";
import ReactDom from "react-dom";
import styles from "./PortfolioModal.module.css";

const Overlay = ({
    onClose,
    allPortfolios,
    portfolio,
    getAllPortfoliosData,
}) => {
    const portfolioNameRef = useRef();
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    console.log(portfolio);
    console.log(JSON.stringify(allPortfolios));
    if (portfolio === undefined) {
        console.log("No portfolio is selected!");
        return;
    }

    const portfolioData = allPortfolios.records.find(
        (pf) => pf.id === portfolio
    );

    const staffName = portfolioData.fields["staff_name (from UserData)"][0];
    console.log(JSON.stringify(portfolioData));
    console.log(staffName);

    // updating existing portfolio
    console.log("Updating user Portfolio to AIRTABLE userPortfolioData");
    const updatePortfolio = async () => {
        try {
            const portfolioName = portfolioNameRef.current.value;

            const res = await fetch(`${airtableUrl}UserPortfolioData`, {
                method: "PATCH",
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    records: [
                        {
                            id: portfolio,
                            fields: {
                                portfolio_name: portfolioName,
                            },
                        },
                    ],
                }),
            });

            if (res.ok) {
                getAllPortfoliosData();
                onClose();
                portfolioNameRef.current.value = "";
            } else {
                throw new Error("UserPortfolioData Patch response was not OK!");
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <br />
                <br />
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">Name</div>
                    <input
                        className="col-md-7"
                        // on useRef, default value
                        defaultValue={staffName}
                        readOnly
                    />
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
                    <button onClick={updatePortfolio} className="col-md-3">
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

const UpdateUserPortfolioModal = ({
    onClose,
    allPortfolios,
    portfolio,
    getAllPortfoliosData,
}) => {
    console.log(JSON.stringify(getAllPortfoliosData));
    return (
        <div>
            {ReactDom.createPortal(
                <Overlay
                    onClose={onClose}
                    allPortfolios={allPortfolios}
                    portfolio={portfolio}
                    getAllPortfoliosData={getAllPortfoliosData}
                ></Overlay>,
                document.querySelector("#userPortfolioModal-root")
            )}
        </div>
    );
};

export default UpdateUserPortfolioModal;
