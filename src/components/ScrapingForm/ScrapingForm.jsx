import React, { useState } from 'react';
import axios from 'axios';

const ScrapingForm = () => {
  const [url, setUrl] = useState('');
  const [emails, setEmails] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/scrape', { url });
      setEmails(response.data.emails);
    } catch (error) {
      console.error('Error al obtener correos:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ingresa la URL"
        />
        <button type="submit">Obtener Correos</button>
      </form>

      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScrapingForm;
