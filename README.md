# 🚑 MedSync

A **Full Stack Web Application** for booking and managing healthcare appointments, built with:

- **React** (Frontend)
- **Django + Django REST Framework** (Backend)
- **SQLite** (Database)

---

## 🧰 Prerequisites

Make sure the following are installed on your system:

- [✅ Visual Studio Code](https://code.visualstudio.com/)
- [✅ Python 3.x](https://www.python.org/)
- [✅ Node.js & npm](https://nodejs.org/)

---

## ⚙️ Backend Setup – Django

1. Open your terminal and navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Apply database migrations:

    ```bash
    python manage.py migrate
    ```

3. Start the development server:

    ```bash
    python manage.py runserver
    ```

📍 The backend will run at: `http://localhost:8000`

---

## 💻 Frontend Setup – React

1. Open a **new terminal** and navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm start
    ```

📍 The frontend will be available at: `http://localhost:3000`

---

## 🧪 Default Test Credentials

You can use the following test accounts to log in:

| **Role**       | **Username**   | **Password**         |
|----------------|----------------|----------------------|
| 👨‍⚕️ Doctor        | `Jones`        | `test`               |
| 🧑‍🤝‍🧑 Patient      | `patient1`     | `test`               |
| 🧑‍💼 Receptionist  | `reception1`   | `securepass123`      |

> 💡 You can register new users from the registration page or pre-populate them in the database.

---

## 🗃️ Folder Structure

plaintext
HealthCare_Appt_System/
│
├── backend/              # Django Backend
│   ├── accounts/         # Handles users & appointments
│   ├── db.sqlite3        # SQLite DB
│   └── manage.py         # Django CLI script
│
└── frontend/             # React Frontend
    ├── public/           # Static files
    └── src/              # React components & logic

🧯 Troubleshooting Tips
🔐 CSRF or CORS Errors:
Ensure the backend is running and CSRF cookies are handled properly.

📦 Dependency Issues:
Try cleaning and reinstalling:

bash
Copy
Edit
npm install
✅ You're All Set!
Visit the app in your browser: http://localhost:3000
Login or register to start managing appointments!

📌 Project Info
🏥 MedSync – Smart Scheduling and Patient Management for Clinics
Stack: React, Django REST Framework, PostgreSQL, Redux


---

Let me know if you want to:

- Add badges (build, license, tech stack).
- Include screenshots or GIFs.
- Write deployment instructions.
- Add API documentation or link to demo.
