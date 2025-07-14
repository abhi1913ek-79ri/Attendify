import React from 'react'
import './Card.css'

const Card = ({icon,title,desc,style=''}) => {
  style=(style==''?'text-justify text-gray-':style);
  console.log(style);
  return (
    <div className='card'>
      <div className="card-header">
        <div className="icon">
          {icon}
        </div>
        <div className="title">
          {title}
        </div>
      </div>
      <div className={`card-content ${style}`}>
        <p>{desc}</p>
      </div>
    </div>
  )
}

export default Card
