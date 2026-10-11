import { useState, useEffect } from 'react';
import './App.css';

interface Station {
  id: number;
  name: string;
  status: 'libre' | 'ocupado' | 'bloqueado';
  queue: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'dashboard'>('simulation');
  
  const [arrivalRate, setArrivalRate] = useState<number>(2);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalTicks, setTotalTicks] = useState<number>(0);

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);

  const [stations, setStations] = useState<Station[]>([
    { id: 1, name: 'Llegada', status: 'libre', queue: 0 },
    { id: 2, name: 'Aspirado', status: 'libre', queue: 0 },
    { id: 3, name: 'Lavado', status: 'libre', queue: 0 },
    { id: 4, name: 'Secado', status: 'libre', queue: 0 },
  ]);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTotalTicks((prev) => prev + 1);

        setStations((prevStations) =>
          prevStations.map((station) => {
            const rand = Math.random();
            let newStatus: 'libre' | 'ocupado' | 'bloqueado' = 'libre';
            if (rand < 0.4) newStatus = 'libre';
            else if (rand < 0.8) newStatus = 'ocupado';
            else newStatus = 'bloqueado';

            return {
              ...station,
              status: newStatus,
              queue: newStatus !== 'libre' ? Math.floor(Math.random() * 5) : 0,
            };
          })
        );

        setTotalInvoices((prev) => prev + 1);
        setTotalIncome((prev) => prev + 15.00);
      }, 1000 / simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  const handleReset = () => {
    setIsRunning(false);
    setTotalTicks(0);
    setTotalIncome(0);
    setTotalInvoices(0);
    setStations([
      { id: 1, name: 'Llegada', status: 'libre', queue: 0 },
      { id: 2, name: 'Aspirado', status: 'libre', queue: 0 },
      { id: 3, name: 'Lavado', status: 'libre', queue: 0 },
      { id: 4, name: 'Secado', status: 'libre', queue: 0 },
    ]);
  };

  const bottleneckStation = stations.reduce((max, s) => (s.queue > max.queue ? s : max), stations[0]);
  const busyCount = stations.filter((s) => s.status === 'ocupado').length;
  const avgUtilization = Math.round((busyCount / stations.length) * 100);

  return (
    <div className="app-container">
      {/* Barra de Navegación Superior */}
      <nav className="navbar">
        <div className="nav-brand">🚗 Autolavado Pro</div>
        <div className="nav-menu">
          <button 
            className={`nav-btn ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            Simulación
          </button>
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard Ejecutivo
          </button>
        </div>
      </nav>

      {/* Contenido según la página activa */}
      <main className="main-content">
        {activeTab === 'simulation' ? (
          <div>
            <h1 className="view-title">Simulación de Estaciones</h1>
            <p className="view-subtitle">Monitorea en tiempo real el flujo vehicular y el estado de las 4 fases.</p>
            
            <div className="card-grid">
              {/* Panel de Control */}
              <section className="card">
                <h2>Panel de Control</h2>
                <div className="control-group">
                  <label htmlFor="arrivalRate">Tasa de Llegada (veh/min)</label>
                  <input
                    id="arrivalRate"
                    type="number"
                    value={arrivalRate}
                    onChange={(e) => setArrivalRate(Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="control-group">
                  <label>Velocidad de Simulación</label>
                  <div className="speed-box">
                    <button 
                      className="speed-action" 
                      onClick={() => setSimulationSpeed((prev) => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 'bold' }}>{simulationSpeed}x</span>
                    <button 
                      className="speed-action" 
                      onClick={() => setSimulationSpeed((prev) => Math.min(5, prev + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  {!isRunning ? (
                    <button className="btn btn-start" onClick={() => setIsRunning(true)}>Iniciar</button>
                  ) : (
                    <button className="btn btn-pause" onClick={() => setIsRunning(false)}>Pausar</button>
                  )}
                  <button className="btn btn-reset" onClick={handleReset}>Reiniciar</button>
                </div>
              </section>

              {/* Vista de Estaciones */}
              <section className="card">
                <h2>Estaciones Activas (4 Fases)</h2>
                <div className="stations-container">
                  {stations.map((station, index) => (
                    <div key={station.id} className="station-card">
                      <div>
                        <div className="station-top">
                          <span className="station-id">0{index + 1}</span>
                          <span className="station-title">{station.name}</span>
                        </div>
                        <span className={`badge ${station.status}`}>
                          {station.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="queue-pill">
                        <span>Cola actual:</span>
                        <strong>{station.queue} veh</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="legend-box">
                  <span><i className="legend-dot verde"></i> Libre</span>
                  <span><i className="legend-dot rojo"></i> Ocupado</span>
                  <span><i className="legend-dot amarillo"></i> Bloqueado</span>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="view-title">Dashboard Ejecutivo</h1>
            <p className="view-subtitle">Métricas financieras, rendimiento operativo y análisis de cuellos de botella.</p>
            
            <div className="dashboard-grid">
              <div className="kpi-card">
                <div className="kpi-label">Total de Ingresos</div>
                <div className="kpi-value">${totalIncome.toFixed(2)}</div>
              </div>

              <div className="kpi-card success">
                <div className="kpi-label">Facturas Totales</div>
                <div className="kpi-value">{totalInvoices}</div>
              </div>

              <div className="kpi-card warning">
                <div className="kpi-label">Cuello de Botella Detectado</div>
                <div className="kpi-value" style={{ fontSize: '1.4rem', paddingTop: '4px' }}>
                  {bottleneckStation.queue > 0 ? `${bottleneckStation.name} (${bottleneckStation.queue} veh)` : 'Ninguno'}
                </div>
              </div>

              <div className="kpi-card purple">
                <div className="kpi-label">Utilización Promedio</div>
                <div className="kpi-value">{avgUtilization}%</div>
              </div>
            </div>

            <div className="dashboard-details">
              <div>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '4px' }}>Tiempo Promedio Total de Servicio</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Calculado en base a los ciclos de ejecución actuales.</p>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2563eb' }}>
                {(totalTicks * 1.3).toFixed(1)} min
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}