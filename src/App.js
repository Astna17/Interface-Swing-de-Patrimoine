import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './App.css';

Chart.register(...registerables);

const App = () => {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [checkboxValues, setCheckboxValues] = useState([false, false, false, false]);
    const firstCheckboxRef = useRef(null);
    const chartRef = useRef(null); 

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

    const chartInstanceRef = useRef(null);

    const createChart = () => {
        const ctx = chartRef.current.getContext('2d');
    
        const dataMap = {
            '2024-07-01': { Agrégat: 1000, Trésorerie: 500, Immobilisation: 200, Obligation: 300 },
            '2024-07-05': { Agrégat: 2000, Trésorerie: 1000, Immobilisation: 500, Obligation: 700 },
            '2024-07-10': { Agrégat: 3000, Trésorerie: 1500, Immobilisation: 800, Obligation: 600 },
            '2024-07-15': { Agrégat: 4000, Trésorerie: 2000, Immobilisation: 1000, Obligation: 900 },
            '2024-07-20': { Agrégat: 5000, Trésorerie: 2500, Immobilisation: 1200, Obligation: 1100 },
        };
    
        const labels = Object.keys(dataMap).filter(date => date >= dateFrom && date <= dateTo);
        
        const dataValues = checkboxValues.map((isChecked, index) => 
            labels.map(date => isChecked ? dataMap[date][checkboxLabels[index]] : 0)
        );
    
        const chartData = {
            labels: labels,
            datasets: checkboxValues.map((isChecked, index) => ({
                label: checkboxLabels[index],
                data: isChecked ? dataValues[index] : new Array(labels.length).fill(0),
                backgroundColor: `rgba(54, ${100 + index * 30}, 235, 0.2)`,
                borderColor: `rgba(54, ${100 + index * 30}, 235, 1)`,
                borderWidth: 1,
            })).filter(dataset => dataset.data.some(value => value > 0)), // Supprimer les jeux de données vides
        };
   
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy(); 
        }
   
        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
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
                <canvas id="myChart" ref={chartRef} width="400" height="200"></canvas>
            </div>
            </div>
        </div>
    );
};

export default App;
