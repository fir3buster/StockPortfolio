import React, { useState, useRef } from "react";
import ReactDom from "react-dom";
import styles from "./PortfolioModal.module.css";

const Overlay = ({ onClose, stock, getAllUserStockData }) => {
    // const [selectStockOption, setSelectedStockOption] = useState("");
    // const selectedStockRef = useRef();
    // const stockNameRef = useRef();
    const stockUnitsRef = useRef();
    const stockUnitPriceRef = useRef();
    // const unrealisedGainLossRef = useRef();

    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    console.log(stock);
    console.log(JSON.stringify(stock));
    if (stock === undefined) {
        console.log("No stock is selected!");
        return;
    }

    // const stockData = allUserStockData.records.find((sd) => sd.id === stock);
    const stockName = stock.fields.stock_name;

    console.log("Update Stock to Airtable UserStockData...");
    const updateStock = async () => {
        try {
            const stockUnits = stockUnitsRef.current.value;
            const stockUnitPrice = stockUnitPriceRef.current.value;
            console.log(stockUnits, stockUnitPrice)
            console.log(stock)
            console.log(stock.fields["price (from StockData)"])
            const unrealisedGainLoss = parseFloat(
                (stock.fields["price (from StockData)"] - parseFloat(stockUnitPrice)) *
                    parseFloat(stockUnits)
            ).toFixed(2);

            console.log(typeof unrealisedGainLoss);
            console.log(unrealisedGainLoss);

            const res = await fetch(`${airtableUrl}UserStockData`, {
                method: "PATCH",
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    records: [
                        {
                            id: stock.id,
                            fields: {
                                units: parseInt(stockUnits),
                                unit_price: parseFloat(stockUnitPrice),
                                unrealised_gain_loss:
                                    parseFloat(unrealisedGainLoss),
                            },
                        },
                    ],
                }),
            });

            if (res.ok) {
                getAllUserStockData();
                onClose();
                stockUnitsRef.current.value = "";
                stockUnitPriceRef.current.value = "";
            } else {
                throw new Error("UserStockData Post response was not OK!");
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
                    <div className="col-md-3"></div>
                    <div className="col-md-3">Ticker</div>
                    <input
                        className="col-md-3"
                        defaultValue={stock.fields.stock_name}
                        readOnly
                    />
                    <div className="col-md-3"></div>
                </div>

                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-3">Units</div>
                    <input
                        ref={stockUnitsRef}
                        type="number"
                        className="col-md-3"
                        // on useRef, default value
                        defaultValue={stock.fields.units}
                    />
                    <div className="col-md-3"></div>
                </div>

                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-3">Unit Price</div>
                    <input
                        ref={stockUnitPriceRef}
                        type="number"
                        step="0.01"
                        className="col-md-3"
                        // on useRef, default value
                        defaultValue={stock.fields.unit_price}
                    />
                    <div className="col-md-3"></div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-3"></div>
                    <button onClick={updateStock} className="col-md-3">
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

const UpdateStockModal = ({ onClose, stock, getAllUserStockData }) => {
    return (
        <div>
            {ReactDom.createPortal(
                <Overlay
                    onClose={onClose}
                    // allUserStockData={allUserStockData}
                    // allStockData={allStockData}
                    stock={stock}
                    getAllUserStockData={getAllUserStockData}
                ></Overlay>,
                document.querySelector("#userPortfolioModal-root")
            )}
        </div>
    );
};

export default UpdateStockModal;
