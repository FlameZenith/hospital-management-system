import { useState, useEffect } from 'react';
import axios from 'axios';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/patients', form);
      fetchPatients();
      setForm({ firstName: '', lastName: '', phone: '', email: '' });
    } catch (err) {
      console.error(err);
      alert("Error adding patient. See console.");
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Patient Registry</h1>
      </div>

      <div className="card" style={{marginBottom: '24px'}}>
        <h3>Register New Patient</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <button type="submit">Add Patient</button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>P-00{p.id}</td>
              <td>{p.firstName} {p.lastName}</td>
              <td>{p.phone}</td>
              <td>{p.email}</td>
            </tr>
          ))}
          {patients.length === 0 && (
             <tr><td colSpan="4">No patients registered.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;
