import React from 'react';
import "./styles/Avatar.css"

const Avatar = ({src, photoURL, alt, ...props}) => {
  const handleOnError = (e) => {
    e.target.src = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg";
  }
  return (
    <div>
        {src ? (
            <img 
            {...props}
            src={src}
            alt={alt}
            className="avatar"
            onError={handleOnError} />
        ) : (
            <img
            {...props} 
            src={"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"}
            alt={alt}
            className="avatar"/>
        )}
    </div>
  )
}
 

export default Avatar