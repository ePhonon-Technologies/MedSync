import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../components/Layout.css';
import '../styles/main.css';
import axios from 'axios';

function DashboardDoctor() {
  const username = localStorage.getItem('username');
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);  // Define setLoading state

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/accounts/doctor-appointments/', { withCredentials: true })
      .then(res => {
        setAppointments(res.data);
        setLoading(false);  // Set loading to false once data is fetched
      })
      .catch(err => {
        console.error(err);
        setLoading(false);  // Set loading to false even if there is an error
      });
  }, []);

  return (
    <Layout role="doctor">
      <div className="dashboard-content">
        <h2>Welcome, Dr. {username}</h2>
        <p>Appointments:</p>

        {message && <p>{message}</p>}

        {loading ? (
          <p>Loading appointments...</p> // Show loading message while data is being fetched
        ) : appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment, index) => (
              <li key={index}>
                <strong>{appointment.patient}</strong> at {appointment.time} on {appointment.date}
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments for today or upcoming appointments.</p>
        )}

        <div className="action-buttons">
          <Link to="/doctor-appointments">
            <button className="btn-primary">📋 View All Appointments</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardDoctor;
