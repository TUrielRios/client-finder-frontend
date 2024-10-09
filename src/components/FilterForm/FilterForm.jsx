import React from 'react';
import styles from './FilterForm.module.css';

const FilterForm = ({ onFilterChange }) => {
  const handleFilterChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className={styles.filterForm}>
      <label htmlFor="filter">Filtrar por:</label>
      <select id="filter" onChange={handleFilterChange} className={styles.filterSelect}>
        <option value="all">Todos los resultados</option>
        <option value="noWebsite">Sin sitio web</option>
        <option value="socialOnly">Solo redes sociales (Instagram/Facebook)</option>
      </select>
    </div>
  );
};

export default FilterForm;