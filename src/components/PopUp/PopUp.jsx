import React, { useEffect } from 'react';

import styles from './PopUp.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function PopUp(props) {
    const title = props.popUp?.title;
    const Component = props.popUp?.comp;
    const message = props.popUp?.message;
    const compProps = props.popUp?.props;
    const size = props.popUp?.size;

    useEffect(() => {
        const handleEscKeyDown = (event) => {       // close pop up with Esc key
            if (event.key === 'Escape') {
                props.setPopUp(null);
            }
        }
        window.addEventListener("keydown", handleEscKeyDown);
        return () => window.removeEventListener("keydown", handleEscKeyDown);
    }, []);

    function popUpSize() {
        switch(size) {
            case "lg":
                return styles.lg;
            case "sm":
                return styles.sm;
            case "med":
                return styles.med;
        }
    }

    return (props.popUp) ? (
        <div className={styles["PopUp-background"]}>
            <div className={`${styles["PopUp-container"]} ${popUpSize()}`}>
                <div className={styles["PopUp-title"]}>
                    <h2>{title}</h2>
                    <button onClick={() => props.setPopUp(null)} title="Close" aria-label="Close"><FontAwesomeIcon className={styles.faXmark} icon={faXmark} size="lg" /></button>
                </div>
                <div className={styles["PopUp-content"]}>
                    {Component ? <Component {...compProps}/> : <div className={styles.message}>{message}</div>}
                </div>
            </div>
        </div>
    ) : "";
}

export default PopUp