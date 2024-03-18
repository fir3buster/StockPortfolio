import React, { useState, useRef } from "react";
import ReactDom from "react-dom";
import styles from "./PortfolioModal.module.css";

const Overlay = ({
    onClose,
    allUserStockData,
    allStockData,
    portfolio,
    getAllUserStockData,
}) => {
    const [selectStockOption, setSelectedStockOption] = useState("");
    const selectedStockRef = useRef();
    // const stockNameRef = useRef();
    const stockUnitsRef = useRef();
    const stockUnitPriceRef = useRef();
    // const unrealisedGainLossRef = useRef();
    const portfolioTotalRef = useRef();
    const totalGainLossRef = useRef();

    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;

    const addStock = async () => {
        try {
            console.log("Adding/Creating Stock...");
            const stockId = selectedStockRef.current.value;
            const stockUnits = stockUnitsRef.current.value;
            const stockUnitPrice = stockUnitPriceRef.current.value;

            const stockData = allStockData.records.find(
                (stock) => stock.id === stockId
            );
            console.log(typeof stockData);
            console.log(JSON.stringify(stockData));

            const stockName = stockData.fields.name;
            const unrealisedGainLoss = parseFloat(
                (stockData.fields.price - parseFloat(stockUnitPrice)) *
                    parseFloat(stockUnits)
            ).toFixed(2); // create a math calculation here
            // stockdata price - stock unit price * stock units

            console.log(typeof portfolio);
            console.log(JSON.stringify(portfolio));
            console.log(typeof unrealisedGainLoss);
            console.log(
                stockName,
                [stockId],
                [portfolio],
                stockUnits,
                stockUnitPrice,
                unrealisedGainLoss
            );
            if (stockData && portfolio) {
                const res = await fetch(`${airtableUrl}UserStockData`, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + airtableApiToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        records: [
                            {
                                fields: {
                                    stock_name: stockName,
                                    StockData: [stockId],
                                    UserPortfolioData: [portfolio],
                                    units: parseInt(stockUnits),
                                    unit_price: parseFloat(stockUnitPrice),
                                    unrealised_gain_loss: parseFloat(unrealisedGainLoss),
                                },
                            },
                        ],
                    }),
                });

                if (res.ok) {
                    getAllUserStockData();
                    onClose();
                    selectedStockRef.current.value = "";
                    stockUnitsRef.current.value = "";
                    stockUnitPriceRef.current.value = "";
                } else {
                    throw new Error("UserStockData Post response was not OK!");
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleChange = () => {
        setSelectedStockOption(selectedStockRef.current.value);
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <br />
                <br />
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-3">Ticker</div>
                    <select
                        ref={selectedStockRef}
                        onChange={handleChange}
                        value={selectStockOption}
                        className="col-md-3"
                    >
                        <option value="">Select a stock...</option>
                        {allStockData.records &&
                            allStockData.records.map((stock) => (
                                <option key={stock.id} value={stock.id}>
                                    {stock.fields.ticker}
                                </option>
                            ))}
                    </select>
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
                        defaultValue="100"
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
                        defaultValue="0.00"
                    />
                    <div className="col-md-3"></div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-3"></div>
                    <button onClick={addStock} className="col-md-3">
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

const AddStockModal = ({
    onClose,
    allUserStockData,
    allStockData,
    portfolio,
    getAllUserStockData,
}) => {
    return (
        <div>
            {ReactDom.createPortal(
                <Overlay
                    onClose={onClose}
                    allUserStockData={allUserStockData}
                    allStockData={allStockData}
                    portfolio={portfolio}
                    getAllUserStockData={getAllUserStockData}
                ></Overlay>,
                document.querySelector("#userPortfolioModal-root")
            )}
        </div>
    );
};

export default AddStockModal;
