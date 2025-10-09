import { useState } from 'react';

import styles from './Playlist.module.css';
import jammmingLogo from '../../assets/jammming_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPenToSquare, faCamera } from '@fortawesome/free-solid-svg-icons';

import Tracklist from '../Tracklist/Tracklist';

function Playlist(props) {
    const [isVisible, setIsVisible] = useState(false);
    const [playlistCover, setPlaylistCover] = useState(jammmingLogo);

    function handlePlaylistSave() {     // displays save button if tracks are in playlist
        if(props.isEmpty && props.playlistTracks.length === 0) {
            return (
                <div className={styles["Playlist-empty"]}>
                    <FontAwesomeIcon className={styles.faMusic} icon={faMusic} size="lg" />
                    <p>No Tracks Added</p>
                </div>
            );
        }
        else {
            return (
                <div className={styles["Playlist-save-container"]}>
                    <p className={styles.count}>{props.playlistTracks.length} Track{(props.playlistTracks.length === 1) ? '' : "s"}</p>
                    <button className={styles["Playlist-save"]} onClick={props.onSave} title="Save">SAVE</button>
                </div>
            );
        }
    }

    function handleNameChange({target}) {
        props.onNameChange(target.value);
    }

    function handleDescChange({target}) {
        props.onDescChange(target.value);
    }

    function handleCoverChange({target}) {
        if(target.files && target.files[0]) {
            setPlaylistCover(URL.createObjectURL(target.files[0]));
        }
    }

    return (
        <div className={styles.Playlist}>
            <div className={styles["Playlist-info-container"]}>
                <div className={styles["Playlist-title-desc"]}>
                    <div className={styles["Playlist-title"]}>
                        <FontAwesomeIcon className={styles.faPenToSquare} icon={faPenToSquare} size="lg" />
                        <input onChange={handleNameChange} placeholder="New Playlist" required />
                    </div>
                    <textarea className={styles["Playlist-description"]} onChange={handleDescChange} placeholder="Enter a description..." rows="4" cols="1"></textarea>
                </div>
                <div className={styles["Playlist-album"]} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
                    <input onChange={handleCoverChange} type="file" accept="image/*" capture />
                    {isVisible && <FontAwesomeIcon className={styles.faCamera} icon={faCamera} size="2xl" />}
                    {isVisible && <div className={styles.overlay} aria-hidden>.</div>}
                    <img src={playlistCover} />
                </div>
            </div>
            <Tracklist
                userSearchResults={props.playlistTracks}

                onRemove={props.onRemove}
                onTrackChange={props.onTrackChange}

                isRemoval={true}
                isPlaying={props.isPlaying}
                
                currentTrack={props.currentTrack}
                toggleControl={props.toggleControl}
            />
            {handlePlaylistSave()}
        </div>
    );
}

export default Playlist;