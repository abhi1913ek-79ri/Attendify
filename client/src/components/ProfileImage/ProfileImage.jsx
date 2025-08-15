import React from 'react';
import { LuUser } from 'react-icons/lu';

const ProfileImage = ({ 
  imageUrl, 
  name = "User", 
  size = "w-12 h-12", 
  className = "", 
  fallbackBgColor = "bg-gray-200",
  textSize = "text-lg"
}) => {
  // Generate initials from name
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className={`${size} rounded-full overflow-hidden flex items-center justify-center ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image if loading fails and show fallback
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      {/* Fallback content - shown when no image or image fails to load */}
      <div 
        className={`w-full h-full ${fallbackBgColor} flex items-center justify-center ${textSize} font-medium text-gray-600`}
        style={{ display: imageUrl ? 'none' : 'flex' }}
      >
        {name ? getInitials(name) : <LuUser />}
      </div>
    </div>
  );
};

export default ProfileImage;
