import React, { useState, useEffect } from "react";
import StockPortfolio from "./StockPortfolio";

const StockData = () => {
    const [stockRawData, setStockRawData] = useState([]);
    const [allStockData, setAllStockData] = useState();
    const apiToken = import.meta.env.VITE_STOCK_DATA_API_TOKEN;
    const stockRawDataUrl = import.meta.env.VITE_STOCK_DATA_URL;
    const airtableApiToken = import.meta.env.VITE_AIRTABLE_API_TOKEN;
    const airtableUrl = import.meta.env.VITE_AIRTABLE_URL;
    // const tickers = ["AAPL", "TSLA", "MSFT"];
    const tickers = ["AAPL"];

    // `https://api.stockdata.org/v1/data/quote?symbols=AAPL,TSLA,MSFT&api_token=${apiToken}`;

    // getting stockRawData from stockData.org API
    const getStockRawData = async (ticker) => {
        try {
            console.log(`getting Data from ${ticker} STOCK DATA API`);
            const res = await fetch(
                `${stockRawDataUrl}${ticker}&api_token=${apiToken}`
            );

            if (res.ok) {
                const data = await res.json();
                return data;
            }
        } catch (error) {
            console.log(error.message);
            return;
        }
    };

    // combine all stockRawData
    // const getAllStockRawData = async () => {
    //     try {
    //         console.log("Getting data of all stock");
    //         const RawData = [];

    //         for (const ticker of tickers) {
    //             const stock = await getStockRawData(ticker);
    //             if (stock) {
    //                 console.log(JSON.stringify(stock));
    //                 RawData.push(stock);
    //             } else {
    //                 console.log(`getting ${ticker} raw data FAILED!`);
    //                 return null;
    //             }
    //         }

    //         setStockRawData(RawData);
    //         console.log("All stock data retrieved:", RawData);
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // };

    // getting stock data from Airtable
    const getAllStockData = async () => {
        try {
            const res = await fetch(`${airtableUrl}StockData?`, {
                headers: {
                    Authorization: "Bearer " + airtableApiToken,
                },
            });

            if (res.ok) {
                const stockData = await res.json();
                console.log(JSON.stringify(stockData));
                setAllStockData(stockData);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // adding stockRawData into Airtable (creating Record)
    const ProcessStockDataButton = async () => {
        console.log("Creating stockRawData at AIRTABLE stockData");

        const RawData = [];

        for (const ticker of tickers) {
            // pulling data from public api
            console.log("pulling data...");
            const stock = await getStockRawData(ticker);
            if (stock) {
                console.log(JSON.stringify(stock.data[0]));
                RawData.push(stock);
                const data = stock.data[0];

                // console.log("checking allStockData")
                // console.log(JSON.stringify(allStockData))
                // cross check with airtable if the data is available
                const dataInAirtable = allStockData.records.find(
                    (record) => record.fields.ticker === data.ticker
                );

                console.log(
                    `checkfordatainAirTable::: ${JSON.stringify(
                        dataInAirtable
                    )}`
                );

                if (dataInAirtable) {
                    // update record on existing stock in airtable
                    console.log(`${data.ticker} already exists in table.`);
                    await updateStockData(dataInAirtable, data);
                } else {
                    // creating new stock record into airtable
                    await createStockData(data);
                }

                getAllStockData();
            } else {
                console.log(`getting ${ticker} raw data FAILED!`);
                return;
            }
        }
        setStockRawData(RawData);
        console.log("All stock data retrieved:", RawData);
    };

    const createStockData = async (data) => {
        console.log(`creating ${data.ticker} record into stockData table...`);
        const res = await fetch(`${airtableUrl}StockData`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + airtableApiToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                records: [
                    {
                        fields: {
                            ticker: data.ticker,
                            name: data.name,
                            price: data.price,
                            day_high: data.day_high,
                            day_low: data.day_low,
                            day_open: data.day_open,
                            "52_week_high": data["52_week_high"],
                            "52_week_low": data["52_week_low"],
                            previous_close_price: data.previous_close_price,
                            previous_close_price_time: new Date(
                                data.previous_close_price_time
                            ).toISOString(),
                            volume: data.volume,
                            last_trade_time: new Date(
                                data.last_trade_time
                            ).toISOString(),
                        },
                    },
                ],
            }),
        });

        if (!res.ok) {
            throw new Error("StockData Post Response was not OK!");
        }
    };

    const updateStockData = async (dataInAirtable, data) => {
        // if condition to check if the data in airtable is the latest based on previous-close-price-time
        console.log("Updating stockRawData to AIRTABLE stockData");

        if (
            dataInAirtable.fields.previous_close_price_time ===
            new Date(data.previous_close_price_time).toISOString()
        ) {
            console.log(
                `Airtable has the latest data for ${data.ticker}, no update is required!`
            );
            return;
        }

        const res = await fetch(`${airtableUrl}StockData`, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + airtableApiToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                records: [
                    {
                        id: dataInAirtable.id,
                        fields: {
                            price: data.price,
                            day_high: data.day_high,
                            day_low: data.day_low,
                            day_open: data.day_open,
                            "52_week_high": data["52_week_high"],
                            "52_week_low": data["52_week_low"],
                            previous_close_price: data.previous_close_price,
                            previous_close_price_time: new Date(
                                data.previous_close_price_time
                            ).toISOString(),
                            volume: data.volume,
                            last_trade_time: new Date(
                                data.last_trade_time
                            ).toISOString(),
                        },
                    },
                ],
            }),
        });

        if (!res.ok) {
            throw new Error("StockData Patch Response was not OK!");
        }
    };

    useEffect(() => {
        getAllStockData();
    }, []);

    return (
        <div>
            <h2>Stock Data</h2>
            <button className="getStockData" onClick={ProcessStockDataButton}>
                Update Data
            </button>
            {JSON.stringify(stockRawData)}
            {stockRawData ? (
                <ul>
                    {stockRawData.map(({ data }, idx) => (
                        <li key={idx}>ticker = {data[0].ticker}</li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
            {JSON.stringify(allStockData)}
            {allStockData ? (
                <ul>
                    {allStockData.records && allStockData.records.map((record) => (
                        <li key={record.id}>ticker = {record.fields.ticker}</li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
            <StockPortfolio
                allStockData={allStockData}
            ></StockPortfolio>
        </div>
    );
};

export default StockData;
