import React from "react";
import image from "../assets/underconstruction.gif";
import styles from "./HomePage.module.css";

const HomePage = () => {
    return (
        <div className={styles["image-container"]}>
            <img className={styles.image} src={image} alt="underConstruction" />
        </div>
    );
};

export default HomePage;
