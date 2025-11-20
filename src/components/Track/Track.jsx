import styles from './Track.module.css';
import jammmingLogo from '../../assets/jammming_logo.png';
import record from '../../assets/record.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCheck, faPlay, faPause, faXmark } from '@fortawesome/free-solid-svg-icons';

function Track(props) { 
    function checkExistingTrack() {     // displays inactive style (checkmark) for tracks in Search Resutls that have already been added
        let result = '';
        props.addedTracks?.forEach((t) => {
            if (props.track.id === t?.id) {
                result = styles.inactive;
            }
        });
        return result;
    }

    function renderAction() {      // render add, remove, and checkmark buttons depending on state of track
        if (props.isRemoval) {
            return <button className={styles['Track-action']} onClick={passTrackToRemove} title={`Remove ${props.track.name}`}><FontAwesomeIcon icon={faMinus} size="2xs" /></button>
        }
        else {
            return <button className={`${styles['Track-action']} ${checkExistingTrack()}`}  onClick={passTrack} title={checkExistingTrack() ? 'Track already in playlist' : `Add ${props.track.name}`}><FontAwesomeIcon icon={checkExistingTrack() ? faCheck : faPlus} size="2xs" /></button>
        }
    }

    function renderControl() {      // render play, pause, and missing preview buttons depending on state of track
        if(props.isPlaying && props.track.id === props.currentTrack.id) {
            return <button onClick={handleClick} title={props.track.preview ? `Pause ${props.track.name}` : "No preview available"}><FontAwesomeIcon className={styles['Track-control']} icon={props.track.preview ? faPause : faXmark} size={props.track.preview ? "lg" : "2xl"} /></button>;
        }
        else {
            return <button onClick={handleClick} title={props.track.preview ? `Preview ${props.track.name}` : "No preview available"}><FontAwesomeIcon className={styles['Track-control']} icon={faPlay} size="lg" /></button>;
        }
    }

    function spinTrack() {      // adds 'spin' class to current track playing if preview exists
        return (props.track.preview && props.isPlaying && props.track.id === props.currentTrack.id) ? (
            styles.spin
        ) : "";
    }

    function passTrack() {
        props.onAdd(props.track);
    }

    function passTrackToRemove() {
        props.onRemove(props.track);
    }

    function handleClick() {
        props.onTrackChange(props.track);
        props.toggleControl(props.track);
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