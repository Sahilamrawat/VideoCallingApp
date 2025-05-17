import { MessageCircle } from 'lucide-react'
import React from 'react'
import {useLocation, useNavigate } from 'react-router-dom'

const FriendNav = ({friend, unreadChannels, authUserId}) => {
    const location=useLocation();
    const currentPath=location.pathname;
    const navigate=useNavigate();
    const channelId = [authUserId, friend._id].sort().join('-');
    const isUnread = unreadChannels?.has(channelId);
    return (
        <div className={`btn btn-ghost flex justify-start w-full rounded-lg hover:shadow-md transition-shadow overflow-y-scroll ${currentPath=== `/chat/${friend._id}` ? "btn-active":""} `}>
            <div className='flex items-center p-2 cursor-pointer ' onClick={() => navigate(`/chat/${friend._id}`)}>
                <div className='flex items-center gap-3 '>
                    <div className='avatar size-7'>
                        <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                    <h3 className='font-semibold truncate'> {friend.fullName}</h3>
                </div>
                {isUnread && (
                    <span className='ml-2 bg-error text-white rounded-full w-4 h-4 text-xs flex items-center justify-center'>
                    •
                    </span>
                )}
                 
                
                 
            </div>
        </div>
      )
}

export default FriendNav