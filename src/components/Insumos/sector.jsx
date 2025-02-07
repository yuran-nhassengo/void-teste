import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente de Filtro
const Filter = ({ onFilterChange }) => {
  const [sector, setSector] = useState('');
  const [area, setArea] = useState('');

  const handleFilterChange = () => {
    onFilterChange(sector, area);
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
  const [sector, setSector] = useState([]);
  const [filteredSectors, setFilteredSectors] = useState([]);
  const [sectorFilter, setSectorFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Token não encontrado no localStorage');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('https://sonil-dev.void.co.mz/api/v4/analytics/farm-inputs/23e9336a-b20a-4478-a58f-875cc065e871?offset=1&limit=10?&filter=&phase=nurseries', config);
        const { data } = response;
        const { sectors } = data.data;

        setSector(sectors);
        setFilteredSectors(sectors);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = sector.filter((sectorItem) => {
      const matchesSector = sectorFilter ? sectorItem.name === sectorFilter : true;
      const matchesArea = areaFilter ? sectorItem.insertedPackages.includes(areaFilter) : true;
      return matchesSector && matchesArea;
    });
    setFilteredSectors(filtered);
  }, [sectorFilter, areaFilter, sector]);

  // Função para garantir que qualquer valor inválido seja tratado como 0
  const safeValue = (value) => {
    const numValue = Number(value);  // Conversão explícita para número
    return isNaN(numValue) ? 0 : numValue;  // Retorna 0 se não for um número válido
  };

  // Função para calcular o total de distribuídos e recebidos para um pacote específico
  const calculateWeekTotal = (packages, week) => {
    let totalDistribuido = 0;
    let totalRecebido = 0;

    packages.forEach(pkg => {
      const sentValue = safeValue(pkg.sent);  // Garantir que está pegando o valor correto de sent
      const receivedValue = safeValue(pkg.received);  // Converte a string para número
       
      if (week === 'X') {
        if (pkg.name === "Semente X") {
          totalDistribuido += sentValue;
          totalRecebido += receivedValue;
        }
      } else if (week === 'Y') {
        if (pkg.name === "Semente Y") {
          totalDistribuido += sentValue;
          totalRecebido += receivedValue;
        }
      }
    });

    return { totalDistribuido, totalRecebido };
  };

  // Função para calcular o total geral de todos os setores (semana X e Y)
  const calculateGrandTotal = (sectors) => {
    let grandTotalDistribuidoX = 0;
    let grandTotalRecebidoX = 0;
    let grandTotalDistribuidoY = 0;
    let grandTotalRecebidoY = 0;

    sectors.forEach(sectorItem => {
      const totalsX = calculateWeekTotal(sectorItem.packages, 'X');
      const totalsY = calculateWeekTotal(sectorItem.packages, 'Y');

      grandTotalDistribuidoX += totalsX.totalDistribuido;
      grandTotalRecebidoX += totalsX.totalRecebido;
      grandTotalDistribuidoY += totalsY.totalDistribuido;
      grandTotalRecebidoY += totalsY.totalRecebido;
    });

    return {
      grandTotalDistribuidoX,
      grandTotalRecebidoX,
      grandTotalDistribuidoY,
      grandTotalRecebidoY
    };
  };

  const {
    grandTotalDistribuidoX,
    grandTotalRecebidoX,
    grandTotalDistribuidoY,
    grandTotalRecebidoY
  } = calculateGrandTotal(filteredSectors);

  // Função para formatar os números sem casas decimais e sem zeros extras
  const formatNumber = (number) => {
    return Math.round(safeValue(number));  // Arredonda e remove casas decimais extras
  };

  return (
    <div>
      <h2>Tabela de Setores</h2>
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
            <th>Total</th> {/* Coluna de Total */}
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
            <th></th> {/* Coluna de Total vazia */}
          </tr>
        </thead>
        <tbody>
          {filteredSectors.map((sectorItem) => (
            <tr key={sectorItem.name}>
              <td>{sectorItem.name}</td>
              <td>Agricultura</td>
              <td>Técnico X</td>
              <td>Produtor A</td>

              {/* Semana X */}
              <td>{formatNumber(sectorItem.packages.reduce((sum, pkg) => sum + (pkg.name === "Semente X" ? safeValue(pkg.sent) : 0), 0))}</td>
              <td>{formatNumber(sectorItem.packages.reduce((sum, pkg) => sum + (pkg.name === "Semente X" ? safeValue(pkg.received) : 0), 0))}</td>

              {/* Semana Y */}
              <td>{formatNumber(sectorItem.packages.reduce((sum, pkg) => sum + (pkg.name === "Semente Y" ? safeValue(pkg.sent) : 0), 0))}</td>
              <td>{formatNumber(sectorItem.packages.reduce((sum, pkg) => sum + (pkg.name === "Semente Y" ? safeValue(pkg.received) : 0), 0))}</td>

              <td>
                {/* Total Geral para cada setor */}
                {formatNumber(sectorItem.packages.reduce((sum, pkg) => sum + safeValue(pkg.sent) + safeValue(pkg.received), 0))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4"><strong>Total Geral</strong></td>
            <td><strong>{formatNumber(grandTotalDistribuidoX)}</strong></td>
            <td><strong>{formatNumber(grandTotalRecebidoX)}</strong></td>
            <td><strong>{formatNumber(grandTotalDistribuidoY)}</strong></td>
            <td><strong>{formatNumber(grandTotalRecebidoY)}</strong></td>
            <td><strong>{formatNumber(grandTotalDistribuidoX + grandTotalRecebidoX + grandTotalDistribuidoY + grandTotalRecebidoY)}</strong></td> {/* Total Geral */}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SectorTable;
