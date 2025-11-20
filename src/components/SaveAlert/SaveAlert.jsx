import styles from './SaveAlert.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function SaveAlert(props) {
    return (
        <div className={styles.SaveAlert}>
            <img className={styles["SaveAlert-cover"]} src={props.cover} />
            <h3 className={styles["SaveAlert-name"]}> {props.name}</h3>
            <a id={styles["SaveAlert-link"]} href={`https://open.spotify.com/playlist/${props.id}`} target="_blank" title="Open in Spotify">OPEN IN SPOTIFY <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a>
        </div>
    );
}

export default SaveAlert
