import { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorName: '', appointmentDate: '', notes: '' });

  const fetchData = async () => {
    try {
      const [apptRes, patRes] = await Promise.all([
        axios.get('http://localhost:8080/api/appointments'),
        axios.get('http://localhost:8080/api/patients')
      ]);
      setAppointments(apptRes.data);
      setPatients(patRes.data);
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
    if (!form.patientId) return alert("Select a patient first");
    
    try {
      await axios.post(`http://localhost:8080/api/appointments/patient/${form.patientId}`, {
        doctorName: form.doctorName,
        appointmentDate: form.appointmentDate,
        notes: form.notes
      });
      fetchData();
      setForm({ patientId: '', doctorName: '', appointmentDate: '', notes: '' });
    } catch (err) {
      console.error(err);
      alert("Error adding appointment.");
    }
  };
  
  const handleStatusChange = async (id, status) => {
     try {
         await axios.put(`http://localhost:8080/api/appointments/${id}/status?status=${status}`);
         fetchData();
     } catch(e) { console.error(e); }
  }

  return (
    <div>
      <h1>Schedule Appointments</h1>

      <div className="card" style={{marginBottom: '24px'}}>
        <h3>Book New Consultation</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">-- Select Patient --</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>
          <input name="doctorName" placeholder="Doctor Name" value={form.doctorName} onChange={handleChange} required />
          <input type="datetime-local" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required />
          <input name="notes" placeholder="Initial Notes / Symptoms" value={form.notes} onChange={handleChange} />
          <button type="submit">Book Appointment</button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td>A-00{a.id}</td>
              <td>{a.patient?.firstName} {a.patient?.lastName}</td>
              <td>Dr. {a.doctorName}</td>
              <td>{new Date(a.appointmentDate).toLocaleString()}</td>
              <td>{a.notes}</td>
              <td>
                <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
              </td>
              <td style={{display:'flex', gap:'8px'}}>
                 {a.status === 'SCHEDULED' && (
                     <>
                        <button onClick={() => handleStatusChange(a.id, 'COMPLETED')} style={{background: 'var(--success)', padding: '4px 8px', fontSize: '0.8rem'}}>Complete</button>
                        <button onClick={() => handleStatusChange(a.id, 'CANCELLED')} className="danger" style={{padding: '4px 8px', fontSize: '0.8rem'}}>Cancel</button>
                     </>
                 )}
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
             <tr><td colSpan="7">No appointments.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
