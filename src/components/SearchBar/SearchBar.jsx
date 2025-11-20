import React, { useState } from 'react';

import styles from './SearchBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function SearchBar(props) {
  const [term, setTerm] = useState("");

  function handleTermChange({target}) {
    setTerm(target.value);
  }

  function passTerm() {
    props.onSearch(term);
  }

  function handleEnterKeyDown(event) {
    if(event.key === 'Enter') {
      passTerm();
    }
  }

  return (
    <div className={styles.SearchBar}>
      <input onChange={handleTermChange} onKeyDown={handleEnterKeyDown} placeholder="Enter A Song, Album, or Artist" />
      <button onClick={passTerm} title="Search"><FontAwesomeIcon icon={faMagnifyingGlass} size="lg" /></button>
    </div>
  );
}

export default SearchBar;