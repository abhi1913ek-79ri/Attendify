import React from 'react'
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
import Dashboard from './pages/Dashboard/Dashboard'
import Students from './pages/Students/Students'
import Settings from './pages/Settings/Settings'
import Login from './pages/Login/Login'
import Logout from './pages/Logout/Logout'
import Register from './pages/Register/Register'
import MarkAttendance from './pages/Mark/MarkAttendance'
import StudentProfile from './pages/StudentProfileWithoutLogin/StudentProfileWithoutLogin'

const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <div className="sidebar-plus-content">
        <Sidebar />
        <div className="container-plus-footer">
          <Container >
            <Routes >
              <Route path='/' element={<Home />} />
              <Route path='/mark-attendance' element={<MarkAttendance />} />
              <Route path='/view' element={<View />} />
              <Route path='/export' element={<Export />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/students' element={<Students />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/login' element={<Login />} />
              <Route path='/logout' element={<Logout />} />
              <Route path='/register' element={<Register />} />
              <Route path="/students/:id" element={<StudentProfile />} />
            </Routes>
          </Container>
          <Footer />
        </div>

      </div>
    </div>
  )
}

export default App
