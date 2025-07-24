import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ patient: '', doctor: '', date: '', time: '' });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchAppointments = async () => {
    const res = await axios.get('/api/accounts/receptionist/appointments/');
    setAppointments(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('/api/accounts/csrf/'); // ensures cookie
    const users = await axios.get('/api/accounts/doctors/');
    setDoctors(users.data);
    const patientsRes = await axios.get('/api/accounts/receptionist/patients/');
    setPatients(patientsRes.data);
  };

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `/api/accounts/receptionist/appointments/update/${editingId}/`
      : '/api/accounts/receptionist/appointments/create/';
    const method = editingId ? 'put' : 'post';

    try {
      await axios[method](url, formData, {
        headers: { 'X-CSRFToken': document.cookie.split('csrftoken=')[1] },
        withCredentials: true
      });
      setMessage(editingId ? 'Appointment updated' : 'Appointment created');
      setFormData({ patient: '', doctor: '', date: '', time: '' });
      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      setMessage('Error saving appointment');
    }
  };

  const handleEdit = (appt) => {
    setFormData({
      patient: patients.find(p => p.name === appt.patient)?.id || '',
      doctor: doctors.find(d => d.username === appt.doctor)?.id || '',
      date: appt.date,
      time: appt.time,
    });
    setEditingId(appt.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/accounts/receptionist/appointments/delete/${id}/`, {
        headers: {
          'X-CSRFToken': document.cookie.split('csrftoken=')[1]
        },
        withCredentials: true
      });
      fetchAppointments();
      setMessage('Appointment deleted');
    } catch (err) {
      console.error('❌ Delete failed:', err.response?.data || err.message);
      setMessage('Failed to delete appointment.');
    }
  };
  

  return (
    <Layout role="receptionist">
      <div className="dashboard-content">
        <h2>Receptionist Dashboard</h2>
        {message && <p className="message">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Appointment' : 'Create Appointment'}</h3>

          <select
            className="input-field"
            value={formData.patient}
            onChange={e => setFormData({ ...formData, patient: e.target.value })}
            required
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            className="input-field"
            value={formData.doctor}
            onChange={e => setFormData({ ...formData, doctor: e.target.value })}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <input
            type="date"
            className="input-field"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <input
            type="time"
            className="input-field"
            value={formData.time}
            onChange={e => setFormData({ ...formData, time: e.target.value })}
            required
          />

          <button className="btn-primary" type="submit">
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>

        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={index}>
                <td>{appt.patient}</td>
                <td>{appt.doctor}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  <button onClick={() => handleEdit(appt)} className="btn-secondary">Edit</button>{' '}
                  <button onClick={() => handleDelete(appt.id)} className="btn-secondary">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default ReceptionistDashboard;
