import React from 'react';

import styles from './Track.module.css';
import jammmingLogo from '../../assets/jammming_logo.png';
import record from '../../assets/record.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faPlay, faPause, faXmark } from '@fortawesome/free-solid-svg-icons';

function Track(props) {
    
    function checkExistingTrack() {
        let result = '';
        props.addedTracks?.forEach((t) => {
            if (props.track.id === t?.id) {
                result = styles.inactive;
            }
        });
        return result;
    }

    function renderAction() {
        if (props.isRemoval) {
            return <button className={styles['Track-action']} onClick={passTrackToRemove}><FontAwesomeIcon icon={faMinus} size="2xs" /></button>
        }
        else {
            return <button className={`${styles['Track-action']} ${checkExistingTrack()}`}  onClick={passTrack} title={checkExistingTrack() ? 'Track already in playlist' : ''}><FontAwesomeIcon icon={faPlus} size="2xs" /></button>
        }
    }

    function renderControl() {
        if(props.isPlaying && props.track.id === props.currentTrack.id) {
            if(!props.track.preview) {
                return <button onClick={handleClick} title={props.track.preview ? "" : "No preview available"}><FontAwesomeIcon className={styles['Track-control']} icon={faXmark} size="2xl" /></button>;
            }
            else {
                return <button onClick={handleClick}><FontAwesomeIcon className={styles['Track-control']} icon={faPause} size="lg" /></button>;
            }
        }
        else {
            return <button onClick={handleClick} title={props.track.preview ? `Preview ${props.track.name} by ${props.track.artist}` : "No preview available"}><FontAwesomeIcon className={styles['Track-control']} icon={faPlay} size="lg" /></button>;
        }
    }

    function spinTrack() {
        if(props.track.preview && props.isPlaying && props.track.id === props.currentTrack.id) {
            return styles.spin;
        }
        else {
            return '';
        }
    }

    function passTrack() {
        props.onAdd(props.track);
    }

    function passTrackToRemove() {
        props.onRemove(props.track);
    }

    function handleClick() {
        props.onPlay(props.track);
        props.toggleControl(props.track);
        props.toggleSpin(props.track);       
    }

    return (
        <div className={styles.Track}>
            <div className={styles['Track-information']}>
                <div className={styles['Track-album-container']}>
                    <audio ref={props.audioRef} src={props.track.preview}>No preview available</audio>
                    {renderControl()}
                    <img src={record} className={`${styles['Track-record']} ${spinTrack()}`} />
                    <img src={props.track.cover ? props.track.cover : jammmingLogo} className={`${styles['Track-album']} ${spinTrack()}`} />
                </div>
                <div className={styles['Track-info-container']}>
                    <h3>{props.track.name}</h3>
                    <p>{props.track.artist} | {props.track.album}</p>
                </div>
            </div>
            {renderAction()}
        </div>
    );
}

export default Track;