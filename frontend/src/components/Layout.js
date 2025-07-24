import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout({ children, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // ✅ Clear username and role
    navigate('/login');
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h3>Menu</h3>
        <nav>
          {role === 'doctor' && (
            <>
              <Link to="/dashboard/doctor">🏠 Dashboard</Link>
              <Link to="/doctor-appointments">📋 View Appointments</Link>
            </>
          )}

          {role === 'patient' && (
            <>
              <Link to="/dashboard/patient">🏠 Dashboard</Link>
              <Link to="/book-appointment">📅 Book Appointment</Link>
              <Link to="/appointments/my">📖 View My Appointments</Link>
            </>
          )}

          {role === 'receptionist' && (
            <>
              <Link to="/dashboard/receptionist">📋 Receptionist Dashboard</Link>
              <Link to="/receptionist/patients">👤 View Patient Data</Link>
              <Link to="/receptionist/doctors">🩺 View Doctor Details</Link>
            </>
          )}
        </nav>
      </div>

      <div className="main">
        <header className="topbar">
          <div className="brand">Healthcare App</div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
