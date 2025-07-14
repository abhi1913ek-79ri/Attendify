import React from 'react'
import './HorizontalCard.css'
import { ListChecks, MilestoneIcon } from 'lucide-react'

const HorizontalCard = ({ image, title, desc }) => {
    return (
        <div className='horizontal-card'>
            <div className="horizontal-card-image">
                <img src={image} alt="image" />
            </div>
            <div className="horizontal-card-content">
                <h3 className='horizontal-card-title flex flex-inline lg:gap-1.5 gap-0'><MilestoneIcon />{title}</h3>
                <p className='horizontal-card-desc'>{desc}</p>
            </div>
        </div>
    )
}

export default HorizontalCard

