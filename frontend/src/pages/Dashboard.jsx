import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, revenue: 0 });

  useEffect(() => {
    // Ideally, a /api/dashboard specific endpoint would exist in a real system.
    // For now, we will simulate it by fetching counts directly if we had them or mocking.
    const fetchStats = async () => {
      try {
        const [patientsRes, apptRes, billsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/patients'),
          axios.get('http://localhost:8080/api/appointments'),
          axios.get('http://localhost:8080/api/bills')
        ]);
        
        const patients = patientsRes.data.length;
        const appointments = apptRes.data.length;
        const revenue = billsRes.data
            .filter(b => b.status === 'PAID')
            .reduce((acc, curr) => acc + curr.totalAmount, 0);

        setStats({ patients, appointments, revenue });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Hospital Overview</h1>
      <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Welcome back! Here is what is happening today.</p>
      
      <div className="dashboard-grid">
        <div className="card stat-card">
          <span>Total Patients</span>
          <span className="value">{stats.patients}</span>
        </div>
        <div className="card stat-card">
          <span>Total Appointments</span>
          <span className="value">{stats.appointments}</span>
        </div>
        <div className="card stat-card">
          <span>Total Revenue</span>
          <span className="value">${stats.revenue.toFixed(2)}</span>
        </div>
      </div>
      
      <div style={{marginTop: '40px'}} className="card">
        <h3>System Architecture Check</h3>
        <p>This application is powered by a <strong>Modular Monolith</strong> Spring Boot architecture.</p>
        <p style={{color: 'var(--text-secondary)'}}>
           Notice how the three core domains (Patients, Appointments, Billing) communicate seamlessly internally 
           without network latency, yet maintain strict code boundaries.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
