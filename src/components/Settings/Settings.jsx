import React, { useEffect, useState } from 'react';

import styles from './Settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { Tooltip } from 'react-tooltip';

function Settings(props) {
    const [resetCheck, setResetCheck] = useState(() => {        // save user settings to local storage
        const savedReset = localStorage.getItem("resetOnSave");
        return savedReset === 'true' ? true : false;
    });

    useEffect(() => {
        localStorage.setItem('resetOnSave', resetCheck);
    }, [resetCheck]);

    function toggleResetOffOn() {
        return (resetCheck) ? (<p>On</p>) : (<p>Off</p>);
    }

    function resetSetting({target}) {
        setResetCheck(!resetCheck);
        props.resetToggle(target.checked);
    }

    return (
        <table className={styles.Settings}>
            <tbody>
                <tr className={styles.reset}>
                    <th>
                        <h3>
                            Reset Tracks on Save
                            <span className={styles.tooltip} data-tooltip-id="reset-on-save" data-tooltip-content="When on, tracks, title, description, and cover are reset once the playlist is exported. Recommended if creating multiple playlists.">
                                <FontAwesomeIcon className={styles.faCircleQuestion} icon={faCircleQuestion} size="xs" />
                            </span>
                        </h3>
                        <Tooltip id="reset-on-save"
                            style={{
                                fontSize: "0.75rem",
                                width: "30%",
                                backgroundColor: "rgb(20, 21, 26)",                
                                }}
                            border="1px solid rgb(30, 215, 96)"
                        />
                    </th>
                    <td>
                        <div className={styles.container}>
                            <label className={styles.switch}>
                                <input onChange={resetSetting} type="checkbox" checked={resetCheck}></input>
                                <span className={styles.slider}></span>
                            </label>
                            {toggleResetOffOn()}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default Settings