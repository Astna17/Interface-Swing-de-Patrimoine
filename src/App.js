import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './App.css';

Chart.register(...registerables);

const App = () => {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [checkboxValues, setCheckboxValues] = useState([false, false, false, false]);
    const firstCheckboxRef = useRef(null);
    const chartRef = useRef(null); 
    const chartInstanceRef = useRef(null); 

    const handleUpdate = () => {
        if (!dateFrom || !dateTo || dateFrom > dateTo) {
            alert("Veuillez sélectionner une plage de dates valide.");
            return;
        }
        console.log('Mise à jour:', { dateFrom, dateTo, checkboxValues });
        createChart(); 
    };

    const handleCheckboxChange = (index) => {
        const newCheckboxValues = [...checkboxValues];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues(newCheckboxValues);
    };

    useEffect(() => {
        firstCheckboxRef.current.focus();
    }, []);

    const checkboxLabels = ['Agrégat', 'Trésorerie', 'Immobilisation', 'Obligation'];
    const createChart = () => {
      const ctx = chartRef.current.getContext('2d');
  
      const dataMap = {
          '2024-07-01': 1000,
          '2024-07-05': 2000,
          '2024-07-10': 3000,
          '2024-07-15': 4000,
          '2024-07-20': 5000,
          '2024-07-25': -2000,
          '2024-07-30': -4000,
          '2024-08-01': -6000,
          '2024-08-05': -8000,
      };
  
      const filteredDataMap = Object.fromEntries(
          Object.entries(dataMap).filter(([date]) => date >= dateFrom && date <= dateTo)
      );
  
      const labels = Object.keys(filteredDataMap);
      const dataValues = labels.map(date => filteredDataMap[date]);
  
      const chartData = {
          labels: labels,
          datasets: [{
              label: 'Valeurs dynamiques',
              data: dataValues,
              fill: false, 
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              tension: 0.1, 
          }],
      };
  
      
      if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
      }
  
      chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
              scales: {
                  y: {
                      beginAtZero: false,
                      min: -8000,
                      max: 10000,
                      ticks: {
                          stepSize: 2000,
                      },
                  },
                  x: {
                      type: 'time',
                      time: {
                          unit: 'day',
                          tooltipFormat: 'YYYY-MM-DD',
                          displayFormats: {
                              day: 'YYYY-MM-DD', 
                          },
                      },
                      title: {
                          display: true,
                          text: 'Dates',
                      },
                      min: dateFrom, 
                      max: dateTo,
                  },
              },
          },
      });
  };
  
  
  
    return (
        <div className="container">
            <div className="header">
                <h1>Patrimoine</h1>
                <h2>Utilisateur</h2>
            </div>
            
            <div className="entrees">
                <h2>Entrées</h2>
                <label htmlFor="dateFrom">De: </label>
                <input
                    type="date"
                    id="dateFrom"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                />

                <label htmlFor="dateTo">À: </label>
                <input
                    type="date"
                    id="dateTo"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                />

                <div className="checkbox-group">
                    {checkboxValues.map((isChecked, index) => (
                        <div key={index} className="checkbox-item">
                            <input
                                type="checkbox"
                                ref={index === 0 ? firstCheckboxRef : null}
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <label>{checkboxLabels[index]}</label>
                        </div>
                    ))}
                </div>

                <button onClick={handleUpdate}>Mettre à jour</button>
            </div>

            <div className="sorties">
                <div className="sortie-texte">
                    <h2>Sorties 1/2</h2>
                    <div id="sortie-text-content">
                        <p>[2024-07-11] Flux...</p>
                    </div>
                </div>

                <div className="sortie-graphique">
                    <h2>Sorties 2/2</h2>
                    <canvas id="chart" ref={chartRef} width="400" height="200"></canvas>
                </div>
            </div>
        </div>
    );
};

export default App;
