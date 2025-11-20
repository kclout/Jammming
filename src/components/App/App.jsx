import React, { useState, useRef, useEffect } from 'react';

import styles from './App.module.css';
import jammmingLogo from '../../assets/jammming_logo.png';
import githubLogo from '../../assets/github.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import PopUp from '../PopUp/PopUp';
import Copyright from '../Copyright/Copyright';
import Settings from '../Settings/Settings';
import { Spotify } from '../../util/Spotify/Spotify';

function App() {
  // tracks
  const [searchResults, setSearchResults] = useState([]);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [playlistCover, setPlaylistCover] = useState(jammmingLogo);
  const [playlistCoverPrev, setPlaylistCoverPrev] = useState(jammmingLogo);
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isExistingTrack, setIsExistingTrack] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [addedTracks, setAddedTracks] = useState([]);

  // settings
  const [resetOnSave, setResetOnSave] = useState(false);

  // misc
  const [userName, setUserName] = useState(null);
  const [popUp, setPopUp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadId, setLoadId] = useState(null);
  const audioRef = useRef(new Audio(null));

  useEffect(() => {   // checks for empty playlist or results
    (playlistTracks.length === 0 || searchResults.length === 0) ? setIsEmpty(true) : setIsEmpty(false);
  }, [searchResults, playlistTracks]);

  useEffect(() => {   // checks for tracks already in playlist when results or playlist are updated
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

  useEffect(() => {   // updates selected track and plays it
    if(currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.preview;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack?.id]);

  useEffect(() => {   // gets user display name after log in, checks access token
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    async function getUser() {
      if(code) {
        updateLoading(true, "login");
        const newUserName = await Spotify.logIn();

        if(newUserName) {
          setUserName(newUserName);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }

    if(error === 'access_denied'){
      console.error("Error during authentication:", error);
      window.location.replace("/");
    }
    getUser()
    .then(() => {
      setTimeout(() => updateLoading(false, null), 1000);
    });
  }, []);

  useEffect(() => {     // change cursor to wait when loading elements
    document.body.style.cursor = loading ? "wait" : "default";
  }, [loading]);

  function updateLoading(status, id) {    // trigger loading on/off for selected function
    setLoadId(id);
    setLoading(status);
  }

  async function search(term) {
    updateLoading(true, "search");
    Spotify.search(term).then(result => {
      setSearchResults(result);
      updateLoading(false, null);
    });
  }

  function addTrack(track) {    // add track to playlist if not already in it
    const existingTrack = playlistTracks.find((t) => t.id === track.id);
    const newTrack = playlistTracks.concat(track);

    if(!existingTrack) {
      setPlaylistTracks(newTrack);
    }
  }

  function removeTrack(track) {   // remove track from paylist
    const existingTrack = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(existingTrack);
  }

  function updateTrack(track) {   // pauses previously selected track and sets new selected track
    if(audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrack(track);
  }

  function toggleControl() {    // toggle play/pause for audio
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  }

  function updatePlaylistName(name) {
    setPlaylistName(name);
  }

  function updatePlaylistDesc(desc) {
    setPlaylistDesc(desc);
  }

  function updatePlaylistCoverPrev(cover) {
    setPlaylistCoverPrev(cover);
  }

  function updatePlaylistCover(cover) {
    setPlaylistCover(cover);
  }

  function resetPlaylist() {    // reset playlist creation space
    setPlaylistName("");
    setPlaylistDesc("");
    setPlaylistCoverPrev(jammmingLogo);
    setPlaylistCover(jammmingLogo);
    setPlaylistTracks([]);
  }

  async function savePlaylist() {
    const trackURIs = playlistTracks.map((t) => t.uri);
    const newPlaylistId = await Spotify.savePlaylist(playlistName, playlistDesc, playlistCover, trackURIs);

    updatePlaylistName(playlistName);
    updatePlaylistDesc(playlistDesc);
    updatePlaylistCover(playlistCover);
    setPlaylistId(newPlaylistId);

    return newPlaylistId;
  }

  async function logIn() {
    Spotify.logIn().then(newUserName => setUserName(newUserName));
  }

  async function logOut() {
    Spotify.logOut()
      .then(() => {
        setUserName(null);
        setPopUp({
          title: "Logout Sucessful!",
          comp: null,
          props: null,
          message: <div className={styles["logout-popup-container"]}><img src={jammmingLogo} /><p>Come back soon!</p></div>,
          size: "sm",
        });
        setTimeout(() => {
          window.location.reload();
          setPopUp(null);
        }, 2000);
      });
  }

  function displayLogin() {
    const load = loading && loadId === "login";
    if(load) {
      return (
        <div className={styles.loading}>
          <div className={styles.loader}></div>
          <p>Loading...</p>
        </div>
      );
    }
    else {
      return (!userName) ? (
        <button className={styles.login} onClick={() => logIn()} title="Log in">LOG IN</button>
      ) : (
        <div className={styles["login-container"]}>
          <p>Hi, <span className={styles.bold}>{userName}</span>!</p>
          <button className={styles.logout} onClick={() => logOut()} title="Log out">Log out</button>
        </div>
      )
    }
  }

  function settingsPopUp() {    // open settings
    setPopUp({
      title: "Settings",
      comp: Settings,
      props: {resetToggle: updateResetOnSave, reset: resetOnSave},
      message: null,
      size: "lg",
    });
  }

  function updateResetOnSave(reset) {
    setResetOnSave(reset);
  }

  return (
    <div>
        <PopUp
          popUp={popUp}
          setPopUp={setPopUp}
        />
      <header>
        <a href="#">
          <div className={styles["title-container"]}>
            <img src={jammmingLogo} alt="Jammming logo"/>
            <h1 aria-label="Jammming!"><span aria-hidden>JA</span><span className={styles.highlight} aria-hidden>MMM</span><span aria-hidden>ING!</span></h1>     
          </div>
        </a>
        {displayLogin()}
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
            updateLoading={updateLoading}
            loading={loading}
            loadId={loadId}

            onAdd={addTrack}
            onTrackChange={updateTrack}

            isPlaying={isPlaying}
            isExistingTrack={isExistingTrack}
            isEmpty={isEmpty}

            currentTrack={currentTrack}
            addedTracks={addedTracks}
            toggleControl={toggleControl}
          />
          <Playlist 
            updateLoading={updateLoading}
            loading={loading}
            loadId={loadId}

            playlistName={playlistName}
            playlistDesc={playlistDesc}
            playlistCover={playlistCover}
            playlistCoverPrev={playlistCoverPrev}
            playlistId={playlistId}
            playlistTracks={playlistTracks}

            onNameChange={updatePlaylistName}
            onDescChange={updatePlaylistDesc}
            onCoverChange={updatePlaylistCover}
            onCoverPrevChange={updatePlaylistCoverPrev}
            onRemove={removeTrack}
            onTrackChange={updateTrack}
            onReset={resetPlaylist}
            onSave={savePlaylist}

            isPlaying={isPlaying}
            isEmpty={isEmpty}

            currentTrack={currentTrack}
            toggleControl={toggleControl}
            
            setPopUp={setPopUp}
            settings={settingsPopUp}
            updateResetOnSave={updateResetOnSave}
            resetOnSave={resetOnSave}
          />
        </div>
      </div>
      <footer>
        <div className={styles["Footer-container"]}><img src={githubLogo} /><p><a href="https://github.com/kclout/Jammming" target="_blank" title="v1.0.0">v1.0.0</a> by <a href="https://kclout.github.io" target="_blank" title="kclout">kclout</a></p></div>
        <button className={styles.faCopyright} onClick={() => setPopUp({ title: "Copyright Information", comp: Copyright, props: null, message: null, size: "lg"})} title="Copyright"><FontAwesomeIcon icon={faCopyright} size="xl" /></button>
      </footer>
    </div>
  );
}

export default App;