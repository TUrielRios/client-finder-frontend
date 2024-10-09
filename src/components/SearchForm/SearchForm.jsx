import React, { useState } from 'react';
import styles from './SearchForm.module.css';

const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Buscar negocios..." 
        className={styles.searchInput} 
      />
      <button type="submit" className={styles.searchButton}>
        <i className="fas fa-search"></i> Buscar
      </button>
    </form>
  );
};

export default SearchForm;
