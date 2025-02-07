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
    <div className='flex justify-between space-x-2'>

        
        <div >
         
          <input className='border-2 rounded-sm'
            type="text" 
            placeholder="Pesquisar por....." 
            value={pesquisa}
            onChange={handlePesquisaChange}
          />
          
          </div>

          <div>
        
            <select className='border-2 rounded-sm'>
              <option value="">Registo</option>
              <option value="01">Registo 01</option>
              <option value="02">Registo 02</option>
            </select>
          </div>

          <div >
           
            <select className='border-2 rounded-sm'value={sector} onChange={handleSectorChange}>
              <option value="">Seleciona o Sector</option>
              <option value="Ribaue">Ribaue</option>
              <option value="Malema">Malema</option>
            </select>
          </div>

          <div >
          
            <select className='border-2 rounded-sm' value={area} onChange={handleAreaChange}>
              <option value="">Seleciona a area</option>
              <option value="Lalaue">Lalaue</option>
              <option value="Satique">Satique</option>
            </select>
          </div>
    

    </div>
  );
};

export default Filter;
