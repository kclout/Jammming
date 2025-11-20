import styles from './SearchResults.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import Tracklist from '../Tracklist/Tracklist';

function SearchResults(props) {
  function handleEmptyResults() {   // displays message if Search Results are empty
    const empty = props.isEmpty && props.userSearchResults.length === 0;
    return (empty) ? (
      <div className={styles["SearchResults-empty"]}>
        <FontAwesomeIcon className={styles.faMagnifyingGlass} icon={faMagnifyingGlass} size="lg" />
        <p>No Results</p>
      </div>
    ) : "";
  }

  function handleLoading() {
    const load = props.loading && props.loadId === "search";
    return (load) ? (
      <div className={styles.loading}>
        <div className={styles["loading-spinner-container"]}>
          <div className={styles.loader}></div>
          <p>Loading...</p>
        </div>
      </div>
    ) : "";
  }

  return (
    <div className={styles.SearchResults}>
      <div className={styles["SearchResults-container"]}>
        <div className={styles["SearchResults-title"]}>
          <FontAwesomeIcon className={styles.faBars} icon={faBars} size="lg" />
          <h2>Results ({props.userSearchResults.length})</h2>
        </div>
        <div className={styles["loading-container"]}>
          {handleLoading()}
          <Tracklist
            className={styles.Tracklist}
            userSearchResults={props.userSearchResults}

            onAdd={props.onAdd}
            onTrackChange={props.onTrackChange}

            isRemoval={false}
            isPlaying={props.isPlaying}
            isExistingTrack={props.isExistingTrack}

            currentTrack={props.currentTrack}
            addedTracks={props.addedTracks}
            toggleControl={props.toggleControl}
          />
          {handleEmptyResults()}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;