import React from 'react';

import styles from './Copyright.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function Copyright(props) {
    if(props.popUp) {
        return (
            <div className={styles["Copyright-background"]}>
                <div className={styles["Copyright-container"]}>
                    <div className={styles["Copyright-title"]}>
                        <h2>Copyright Information</h2>
                        <button onClick={() => props.setPopUp(false)}><FontAwesomeIcon className={styles.xmark} icon={faXmark} size="lg" /></button>
                    </div>
                    <ul>
                        <li><p><a href="https://unsplash.com/photos/a-colorful-sound-wave-on-a-black-background--TfwQjOWEp8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" target="_blank" title="Soundwave">Soundwave photo</a> by <a href="https://unsplash.com/@jumpingjax?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" target="_blank" title="Jumping Jax">Jumping Jax</a> on <a href="https://www.unsplash.com" target="_blank" title="Unsplash">Unsplash.</a></p></li>
                        <li><p><a href="https://www.flaticon.com/free-icon/skull_10808564?term=skull+headphones&related_id=10808564" target="_blank" title="Skull Icon">Skull icon</a> by <a href="https://www.flaticon.com/authors/smashicons" target="_blank" title="Smashicons"> Smashicons </a> on <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">Flaticon.</a></p></li>
                        <li><p><a href="https://www.flaticon.com/free-icon/github_2111432?term=github&related_id=2111432" target="_blank" title="Github Icon">Github icon</a> by <a href="https://www.flaticon.com/authors/pixel-perfect" target="_blank" title="Pixel perfect">Pixel perfect</a> on <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">Flaticon.</a></p></li>
                        <li><p>Placeholder track <a href="https://pixabay.com/music/future-bass-the-last-point-beat-electronic-digital-394291/" target="_blank" title="The Last Point">"The Last Point"</a> by <a href="https://pixabay.com/users/raspberrymusic-27759797/" target="_blank" title="raspberrymusic">raspberrymusic</a> on <a href="https://www.pixabay.com/" target="_blank" title="Pixabay">Pixabay.</a></p></li>
                        <li><p>Placeholder track <a href="https://pixabay.com/music/electronic-embrace-364091/" target="_blank" title="Embrace">"Embrace"</a> by <a href="https://pixabay.com/users/evgeny_bardyuzha-25235210/" target="_blank" title="Evgeny_Bardyuzha">Evgeny_Bardyuzha</a> on <a href="https://www.pixabay.com/" target="_blank" title="Pixabay">Pixabay.</a></p></li>
                    </ul>
                </div>
            </div>     
        );
    }
    else {
        return '';
    }
}

export default Copyright