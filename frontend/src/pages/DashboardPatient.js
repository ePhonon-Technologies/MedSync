import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../components/Layout.css';
import '../styles/main.css';

function DashboardPatient() {
  const username = localStorage.getItem('username');

  return (
    <Layout role="patient">
      <div className="dashboard-content">
        <h2>Welcome to XYZ Healthcare, {username}</h2>
        <p>Use the options below to manage your appointments:</p>

        <div className="action-buttons">
          <Link to="/book-appointment">
            <button className="btn-primary">📅 Book New Appointment</button>
          </Link>

          <Link to="/appointments/my">
            <button className="btn-secondary">📖 View My Appointments</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPatient;
