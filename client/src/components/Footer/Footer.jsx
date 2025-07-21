import React from 'react'
import './Footer.css'
import DateTimeComponent from '../DateTimeComponent/DateTimeComponent'
import AuthButtons from '../AuthButtons/AuthButtons'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-text">
         © 2025 Attendify. All rights reserved.
      </div>
      <div className="auth-buttons">
        <AuthButtons />
      </div>
      <div className="date-time">
        <DateTimeComponent />
      </div>
    </footer>
  )
}

export default Footer
