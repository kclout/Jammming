import React, { useState } from 'react';

import styles from './SearchBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function SearchBar(props) {
  const [term, setTerm] = useState('');

  function handleTermChange({target}) {
    setTerm(target.value);
  }

  function passTerm() {
    props.onSearch(term);
  }

  return (
    <div className={styles.SearchBar}>
      <input onChange={handleTermChange} placeholder="Enter A Song, Album, or Artist" />
      <button onClick={passTerm}><FontAwesomeIcon icon={faMagnifyingGlass} size="lg" /></button>
    </div>
  );
}

export default SearchBar;