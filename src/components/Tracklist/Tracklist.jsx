import React from 'react';

import styles from './Tracklist.module.css';

import Track from '../Track/Track';

function Tracklist(props) {
  return (
    <div className={styles.Tracklist}>
      {props.userSearchResults.map((track) => (
        <Track
          track={track}
          key={track.id}

          onAdd={props.onAdd}
          onRemove={props.onRemove}
          onPlay={props.onPlay}

          currentTrack={props.currentTrack}
          
          isRemoval={props.isRemoval}
          isPlaying={props.isPlaying}
          isSpinning={props.isSpinning}
          isExistingTrack={props.isExistingTrack}       
          
          addedTracks={props.addedTracks}
          toggleSpin={props.toggleSpin}
          toggleControl={props.toggleControl}
        />
      ))}
    </div>
  )
}

export default Tracklist;