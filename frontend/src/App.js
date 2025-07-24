import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Register from './pages/Register';
import Login from './pages/Login';
import BookAppointment from './pages/BookAppointment';
import DashboardPatient from './pages/DashboardPatient';
import DashboardDoctor from './pages/DashboardDoctor';
import DoctorAppointments from './pages/DoctorAppointments';
import MyAppointments from './pages/MyAppointments';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ViewPatients from './pages/ViewPatients';
import ViewDoctors from './pages/ViewDoctors';


import './components/Layout.css';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  useEffect(() => {
    axios.get('/api/accounts/csrf/', { withCredentials: true })
      .then(() => console.log("✅ CSRF token set"))
      .catch(err => console.error("❌ CSRF token fetch failed", err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/dashboard/patient" element={<DashboardPatient />} />
        <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/appointments/my" element={<MyAppointments />} />
        <Route path="/dashboard/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/patients" element={<ViewPatients />} />
<Route path="/receptionist/doctors" element={<ViewDoctors />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
