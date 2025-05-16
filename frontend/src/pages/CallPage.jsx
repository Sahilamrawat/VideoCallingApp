import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import { useThemeStore } from '../store/useThemeStore';

import {
  CallingState,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();
  const { theme } = useThemeStore();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient)                                                              ;
        setCall(callInstance);
      } catch (error) {
        console.error("Error Joining Call", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };
    
    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div
      data-theme={theme}
      className="h-[90vh] w-full bg-base-100 flex items-center justify-center px-4"
    >
      {client && call ? (
        
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="text-center text-lg">
          Could not initialize the call. Please refresh or try again later.
        </div>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate('/');

  return (
    <StreamTheme>
      <div className="flex flex-col justify-between w-[80vw] h-[80vh] bg-base-200 rounded-xl shadow-xl p-4">
        <div className="flex-1 sm:w-[50%]   items-center justify-center overflow-hidden rounded-lg mb-4 mx-auto my-auto text-base-content">
          <SpeakerLayout />
        </div>
        <div>
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;
