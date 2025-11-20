import { useState } from 'react';
import Resizer from "react-image-file-resizer";

import styles from './Playlist.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPenToSquare, faCamera, faGear, faArrowRotateLeft, faArrowRightToBracket} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';

import Tracklist from '../Tracklist/Tracklist';
import SaveAlert from '../SaveAlert/SaveAlert';

function Playlist(props) {
    const [isVisible, setIsVisible] = useState(false);

    function handlePlaylistSave() {        // saves playlist on click then gets playlist id for popup
        props.updateLoading(true, "save");  
        props.onSave()
        .then((newPlaylistId) => {props.setPopUp({
            title: "Playlist Saved!",
            comp: SaveAlert,
            props: {id: newPlaylistId, cover: props.playlistCoverPrev, name: (props.playlistName ? props.playlistName : "New Playlist")}, 
            message: null,
            size: "lg", });
        })
        .then(() => props.resetOnSave ? (props.onReset()) : "")
        .then(() => props.updateLoading(false, null));  
    }

    function handleLoadingPlaylist() {
        const load = props.loading && props.loadId === "save";
        return (load) ? (
            <div className={styles.loading}>
                <div className={styles["loading-spinner-container"]}>
                    <div className={styles.loader}></div>
                    <p>Saving...</p>
                </div>
            </div>
        ) : "";
    }

    function handleReset() {       // popup to reset current playlist
        props.setPopUp({
            title: "Reset Playlist",
            comp: null,
            props: null,
            message: (<div className={styles["reset-popup-container"]}>
                        <h3>Are you sure you want to reset?</h3>
                        <p>The playlist title, description, cover and tracks will be deleted.</p>
                        <div className={styles["buttons-container"]}>
                            <button onClick={() => {props.onReset(); props.setPopUp(null);}} >YES</button>
                            <button onClick={() => props.setPopUp(null)}>NO</button>
                        </div>
                     </div>),
            size: "med",
        });
    }

    function handleSettings() {     // open settings
        props.settings();
    }

    function showSaveButton() {     // displays save button if tracks are in playlist
        const empty = props.isEmpty && props.playlistTracks.length === 0;
        if(empty) {
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
                    <button className={styles["Playlist-save"]} onClick={handlePlaylistSave} title="Save">SAVE</button>
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

   async function compressFile(file) {       // resize, compress and convert cover to base64
        let newFile = file;
        const maxFileSize = 256 * 1024;
        let quality = 100;

        do {
            if(quality < 10) {
                alert("File is too large. Please choose a file less than 256KB.");
                break;
            }
            newFile = await new Promise((resolve) => {
                Resizer.imageFileResizer(
                    newFile,
                    640,
                    640,
                    "JPEG",
                    quality,
                    0,
                    (resultUri) => {
                        resolve(resultUri);
                    },
                    "blob",
                    300,
                    300,
                );
            });
            quality -= 10;
        } while(newFile.size > maxFileSize || (newFile.height > 640 || newFile.height < 300) || (newFile.width > 640 || newFile.width < 300));

        return new Promise((resolve) =>{        // convert to base64
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(newFile);
        });
    }

    async function handleCoverChange({target}) {      // sets cover and cover preview
        const img = target.files[0];

        if (target.files && img) {
            const coverPrev = URL.createObjectURL(img);
            props.onCoverPrevChange(coverPrev);  
            
            compressFile(img).then((cover) => props.onCoverChange(cover));
        }
    }

    

    return (
        <div className={styles.Playlist}>
            <div className={styles["Playlist-container"]}>
                <div className={styles["Playlist-info-container"]}>
                    <div className={styles["Playlist-title-desc"]}>
                        <div className={styles["Playlist-title"]}>
                            <FontAwesomeIcon className={styles.faPenToSquare} icon={faPenToSquare} size="lg" />
                            <input value={props.playlistName} onChange={handleNameChange} placeholder="New Playlist" />
                        </div>
                        <textarea value={props.playlistDesc} className={styles["Playlist-description"]} onChange={handleDescChange} placeholder="Enter a description..." rows="4" cols="1"></textarea>
                    </div>
                    <div className={styles["Playlist-album"]} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
                        <input onChange={handleCoverChange} type="file" accept="image/*" capture />
                        {isVisible && <FontAwesomeIcon className={styles.faCamera} icon={faCamera} size="2xl" />}
                        {isVisible && <div className={styles.overlay} aria-hidden>.</div>}
                        <img src={props.playlistCoverPrev} />
                    </div>
                </div>
                <div className={styles["loading-container"]}>
                    {handleLoadingPlaylist()}
                    <Tracklist
                        userSearchResults={props.playlistTracks}

                        onRemove={props.onRemove}
                        onTrackChange={props.onTrackChange}

                        isRemoval={true}
                        isPlaying={props.isPlaying}

                        currentTrack={props.currentTrack}
                        toggleControl={props.toggleControl}
                    />   
                    {showSaveButton()}
                </div>
            </div>
            <div className={styles.toolbar}>
                <ul>
                    <li><button onClick={handleSettings} title="Settings"><FontAwesomeIcon className={styles.faGear} icon={faGear} size="lg" /></button></li>
                    <li><button title="Import" data-tooltip-id="import" data-tooltip-content="Coming soon!"><FontAwesomeIcon className={styles.faArrowRightToBracket} icon={faArrowRightToBracket} size="lg" /></button>
                        <Tooltip id="import"
                            style={{
                                fontSize: "0.75rem",
                                backgroundColor: "rgb(20, 21, 26)",                
                                }}
                            border="1px solid rgb(30, 215, 96)"
                        />
                    </li>
                    <li><button onClick={handleReset} title="Reset"><FontAwesomeIcon className={styles.faArrowRotateLeft} icon={faArrowRotateLeft} size="lg" /></button></li>
                </ul>
            </div>
        </div>
    );
}

export default Playlist;