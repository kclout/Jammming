import React from 'react';

import styles from './SearchResults.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import Tracklist from '../Tracklist/Tracklist';

function SearchResults(props) {
  function handleEmptyResults() {
    if(props.isEmpty && props.userSearchResults.length === 0) {
      return (
        <div className={styles.empty}>
          <FontAwesomeIcon className={styles.faMagnifyingGlass} icon={faMagnifyingGlass} size="lg" />
          <p>No Results</p>
        </div>
      );
    }
    else {
      return '';
    }
  }

  return (
    <div className={styles.SearchResults}>
      <div className={styles["SearchResults-title"]}>
        <FontAwesomeIcon className={styles.faBars} icon={faBars} size="lg" />
        <h2>Results</h2>
      </div>
      <Tracklist
        userSearchResults={props.userSearchResults}

        onAdd={props.onAdd}
        onPlay={props.onPlay}

        isRemoval={false}
        isPlaying={props.isPlaying}
        isSpinning={props.isSpinning}
        isExistingTrack={props.isExistingTrack}

        currentTrack={props.currentTrack}
        addedTracks={props.addedTracks}
        toggleSpin={props.toggleSpin}
        toggleControl={props.toggleControl}
      />
      {handleEmptyResults()}
    </div>
  );
}

export default SearchResults;