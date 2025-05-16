import { MessageCircle } from 'lucide-react'
import React from 'react'
import {useLocation, useNavigate } from 'react-router-dom'

const FriendNav = ({friend}) => {
    const location=useLocation();
    const currentPath=location.pathname;
    const navigate=useNavigate();
    return (
        <div className={`btn btn-ghost flex justify-start w-full rounded-lg hover:shadow-md transition-shadow overflow-y-scroll ${currentPath=== `/chat/${friend._id}` ? "btn-active":""} `}>
            <div className='flex items-center p-2 cursor-pointer ' onClick={() => navigate(`/chat/${friend._id}`)}>
                <div className='flex items-center gap-3 '>
                    <div className='avatar size-7'>
                        <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                    <h3 className='font-semibold truncate'> {friend.fullName}</h3>
                </div>
                 
                
                 
            </div>
        </div>
      )
}

export default FriendNav