import React from "react";
import StockData from "./components/StockData";
import UserDisplay from "./components/UserDisplay";

function App() {
    return (
        <div>
            <h2>CHECK FOR DATA FROM API</h2>
            <StockData></StockData>
            <br />
            <br />
            <UserDisplay></UserDisplay>
        </div>
    );
}

export default App;
