import { BellIcon, Boxes, BriefcaseBusinessIcon, Group, GroupIcon, HomeIcon, MessageCircle, MessageCircleCode, MessageSquareTextIcon, PersonStandingIcon, Superscript, UserIcon } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'

import NoFriendsFound from './NoFriendsFound';
import FriendCard from './FriendCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFriendsRequests, getUserFriends } from '../lib/api';
import FriendNav from './FriendNav';
import { StreamChat } from 'stream-chat';
import { getStreamToken } from '../lib/api'; // You already have this
import useAuthUser from '../hooks/useAuthUser'; // Already imported
import { useNavigate } from 'react-router-dom';

const SideLayout = ({showSideBar, setShowSideBar}) => {
    const [unreadChannels, setUnreadChannels] = useState(new Set());

    
    const [showGroupModal, setShowGroupModal] = useState(false);
    
    const location=useLocation();
    const currentPath=location.pathname;
    const [activeIndex=0,setActiveIndex] = useState(null);
    const queryClient=useQueryClient();
    const [groups, setGroups] = useState([]);
    const [client, setClient] = useState(null);
    const { authUser } = useAuthUser();
    const navigate = useNavigate();
    const { data: tokenData } = useQuery({
        queryKey: ['streamToken'],
        queryFn: getStreamToken,
        enabled: !!authUser,
      });
    const {data:friendRequests, isLoading}=useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendsRequests
      })
    const incomingRequests=friendRequests?.IncomingRequests||[]
    const {data:friends=[], isLoading:loadingFriends} =useQuery(
        {
          queryKey:["friends"],
          queryFn:getUserFriends,
          
        }
      );
      useEffect(() => {
        const bc = new BroadcastChannel('friend-requests');
      
        bc.onmessage = (event) => {
          console.log("📥 Received broadcast message:", event.data);
          if (event.data === 'new-request') {
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
          }
        };
      
        return () => bc.close(); // Cleanup
      }, []);
      useEffect(() => {
        const initStreamClient = async () => {
            if (!tokenData?.token || !authUser) return;
        
            const chatClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
        
            await chatClient.connectUser(
            {
                id: authUser._id,
                name: authUser.fullName,
                image: authUser.profilePic,
            },
            tokenData.token
            );
        
            const userChannels = await chatClient.queryChannels(
            {
                type: 'messaging',
                members: { $in: [authUser._id] },
                name: { $exists: true }, // Only get channels with a name
            },
            { created_at: -1 }, // Optional: sort newest first
            {
                limit: 30, // Optional
            }
            );
            
            // Just show all named channels without filtering by member count
            setGroups(userChannels);
            setClient(chatClient);
            chatClient.on('message.new', (event) => {
                const channelId = event.channel_id;
                

                if (event.user.id === authUser._id) return;

                // 🛡️ Also ignore if the user is currently on that chat screen
                if (location.pathname === `/group-chat/${channelId}`) return;

                // Don't notify if already in that chat route
                if (location.pathname !== `/group-chat/${channelId}`) {
                    setUnreadChannels((prev) => new Set(prev).add(channelId));
                }
                if (location.pathname !== `/chat/${getOtherUserIdFromChannel(channelId, authUser._id)}`) {
                    setUnreadChannels((prev) => new Set(prev).add(channelId));
                }
                });
                return () => {
                chatClient.off('message.new');
                };
        
        };
        initStreamClient();
        
      }, [tokenData, authUser]);
      
      
      console.log("🔔 Render incomingRequests count:", incomingRequests.length);

  return (
    <>
    
    <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
          showSideBar ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setShowSideBar(false)} // ✅ CLOSE SIDEBAR when clicked outside
      />
    <aside className={`w-64 bg-base-200 border-r border-base-300 h-full top-0 z-50
        fixed lg:sticky
        transform transition-transform duration-300
        ${showSideBar ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
      `}>
        <div className=' p-5 '>
            <Link to="/" className="flex items-center gap-2.5">
                <Boxes className='size-9  text-primary' />
                <span className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wider">VivoChat</span>
            </Link>
        </div>
        <nav className='flex-1 p-4 space-y-1 border-'>
            <Link to="/" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath==="/" ? "btn-active":""
            }`}>
                <HomeIcon className='size-5 text-base-content opacity-70' />
                <span>Home</span>
            
            </Link>
            <Link to="/friends" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath==="/friends" ? "btn-active":""
            }`}>
                <UserIcon className='size-5 text-base-content opacity-70' />
                <span>Friends</span>
            
            </Link>
            <Link to="/notifications" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath==="/notifications" ? "btn-active":""
            }`}>
                <BellIcon className='size-5 text-base-content opacity-70' />
                <span>Notifications</span>
                {incomingRequests.length>0 &&(
                    <span className='bg-error size-6 rounded-full flex items-center justify-center text-white'>{incomingRequests.length}</span>
                )}
            
            </Link>


            <div className='border-t pt-5'>
                <div className='flex space-x-4'>

                    <MessageCircle className=' ml-1 text-primary w-8 h-8'/> 
                    <h2 className='text-2xl'>Your Friends </h2>
                </div>
                <div className='h-[25vh] overflow-y-scroll'>
                    {loadingFriends ? (
                        <div className='flex justify-center py-122'>
                            <span className='loading loading-spinner loading-lg'>
                            </span>
                        </div>
                    ):
                    friends.length===0 ?(
                        <NoFriendsFound />
                    ):(
                        <div className='mt-4'>
                            {friends.map((friend)=>(
                            <FriendNav  key={friend._id} friend={friend} unreadChannels={unreadChannels}
                            authUserId={authUser._id}/>
                            ))}
                        </div>
                    )}
                </div>
                
            </div>



            <div className='border-t pt-5'>
                <div className='flex space-x-4 mb-4'>

                    <MessageSquareTextIcon className=' ml-1 text-primary w-8 h-8'/> 
                    <h2 className='text-2xl'>Groups </h2>
                </div>
                <div className='h-[20vh] overflow-y-scroll'>
                    
                        
                        {groups.length === 0 ? (
                        <p className="opacity-60">You're not in any groups yet.</p>
                        ) : (
                        <div>
                            {groups.map((group) => (
                            <Link
                            to={`/group-chat/${group.id}`}
                            key={group.id}
                            className={`btn btn-ghost flex justify-start items-center w-full rounded-lg hover:shadow-md transition-shadow ${
                              currentPath === `/group-chat/${group.id}` ? "btn-active" : ""
                            }`}
                            onClick={() => {
                              // Clear unread notification when opened
                              setUnreadChannels((prev) => {
                                const updated = new Set(prev);
                                updated.delete(group.id);
                                return updated;
                              });
                            }}
                          >
                            <MessageCircleCode />
                            <span className='text-base-content text-lg ml-2'>{group.data.name || "Unnamed Group"}</span>
                            {unreadChannels.has(group.id) && (
                              <span className="ml-auto bg-error text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                •
                              </span>
                            )}
                          </Link>
                            ))}
                        </div>
                        )}
                    
                </div>
                
            </div>

        </nav>

        <div className='p-4 border-t border-base 300 mt-auto'>
            <div className='flex items-center gap-3'>
                <div className='avatar'>
                    <div className='w-10 rounded-full'>
                        <img src={authUser?.profilePic} alt="User Avatar" />
                    </div>

                </div>
                <div className='flex-1'>
                    <p className='font-semibold text-sm'>{authUser?.fullName}</p>
                    <p className='text-xs text-success flex items-center gap-1'>
                        <span className='size-2 rounded-full bg-success inline-block'/>Online
                    </p>
                </div>

            </div>
        </div>
    </aside>
    </>
    
  )
}



function getOtherUserIdFromChannel(channelId, selfId) {
  return channelId
    .split('-')
    .find(id => id !== selfId);
}

export default SideLayout