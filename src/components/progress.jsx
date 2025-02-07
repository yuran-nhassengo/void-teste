import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgressTable.css'; // Importando o arquivo CSS

const ProgressTable = () => {
  const [weeks, setWeeks] = useState([]);
  const [technicians, setTechnicians] = useState([]);

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

        // A resposta está no campo data.data
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

  // Função para normalizar a data sem hora, minuto ou segundo
  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  return (
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
        {technicians.map((technician) => (
          <tr key={technician.technician_id}>
            <td>{technician.sector}</td>
            <td>{technician.area_name}</td>
            <td>{technician.technician_name}</td>
            
            {weeks.map((week) => {
              // Calcula o total de records da mesma semana
              const totalRecordsForWeek = technician.weeks
                .filter((w) => {
                  const weekStartDate = new Date(w.week_start);
                  const weekDate = new Date(week);

                  // Normaliza as datas
                  const normalizedWeekStartDate = normalizeDate(weekStartDate);
                  const normalizedWeekDate = normalizeDate(weekDate);

                  // Compara as semanas (sem hora)
                  const isSameWeek = normalizedWeekStartDate.getTime() === normalizedWeekDate.getTime();

                  // Log para mostrar as comparações
                  console.log(`Filtrando semana ${week} - Semana de ${w.week_start}: ${isSameWeek ? 'Mesma semana' : 'Semana diferente'}`);

                  return isSameWeek;
                })
                .reduce((total, w) => {
                  // Log para mostrar os records sendo somados
                  console.log(`Somando records para semana ${week}: ${w.total_records}`);
                  return total + w.total_records;
                }, 0); // Soma os total_records de todas as semanas que coincidem

              console.log(`Total de records para a semana ${week}: ${totalRecordsForWeek}`);

              return (
                <td key={week}>
                  {/* Exibe a soma dos records para a semana, ou 0 se não houver dados */}
                  {totalRecordsForWeek || 0}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProgressTable;
