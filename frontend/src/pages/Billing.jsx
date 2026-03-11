import { useState, useEffect } from 'react';
import axios from 'axios';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientId: '', appointmentId: '', amount: '' });

  const fetchData = async () => {
    try {
      const [b, p, a] = await Promise.all([
        axios.get('http://localhost:8080/api/bills'),
        axios.get('http://localhost:8080/api/patients'),
        axios.get('http://localhost:8080/api/appointments')
      ]);
      setBills(b.data);
      setPatients(p.data);
      setAppointments(a.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.appointmentId) return alert("Select patient and appointment");
    
    try {
      await axios.post(`http://localhost:8080/api/bills/generate?patientId=${form.patientId}&appointmentId=${form.appointmentId}&amount=${form.amount}`);
      fetchData();
      setForm({ patientId: '', appointmentId: '', amount: '' });
    } catch (err) {
      console.error(err);
      alert("Error generating bill.");
    }
  };
  
  const handlePay = async (id) => {
     try {
         await axios.put(`http://localhost:8080/api/bills/${id}/pay`);
         fetchData();
     } catch(e) { console.error(e); }
  }

  // Filter appointments to only those for the selected patient
  const filteredAppointments = form.patientId ? appointments.filter(a => a.patient.id.toString() === form.patientId) : [];

  return (
    <div>
      <h1>Billing & Finance</h1>

      <div className="card" style={{marginBottom: '24px'}}>
        <h3>Generate Patient Bill</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">-- Select Patient --</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
          <select name="appointmentId" value={form.appointmentId} onChange={handleChange} required disabled={!form.patientId}>
            <option value="">-- Select Appointment --</option>
            {filteredAppointments.map(a => <option key={a.id} value={a.id}>A-00{a.id} ({new Date(a.appointmentDate).toLocaleDateString()})</option>)}
          </select>
          <input type="number" step="0.01" name="amount" placeholder="Total Amount ($)" value={form.amount} onChange={handleChange} required />
          <button type="submit">Generate Bill</button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Patient</th>
            <th>Date Generated</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(b => (
            <tr key={b.id}>
              <td>INV-00{b.id}</td>
              <td>{b.patient?.firstName} {b.patient?.lastName}</td>
              <td>{new Date(b.generatedAt).toLocaleString()}</td>
              <td>${b.totalAmount.toFixed(2)}</td>
              <td>
                <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
              </td>
              <td>
                 {b.status === 'UNPAID' && (
                     <button onClick={() => handlePay(b.id)} style={{background: 'var(--accent-color)', padding: '6px 12px', fontSize: '0.8rem'}}>Process Payment</button>
                 )}
                 {b.status === 'PAID' && (
                     <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Paid ✓</span>
                 )}
              </td>
            </tr>
          ))}
          {bills.length === 0 && (
             <tr><td colSpan="6">No bills generated yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Billing;
