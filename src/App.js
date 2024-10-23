import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm/SearchForm';
import FilterForm from './components/FilterForm/FilterForm';
import styles from './App.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas, faLocationDot } from '@fortawesome/free-solid-svg-icons';

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
    const message = encodeURIComponent("Hola!");
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
                  <div className={styles.card}>
                    <div className={styles.cardContent}>
                      <h3 className={styles.businessTitle}>{business.title}</h3>
                      <h3 className={styles.cardAddress}>
                        <FontAwesomeIcon icon={faLocationDot} style={{color:'white', paddingRight: '5px'}} />{business.address}
                      </h3>  
                      <ul className={styles.cardFeatures}>
                        <li> <span style={{backgroundColor:'#ccc', padding:'5px',fontSize:'13px',
                           borderRadius:'10px', fontWeight:'800', textTransform:'uppercase'}}>Categoría: </span>{business.category}</li>
                        <li> <span style={{backgroundColor:'#ccc', padding:'5px',fontSize:'13px',
                           borderRadius:'10px', fontWeight:'800', textTransform:'uppercase'}}>Website: </span> {business.website}</li>
                        <li><span style={{backgroundColor:'#ccc', padding:'2px',fontSize:'13px', marginBottom:'150px',
                           borderRadius:'10px', fontWeight:'800', textTransform:'uppercase', marginTop:'10px'}}>Número telefónico:</span>  {business.phone_num || 'Teléfono no disponible'}</li>
                      </ul>
                      <div className={styles.cardActions}>
          {business.website && (
            <button className={styles.websiteButton}>
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.businessLink}
              >
              <FontAwesomeIcon icon={faGlobeAmericas} />
              </a>
            </button>
          )}
          {business.phone_num && (
            <button className={styles.businessButtonW}>
              <a
                href={createWhatsAppLink(business.phone_num)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.whatsappButton}`}
              >
              </a>
            </button>
          )}
        </div>
            </div>
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