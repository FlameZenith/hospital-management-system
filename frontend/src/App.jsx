import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h2>🏥 HMS Admin</h2>
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
          <NavLink to="/patients" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Patients</NavLink>
          <NavLink to="/appointments" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Appointments</NavLink>
          <NavLink to="/billing" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Billing</NavLink>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
