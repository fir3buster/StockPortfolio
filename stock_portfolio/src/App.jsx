import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import StockData from "./components/StockData";
import UserDisplay from "./components/UserDisplay";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import { Suspense } from "react";

function App() {
    const [users, setUsers] = useState([]);

    const handleUsersData = (userData) => {
        setUsers(userData);
    };

    console.log(users);
    return (
        <div>
            {/* <h2>STOCK PORTFOLIO</h2>
            <StockData></StockData>
            <br />
            <br />
            <UserDisplay></UserDisplay> */}
            <Suspense fallback={<h1>loading...</h1>}>
                <NavBar></NavBar>
                <Routes>
                    {/* <Route path="/" element={<Main />}></Route> */}
                    {/* :id => : to identify key-value pair */}
                    <Route
                        path="/"
                        element={<Navigate replace to="/homepage" />}
                    ></Route>
                    <Route
                        path="user"
                        element={
                            <UserDisplay handleUsersData={handleUsersData} />
                        }
                    ></Route>
                    <Route path="home" element={<HomePage />}></Route>
                    <Route
                        path="portfolio"
                        element={<StockData users={users} />}
                    ></Route>
                    {/* <Route path="portfolio" element={<StockData />}></Route>
                    <Route path="user" element={<UserDisplay />}></Route> */}
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
