import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgressTable.css'; // Importando o arquivo CSS
import Filter from './filter'; // Importando o componente de filtro

const ProgressTable = () => {
  const [weeks, setWeeks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);

  // Filtros
  const [pesquisa, setPesquisa] = useState('');
  const [sector, setSector] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Recupera o token armazenado no localStorage
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

        // Faz a requisição GET com o Axios e o token no cabeçalho
        const response = await axios.get(
          'https://sonil-dev.void.co.mz/api/v4/last-week/de190ded-d23c-410c-89ac-89faf4dfb36a?=&_limit=10',
          config
        );

        const data = response.data.data;

        if (data?.weeksList) {
          setWeeks(data.weeksList); // Define as semanas
        }

        if (data?.technicians) {
          setTechnicians(data.technicians); // Define os técnicos
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchData(); // Chama a função para buscar os dados assim que o componente for montado
  }, []);

  useEffect(() => {
    // Aplica os filtros nos técnicos
    const filtered = technicians.filter((technician) => {
      const matchesPesquisa = technician.technician_name.toLowerCase().includes(pesquisa.toLowerCase());
      const matchesSector = sector ? technician.sector === sector : true;
      const matchesArea = area ? technician.area_name === area : true;

      return matchesPesquisa && matchesSector && matchesArea;
    });

    setFilteredTechnicians(filtered); // Atualiza os técnicos filtrados
  }, [pesquisa, sector, area, technicians]);

  // Função para normalizar a data sem hora, minuto ou segundo
  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Função para verificar se duas datas estão na mesma semana
  const mesmaSemana = (weekStart, weekDate) => {
    // Normaliza as datas
    const normalizedWeekStart = normalizeDate(new Date(weekStart));
    const normalizedWeek = normalizeDate(new Date(weekDate));

    // Calcula a diferença em milissegundos
    const diferenca = Math.abs(normalizedWeekStart.getTime() - normalizedWeek.getTime());

    // Verifica se a diferença é menor ou igual a 7 dias
    const seteDiasEmMs = 7 * 24 * 60 * 60 * 1000;
    return diferenca <= seteDiasEmMs;
  };

  return (
    <div>
      <Filter onFilterChange={(pesquisa, sector, area) => {
        setPesquisa(pesquisa);
        setSector(sector);
        setArea(area);
      }} />

      <table>
        <thead>
          <tr>
            <th>Sector</th>
            <th>Área Técnico</th>
            <th>Técnico</th>
            {weeks.map((week, index) => (
              <th key={index}>Semana {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTechnicians.map((technician) => (
            <tr key={technician.technician_id}>
              <td>{technician.sector}</td>
              <td>{technician.area_name}</td>
              <td>{technician.technician_name}</td>
              
              {weeks.map((week) => {
                const totalRecordsForWeek = technician.weeks
                  .filter((w) => {
                    const weekStartDate = w.week_start;
                    const weekDate = week; // A data da semana

                    // Verifica se as semanas são a mesma
                    const isSameWeek = mesmaSemana(weekStartDate, weekDate);
                    return isSameWeek;
                  })
                  .reduce((total, w) => total + w.total_records, 0);

                return (
                  <td key={week}>
                    {totalRecordsForWeek || 0}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressTable;
