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
          onTrackChange={props.onTrackChange}

          currentTrack={props.currentTrack}
          
          isRemoval={props.isRemoval}
          isPlaying={props.isPlaying}
          isExistingTrack={props.isExistingTrack}       
          
          addedTracks={props.addedTracks}
          toggleControl={props.toggleControl}
        />
      ))}
    </div>
  )
}

export default Tracklist;