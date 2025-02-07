import React, { useState } from 'react';

const Filter = ({ onFilterChange }) => {
  const [pesquisa, setPesquisa] = useState('');
  const [sector, setSector] = useState('');
  const [area, setArea] = useState('');

  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value);
    onFilterChange(e.target.value, sector, area); 
  };

  const handleSectorChange = (e) => {
    setSector(e.target.value);
    onFilterChange(pesquisa, e.target.value, area); 
  };

  const handleAreaChange = (e) => {
    setArea(e.target.value);
    onFilterChange(pesquisa, sector, e.target.value); 
  };

  return (
    <div>
      {/* Campo de pesquisa */}
      <input 
        type="text" 
        placeholder="Pesquisar Técnico" 
        value={pesquisa}
        onChange={handlePesquisaChange}
      />

      <div>
        {/* Primeiro select - Sector */}
        <select value={sector} onChange={handleSectorChange}>
          <option value="">Todos Sectores</option>
          <option value="Ribaue">Ribaue</option>
          <option value="Malema">Malema</option>
        </select>
      </div>

      <div>
        {/* Segundo select - Área */}
        <select value={area} onChange={handleAreaChange}>
          <option value="">Todas Areas</option>
          <option value="Lalaue">Lalaue</option>
          <option value="Satique">Satique</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
