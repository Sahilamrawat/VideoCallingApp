import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window
} from 'stream-chat-react';
import ChatLoader from '../components/ChatLoader';
import { useThemeStore } from '../store/useThemeStore';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
  const { channelId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const existingChannel = client.channel("messaging", channelId);
        await existingChannel.watch();

        setChatClient(client);
        setChannel(existingChannel);
      } catch (error) {
        console.error("Group chat init failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, channelId]);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div data-theme={theme} className="h-[90vh]">
      <Chat client={chatClient} theme={theme === 'dark' ? 'str-chat__theme-dark' : 'str-chat__theme-light'}>
        <Channel channel={channel}>
          <div className="str-chat__container w-full relative">
            <Window className="flex flex-col flex-1 overflow-hidden">
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default GroupChatPage;
