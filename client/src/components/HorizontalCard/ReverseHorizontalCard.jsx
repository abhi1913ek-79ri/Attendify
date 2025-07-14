import React from 'react'
import './HorizontalCard.css'
import { MilestoneIcon } from 'lucide-react'

const ReverseHorizontalCard = ({image,title,desc}) => {
    return (
        <div className='horizontal-card-reverse'>
            <div className="horizontal-card-image-reverse">
                <img src={image} alt="image" />
            </div>
            <div className="horizontal-card-content">
                <h3 className='horizontal-card-title flex flex-inline gap-1.5'><MilestoneIcon />{title}</h3>
                <p className='horizontal-card-desc'>{desc}</p>  
            </div>
        </div>
    )
}

export default ReverseHorizontalCard

