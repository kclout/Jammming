import React from 'react';

import styles from './Copyright.module.css';

function Copyright() {
    return (
        <div className={styles.Copyright}>
            <ul>
                <li><p><a href="https://unsplash.com/photos/a-colorful-sound-wave-on-a-black-background--TfwQjOWEp8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" target="_blank" title="Soundwave">Soundwave photo</a> by <a href="https://unsplash.com/@jumpingjax?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" target="_blank" title="Jumping Jax">Jumping Jax</a> on <a href="https://www.unsplash.com" target="_blank" title="Unsplash">Unsplash.</a></p></li>
                <li><p><a href="https://www.flaticon.com/free-icon/skull_10808564?term=skull+headphones&related_id=10808564" target="_blank" title="Skull Icon">Skull icon</a> by <a href="https://www.flaticon.com/authors/smashicons" target="_blank" title="Smashicons"> Smashicons </a> on <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">Flaticon.</a></p></li>
                <li><p><a href="https://www.flaticon.com/free-icon/github_2111432?term=github&related_id=2111432" target="_blank" title="Github Icon">Github icon</a> by <a href="https://www.flaticon.com/authors/pixel-perfect" target="_blank" title="Pixel perfect">Pixel perfect</a> on <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">Flaticon.</a></p></li>
            </ul>
        </div>
    );
}

export default Copyright