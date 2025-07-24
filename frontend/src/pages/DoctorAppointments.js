import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Cookies from 'js-cookie';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Doctor');

  useEffect(() => {
    // Fetch CSRF token
    axios.get('http://localhost:8000/api/accounts/csrf/', { withCredentials: true });

    // Fetch doctor's appointments
    axios
      .get('http://localhost:8000/api/accounts/doctor-appointments/', {
        withCredentials: true,
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        }
      })
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doctor appointments:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout role="doctor">
      <div className="dashboard-content">
        <h2>👨‍⚕️ Welcome, Dr. {username}</h2>
        <p>Here are your upcoming appointments:</p>

        {loading ? (
          <p>⏳ Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>📭 No appointments scheduled.</p>
        ) : (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, idx) => (
                <tr key={idx}>
                  <td>{appt.patient}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default DoctorAppointments;
