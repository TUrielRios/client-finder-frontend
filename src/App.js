import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm/SearchForm';
import FilterForm from './components/FilterForm/FilterForm';
import styles from './App.module.css';

const App = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true); // Inicia la carga
    try {
      const response = await fetch('http://localhost:3000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
  
      const data = await response.json();
      setBusinesses(data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };
  

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    const applyFilter = () => {
      if (filter === 'all') {
        setFilteredBusinesses(businesses);
      } else if (filter === 'noWebsite') {
        setFilteredBusinesses(businesses.filter(business => !business.website));
      } else if (filter === 'socialOnly') {
        setFilteredBusinesses(businesses.filter(business => 
          business.website && (
            business.website.includes('instagram.com') || 
            business.website.includes('facebook.com')
          )
        ));
      }
    };

    applyFilter();
  }, [businesses, filter]);

  const createWhatsAppLink = (phoneNumber) => {
    if (!phoneNumber) return null;
    
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent('Hola, me gustaría obtener más información sobre sus servicios.');
    return `https://wa.me/${cleanPhoneNumber}?text=${message}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Client Finder</h1>
      </header>
      <main className={styles.mainContent}>
        <SearchForm onSearch={handleSearch} />
        <FilterForm onFilterChange={handleFilterChange} />
        {loading ? (
    <p className={styles.loadingMessage}>Buscando negocios...</p>  // Mensaje de carga
  ):
  (
    <div className={styles.results}>
          {filteredBusinesses.length > 0 && (
            <ul className={styles.businessList}>
              {filteredBusinesses.map((business, index) => (
                <li key={index} className={styles.businessItem}>
                  <div className={styles.businessHeader}>
                    <h3 className={styles.businessTitle}>{business.title}</h3>

                  </div>
                  <p className={styles.businessDescription}>{business.description}</p>
                  <ul className={styles.businessFeatures}>
                    <li>Website: {business.website}</li>
                    <li>Categoría: {business.category}</li>
                    <li>Dirección: {business.address}</li>
                    <li>Número telefónico: {business.phone_num || 'Teléfono no disponible'}</li>
                  </ul>
                  <div className={styles.contactBusiness}> 
                  <button className={styles.businessButton}>
                  {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" 
                  className={styles.businessButton}>Visitar sitio web</a>)} 
                  </button>
                  <button className={styles.businessButtonW}>
                  {business.phone_num && (
                    <a 
                      href={createWhatsAppLink(business.phone_num)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`${styles.businessButton} ${styles.whatsappButton}`}
                    >
                      Contactar por WhatsApp
                    </a>
                  )}
                  </button>
                  </div>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
  )}
        
      </main>
      <footer className={styles.footer}>
        <p>Desarrollado por Tiziano Rios</p>
      </footer>
    </div>
  );
};

export default App;