import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken, getUserFriends } from '../lib/api';
import FriendNav from './FriendNav';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const MakeGroup = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [groupName, setGroupName] = useState("");
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  

  const toggleSelect = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const createGroup = async () => {
    if (selectedUserIds.length < 2) {
      toast.error("Select at least 2 users.");
      return;
    }
    if(groupName===""){
        toast.error("Enter Group Name ");
        return;
    }

    try {
      const tokenData = await getStreamToken();

      const client = StreamChat.getInstance(STREAM_API_KEY);
      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );

      const channel = client.channel("messaging", {
        members: [authUser._id, ...selectedUserIds],
        name: groupName || `Group-${Date.now()}`,
      });

      await channel.create();

      toast.success("Group created successfully!");
      onClose();
      navigate(`/group-chat/${channel.id}`);
    } catch (error) {
      console.error("Group creation failed:", error);
      toast.error("Something went wrong while creating the group.");
    }
  };

  return (
    <div className="fixed inset-y-4 inset-x-0 z-50 flex items-center justify-center bg-transparent/50">
      <div className="bg-base-300 rounded-xl shadow-md p-6 h-max w-[30%] max-w-lg space-y-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold">Create Group</h2>

        <input
          type="text"
          placeholder="Enter group name"
          className="input input-bordered w-full rounded-full"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="max-h-60 overflow-y-auto w-[100%]  rounded p-1 ">
          {loadingFriends ? (
            <p className="text-center py-2">Loading friends...</p>
          ) : (
            friends.map(user => (
              <div
                key={user._id}
                className="flex justify-between items-center p-2 "
              >
                <div className='mt-4'>
                    
                    <FriendNav key={user._id} friend={user}/>
                
                </div>
                <input
                  type="checkbox"
                  className='size-6 mr-3'
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => toggleSelect(user._id)}
                />
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 w-full">
          <button className="btn w-[50%]" onClick={onClose}>Cancel</button>
          <button className="btn w-[50%] btn-primary" onClick={createGroup}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default MakeGroup;
