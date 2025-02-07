import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente de Filtro
const Filter = ({ onFilterChange }) => {
  const [sector, setSector] = useState('');
  const [area, setArea] = useState('');

  const handleFilterChange = () => {
    onFilterChange(sector, area); // Passa os filtros para o componente pai
  };

  return (
    <div>
      <div>
        <label>Setor:</label>
        <select onChange={(e) => setSector(e.target.value)} value={sector}>
          <option value="">Selecione um Setor</option>
          <option value="Lalaue">Lalaue</option>
          <option value="Malema">Malema</option>
          <option value="Ribaue">Ribaue</option>
        </select>
      </div>
      <div>
        <label>Área:</label>
        <select onChange={(e) => setArea(e.target.value)} value={area}>
          <option value="">Selecione uma Área</option>
          <option value="Agricultura">Agricultura</option>
          <option value="Comércio">Comércio</option>
        </select>
      </div>
      <button onClick={handleFilterChange}>Filtrar</button>
    </div>
  );
};

// Componente de Tabela
const SectorTable = () => {
  const [sectors, setSectors] = useState([]);
  const [filteredSectors, setFilteredSectors] = useState([]);
  const [sectorFilter, setSectorFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Token não encontrado no localStorage');
          return;
        }

        // Configura o cabeçalho com o token de autenticação
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('https://sonil-dev.void.co.mz/api/v4/analytics/farm-inputs/23e9336a-b20a-4478-a58f-875cc065e871?offset=1&limit=10&filter=&phase=nurseries',config);
        const data = response.data.data;
        setSectors(data.sectors);
        setFilteredSectors(data.sectors);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = sectors.filter((sector) => {
      const matchesSector = sectorFilter ? sector.name === sectorFilter : true;
      const matchesArea = areaFilter ? sector.insertedPackages.includes(areaFilter) : true;
      return matchesSector && matchesArea;
    });
    setFilteredSectors(filtered);
  }, [sectorFilter, areaFilter, sectors]);

  return (
    <div>
      <h2>Tabela de Setores</h2>
      {/* Filtro */}
      <Filter onFilterChange={(sector, area) => {
        setSectorFilter(sector);
        setAreaFilter(area);
      }} />

      <table border="1">
        <thead>
          <tr>
            <th>Setor</th>
            <th>Área</th>
            <th>Técnico</th>
            <th>Produtor</th>
            <th colSpan="2">Semana X</th>
            <th colSpan="2">Semana Y</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>Distribuídos</th>
            <th>Recebidos</th>
            <th>Distribuídos</th>
            <th>Recebidos</th>
          </tr>
        </thead>
        <tbody>
          {filteredSectors.map((sector) => (
            <tr key={sector.name}>
              {/* Setor, Área, Técnico, Produtor */}
              <td>{sector.name}</td>
              <td>Agricultura</td>
              <td>Técnico X</td>
              <td>Produtor A</td>

              {/* Semana X: Distribuídos e Recebidos */}
              <td>
                {sector.packages.map(pkg => {
                  if (pkg.name === "Semente X") {
                    return (
                      <div key={pkg.id}>
                        {pkg.sent} {/* Distribuídos */}
                      </div>
                    );
                  }
                  return null;
                })}
              </td>
              <td>
                {sector.packages.map(pkg => {
                  if (pkg.name === "Semente X") {
                    return (
                      <div key={pkg.id}>
                        {pkg.received} {/* Recebidos */}
                      </div>
                    );
                  }
                  return null;
                })}
              </td>

              {/* Semana Y: Distribuídos e Recebidos */}
              <td>
                {sector.packages.map(pkg => {
                  if (pkg.name === "Semente Y") {
                    return (
                      <div key={pkg.id}>
                        {pkg.sent} {/* Distribuídos */}
                      </div>
                    );
                  }
                  return null;
                })}
              </td>
              <td>
                {sector.packages.map(pkg => {
                  if (pkg.name === "Semente Y") {
                    return (
                      <div key={pkg.id}>
                        {pkg.received} {/* Recebidos */}
                      </div>
                    );
                  }
                  return null;
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectorTable;
