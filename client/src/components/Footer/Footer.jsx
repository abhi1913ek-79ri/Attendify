import React from 'react'
import './Footer.css'
import DateTimeComponent from '../DateTimeComponent/DateTimeComponent'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-text">
         © 2025 Attendify. All rights reserved.
      </div>
      <div className="date-time">
        <DateTimeComponent />
      </div>
    </footer>
  )
}

export default Footer
