import React from "react";
import styles from "./NavBar.module.css";
import { NavLink, Link } from "react-router-dom";

const NavBar = () => {
    return (
        <header className={styles.navbar}>
            <nav>
                <div>
                    <ul>
                        <li>
                            {/* Should not use anchor tag, because it will run through the server and check for the page */}
                            {/* <a href="/main">Main</a> */}
                            {/* <Link to="/main">Main</Link> */}
                            {/* navData is property of NavLink */}
                            <NavLink
                                className={(navData) =>
                                    navData.isActive ? styles.active : ""
                                }
                                to="/home"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            {/* <a href="/members">Members</a> */}
                            {/* <Link to="/members">Members</Link> */}
                            <NavLink
                                className={(navData) =>
                                    navData.isActive ? styles.active : ""
                                }
                                to="/portfolio"
                            >
                                Portfolio
                            </NavLink>
                        </li>
                        <li>
                            {/* <a href="/members">Members</a> */}
                            {/* <Link to="/members">Members</Link> */}
                            <NavLink
                                className={(navData) =>
                                    navData.isActive ? styles.active : ""
                                }
                                to="/user"
                            >
                                User
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
