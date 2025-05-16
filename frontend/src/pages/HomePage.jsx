import React, { useEffect, useState } from 'react'
import Navheader from '../components/Navheader'
import SideLayout from '../components/SideLayout'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getOutgoingFriendRequest, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api'
import { Link } from 'react-router-dom'
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react'
import FriendCard, { getLanguageFlag } from '../components/FriendCard'
import NoFriendsFound from '../components/NoFriendsFound'
import MakeGroup from '../components/MakeGroup'
import { StreamChat } from 'stream-chat';
import { getStreamToken } from '../lib/api'; // You already have this
import useAuthUser from '../hooks/useAuthUser'; // Already imported
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  
  const [outgoingRequestsIds,setOutgoingRequestsIds]=useState(new Set());
  const [showGroupModal, setShowGroupModal] = useState(false);

  const queryClient=useQueryClient();
  const {data:friends=[], isLoading:loadingFriends} =useQuery(
    {
      queryKey:["friends"],
      queryFn:getUserFriends,
    }
  );
  const {data:recommendedUsers=[], isLoading:loadingUsers} =useQuery(
    {
      queryKey:["users"],
      queryFn:getRecommendedUsers,
    }
  ); 

  const {data:outgoingFriendReqs} =useQuery(
    {
      queryKey:["outgoingFriendReqs"],
      queryFn:getOutgoingFriendRequest,
    }
  ); 

  const {mutate:sendReqMutation, isPending} = useMutation({
    mutationFn:sendFriendRequest,
    onSuccess:()=> {queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"]})
    queryClient.invalidateQueries({queryKey:["friends"]})
    const bc = new BroadcastChannel('friend-requests');
    bc.postMessage('new-request');
    console.log("📤 Sent 'new-request' via BroadcastChannel");

    bc.close();
    }


  });

  const [groups, setGroups] = useState([]);
  const [client, setClient] = useState(null);
  const { authUser } = useAuthUser();
  const navigate = useNavigate();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        console.log(req);
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  useEffect(()=>{
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
    
    };
    initStreamClient();
  },[outgoingFriendReqs,tokenData, authUser]);
  

  
  return (
    <div className='bg-base-100 p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                  Your Friends
              </h2>
              <Link to="/notifications" className=" btn btn-outline btn-sm">
                  <UsersIcon className='mr-2 size-4'/>
                  Friend Requests
              </Link>
          </div>

          {loadingFriends ? (
            <div className='flex justify-center py-122'>
                <span className='loading loading-spinner loading-lg'>
                </span>
            </div>
          ):
          friends.length===0 ?(
              <NoFriendsFound />
          ):(
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {friends.map((friend)=>(
                  <FriendCard  key={friend._id} friend={friend}/>
                ))}
            </div>
          )}

          <section>
                <div className='mb-6 sm:mb-8'>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div>
                        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                            Meet New Learners
                        </h2>
                        <p className='opacity-70'>
                            Discover Perfect language exchange partners based on your profiles
                        </p>
                    </div>
                  </div>
                </div>

                {loadingUsers ? (
                  <div className='flex justify-center py-122'>
                      <span className='loading loading-spinner loading-lg'>
                      </span>
                  </div>
                ):
                recommendedUsers.length===0 ?(
                    <div className='card bg-base-200 p-6 text-center '>
                        <h3 className='font-semibold text-lg mb-2 '>
                          No recommendations available
                        </h3>
                        <p className='text-base-content opacity-70'>
                          Check back later for new language partners!
                        </p>
                    </div>
                ):(
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                      {recommendedUsers.map((user)=>{
                        const hasRequestBeenSent=outgoingRequestsIds.has(user._id);
                        
                        return(
                          <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                            <div className='card-body p-5 space-y-4'>
                              <div className='flex-items-center gap-3'>
                                <div className='avatar size-16 rounded-full'>
                                  <img src={user.profilePic} alt={user.fullName} />
                                </div>
                                <div>
                                  <h3 className='font-semibold text-lg'>  
                                    {user.fullName}
                                  </h3>
                                  {user.location && (
                                    <div className='flex items-center text-xs opacity-70 mt-1'>
                                      <MapPinIcon className='size-3 mr-1'/>
                                      {user.location}
                                    </div>
                                  )}
                                </div>
                                
                              </div>


                              <div className='flex flex-wrap gap-1.5 mb-3'>
                                  <span className='badge badge-secondary text-xs'>
                                      {getLanguageFlag(user.nativeLanguage)}
                                      Native:{capitialize(user.nativeLanguage)}
                                  </span>
                                  <span className='badge badge-outline text-xs'>
                                      {getLanguageFlag(user.learningLanguage)}
                                      Learning:{user.learningLanguage}
                                  </span>
                              </div>





                              {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}


                              <button className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled":"btn-primary"}`}
                              onClick={()=>sendReqMutation(user._id)}
                              disabled={hasRequestBeenSent || isPending}>
                                {hasRequestBeenSent ? (
                                  <>
                                    <CheckCircleIcon className='size-4 mr-2'/>
                                    Request Sent
                                  </>
                                ):(
                                  <>
                                    <UserPlusIcon className='size-4 mr-2'/>
                                    Send Friend Request
                                  </>
                                )}
                              </button>


                            </div>
                          </div>
                        );
                  })}
                  </div>
            )}

              
          </section>
          <section>
            <div className='flex items-center justify-between mb-6 sm:mb-8'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                    Join Groups
                  </h2>
                  <p className='opacity-70'>
                    Discover Perfect language groups and learn
                  </p>
                </div>
              </div>
              <button
                className='btn btn-outline btn-primary'
                onClick={() => setShowGroupModal(true)}
              >
                Create Group
              </button>
            </div>
          </section>

          {showGroupModal && (
            <MakeGroup
              onClose={() => setShowGroupModal(false)}
            />
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2">Your Groups</h3>
            {groups.length === 0 ? (
              <p className="opacity-60">You're not in any groups yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {groups.map((group) => (
                  <div key={group.id} className="flex flex-col   bg-base-200 border-base-300 rounded-lg p-4 shadow-sm m-2">
                    <h4 className="mt-3 h-[6vh] rounded-full font-bold text-lg ">Group Name:<span className='text-accent text-xl p-3'>{group.data.name || "Unnamed Group"}</span></h4>
                    
                    <button
                      className="btn btn-sm btn-primary mt-2"
                      onClick={() => navigate(`/group-chat/${group.id}`)}
                    >
                      Open Chat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  )
}

export default HomePage



const capitialize=(str) =>str.charAt(0).toUpperCase()+ str.slice(1);