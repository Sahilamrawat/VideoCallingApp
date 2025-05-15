import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import {Channel,ChannelHeader,Chat,MessageInput,MessageList,Thread,Window,} from "stream-chat-react";
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader';
import { useThemeStore } from '../store/useThemeStore';
import CallButton from '../components/CallButton';
import { v4 as uuidv4 } from 'uuid';

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const {id:targetUserId} =useParams();
  const [chatClient , setChatClient]=useState(null);
  const [channel, setChannel]=useState(null);
  const [loading, setLoading]=useState(true);
  const {authUser}=useAuthUser();
  const { theme } = useThemeStore();

  const {data:tokenData} =useQuery({
    queryKey:['streamToken'],
    queryFn:getStreamToken,
    enabled: !!authUser //this will run only when authuser is available

  });

  useEffect(()=>{
    const initChat=async()=>{
      if(!tokenData?.token || !authUser) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        console.log(client);

        await client.connectUser({
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic,
        },tokenData.token)

        // 
        const channelId=[authUser._id,targetUserId].sort().join("-");
        console.log(channel);

        const currentChannel=client.channel("messaging",channelId,{
          members:[authUser._id,targetUserId],
        })
        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
          console.error("Error initializing chat:",error);
          toast.error("Could not connect to chat. Please try again")
      }finally{
        setLoading(false);
      }
    };
    initChat();
  },[tokenData,authUser,targetUserId]);
  
  const handleVideoCall = () => {
    if (channel) {
      const callId = uuidv4(); // Generate a unique call ID
      const callUrl = `${window.location.origin}/call/${callId}`;
  
      // Send this call link as a message in the chat
      channel.sendMessage({
        text: `📹 I've started a video call. Join me here: ${callUrl}`,
        customType: 'video-call', // optional: for message filtering
      });
  
      toast.success("Video call link sent successfully!");
    }
  };

  if(loading|| !chatClient||!channel) return <ChatLoader/>


  return (
  <div data-theme={theme} className="h-[90vh] ">
  <Chat client={chatClient} theme={theme === 'dark' ? 'str-chat__theme-dark' : 'str-chat__theme-light'}>
    <Channel channel={channel}>
      <div className="str-chat__container w-full relative">
        <CallButton handleVideoCall={handleVideoCall}/>
        <Window className="flex flex-col flex-1 overflow-hidden">
          <ChannelHeader className="str-chat__channel-header" />
          <MessageList className="str-chat__list" />
          <MessageInput className="str-chat__message-input text-primary-content" focus />
        </Window>
      </div>
    </Channel>
  </Chat>
</div>

);
}

export default ChatPage