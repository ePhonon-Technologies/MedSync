import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';
import '../styles/main.css';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const csrfToken = Cookies.get('csrftoken');

    axios.get('http://localhost:8000/api/accounts/appointments/mine/', {
      withCredentials: true,
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken')
      }
    })
    .then(res => setAppointments(res.data))
    .catch(err => console.error('Error fetching appointments:', err));
  }, []);

  return (
    <Layout role="patient">
      <div className="appointments-container">
        <h2>📖 My Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="appointment-list">
            {appointments.map((app) => (
              <div className="appointment-card" key={app.id}>
                <p><strong>Date:</strong> 📅 {app.date}</p>
                <p><strong>Time:</strong> ⏰ {app.time}</p>
                <p><strong>Doctor:</strong> 🧑‍⚕️ {app.doctor_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyAppointments;
