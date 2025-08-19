import React, { useState } from 'react'
import { assets } from './assets/assets'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Container from './components/Container/Container'
import Footer from './components/Footer/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import View from './pages/View/View'
import Export from './pages/Export/Export'
import Students from './pages/Students/Students'
import Settings from './pages/Settings/Settings'
import Login from './pages/Login/Login'
import Logout from './pages/Logout/Logout'
import Register from './pages/Register/Register'
import MarkAttendance from './pages/Mark/MarkAttendance'
import StudentProfile from './pages/StudentProfileWithoutLogin/StudentProfileWithoutLogin'
import AddStudent from './pages/AddStudent/AddStudent'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './pages/UserProfile/UserProfile'
import LoggedUserExport from './pages/LoggedUserExport/LoggedUserExport'
import { AuthProvider } from './store/AuthContext'
import { StudentProvider } from './store/StudentContext'
import { AttendanceProvider } from './store/AttendanceContext'
import { AllStudentsAttendanceProvider } from './store/AllStudentsAttendanceContext'

const App = () => {
  const [todaysActions, setTodaysActions] = useState([]);
  return (
    <AuthProvider>
        <StudentProvider>
          <AttendanceProvider>
            <AllStudentsAttendanceProvider>
    <div className='app'>
      <Navbar />
      <div className="sidebar-plus-content">
        <Sidebar />
        <div className="container-plus-footer">
          <Container >
            <Routes >
              <Route path='/' element={<Home />} />
              <Route path='/mark-attendance' element={<MarkAttendance todaysActions={todaysActions} setTodaysActions={setTodaysActions} />} />
              <Route path='/view' element={<View />} />
              <Route path='/export' element={<Export />} />
              <Route path='/user-profile' element={<UserProfile />} />
              <Route path='/add-student' element={<AddStudent />} />
              <Route path='/students' element={<Students />} />
              <Route path='/logged-user-export' element={<LoggedUserExport />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/login' element={<Login />} />
              <Route path='/logout' element={<Logout />} />
              <Route path='/register' element={<Register />} />
              <Route path='/student/:rollNo' element={<StudentProfile />} />
            </Routes>
          </Container>
          <Footer />
        </div>

      </div>
      <ToastContainer
        position="top-right"           
        autoClose={2000}               
        hideProgressBar={false}        
        newestOnTop={true}            
        closeOnClick={true}            
        rtl={false}                    
        pauseOnFocusLoss={true}
        draggable={true}               
        pauseOnHover={true}
        theme="light"           
      />
    </div>
    </AllStudentsAttendanceProvider>
    </AttendanceProvider>
    </StudentProvider>
    </AuthProvider>
  )
}

export default App
