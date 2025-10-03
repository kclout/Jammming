import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

import styles from './App.module.css';
import jammmingLogo from '../../assets/jammming_logo.png';
import githubLogo from '../../assets/github.png';
import placeholderSong from '../../assets/embrace-364091.mp3';
import placeholderSong2 from '../../assets/the-last-point-beat-electronic-digital-394291.mp3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Copyright from '../Copyright/Copyright';

function App() {
  const [searchResults, setSearchResults] = useState([
    {
      name: "Butterfly",
      artist: "LOONA",
      album: "[XX]",
      id: 1,
      cover: jammmingLogo,
      preview: placeholderSong,
    },
    {
      name: "prfct",
      artist: "Sabrina Carpenter",
      album: "Singular Act I",
      id: 2,
      cover: jammmingLogo,
      preview: placeholderSong2,
    },
    {
      name: "Go Gina",
      artist: "SZA",
      album: "Ctrl",
      id: 3,
      cover: jammmingLogo,
      preview: placeholderSong,
    },
  ]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistDesc, setPlaylistDesc] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      name: "Butterfly",
      artist: "LOONA",
      album: "[XX]",
      id: 1,
      cover: jammmingLogo,
      preview: placeholderSong,
    },
    {
      name: "prfct",
      artist: "Sabrina Carpenter",
      album: "Singular Act I",
      id: 2,
      cover: jammmingLogo,
      preview: placeholderSong2,
    }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpinning, setIsSpinning] = useState(true);
  const [isExistingTrack, setIsExistingTrack] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [addedTracks, setAddedTracks] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const audioRef = useRef(new Audio(null));

  useEffect(() => {   // checks for empty playlist or results
    if(playlistTracks.length === 0 || searchResults.length === 0) {
      setIsEmpty(true);
    }
    else {
      setIsEmpty(false);
    }
  }, [searchResults, playlistTracks]);

  useEffect(() => {     // checks for tracks already in playlist when results or playlist are updated
  const existingTracks = [];
    searchResults.forEach((track) => {
      playlistTracks.forEach((t) => {
        if(t.id === track.id) {
          existingTracks.push(track);
        }
      });
    });
    setAddedTracks(existingTracks);
    setIsExistingTrack(true);
  }, [searchResults, playlistTracks]);

  useEffect(() => {     // plays selected track
    if(currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.preview;
      audioRef.current.play();
      setIsPlaying(true);
      setIsSpinning(true);
    }
  }, [currentTrack?.id]);

  function addTrack(track) {
    const existingTrack = playlistTracks.find((t) => t.id === track.id);
    const newTrack = playlistTracks.concat(track);

    if(!existingTrack) {
      setPlaylistTracks(newTrack);
    }
  }

  function removeTrack(track) {
    const existingTrack = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(existingTrack);
  }

  function playTrack(track) {
    if(audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  }

  function toggleControl() {
    if(isPlaying) {
      audioRef.current.pause();
    }
    else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function toggleSpin() {
    if(isPlaying) { 
      setIsSpinning(true);
    }
    else {
      setIsSpinning(false);
    }
  }

  function updatePlaylistName(name) {
    setPlaylistName(name);
  }

  function updatePlaylistDesc(desc) {
    setPlaylistDesc(desc);
  }

  function savePlaylist() {
    const trackURIs = playlistTracks.map((t) => t.uri);

  }

  function search(term) {
    console.log(term);
  }

  return (
    <div>
        <Copyright
          popUp={popUp}
          setPopUp={setPopUp}
        />
      <header>
        <div className={styles["title-container"]}>
          <img src={jammmingLogo} />
          <h1>
            JA<span className={styles.highlight}>MMM</span>ING!
          </h1>     
        </div>
        <button className={styles.login}>LOG IN</button>
      </header>
      <div className={styles.App}>
        <div className={styles["SearchBar-container"]}>
          <h2>Let's Jam!</h2>
          <p>Ready to rock? With Ja<span className={styles.highlight}>mmm</span>ing!, you can search for your favorite songs, create playlists, and export them to Spotify!</p>
          <SearchBar
            onSearch={search}
          />
        </div>
        <div className={styles["App-playlist"]}>
          <SearchResults
            userSearchResults={searchResults}

            onAdd={addTrack}
            onPlay={playTrack}

            isPlaying={isPlaying}
            isSpinning={isSpinning}
            isExistingTrack={isExistingTrack}
            isEmpty={isEmpty}

            currentTrack={currentTrack}
            addedTracks={addedTracks}
            toggleSpin={toggleSpin}
            toggleControl={toggleControl}
          />
          <Playlist 
            playlistName={playlistName}
            playlistDesc={playlistDesc}
            playlistTracks={playlistTracks}

            onNameChange={updatePlaylistName}
            onDescChange={updatePlaylistDesc}
            onRemove={removeTrack}
            onPlay={playTrack}
            onSave={savePlaylist}

            isPlaying={isPlaying}
            isSpinning={isSpinning}
            isEmpty={isEmpty}

            currentTrack={currentTrack}
            toggleSpin={toggleSpin}
            toggleControl={toggleControl}
          />
        </div>
      </div>
      <footer>
        <div className={styles["Footer-container"]}><img src={githubLogo} /><p><a href="https://github.com/kclout/Jammming" target="_blank" title="v0.1.0">v0.1.0</a> by <a href="https://kclout.github.io" target="_blank" title="kclout">kclout</a></p></div>
        <button className={styles.faCopyright} onClick={() => setPopUp(true)} title="Copyright"><FontAwesomeIcon icon={faCopyright} size="xl" /></button>
      </footer>
    </div>
  );
}

export default App;