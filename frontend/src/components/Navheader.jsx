import { BellIcon, Boxes, CameraIcon, LogOutIcon, PawPrint } from 'lucide-react'
import React from 'react'
import useAuthUser from '../hooks/useAuthUser';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';

const Navheader = () => {

  const {authUser} = useAuthUser();
  const location=useLocation();
  const isChatPage=location.pathname?.startsWith("/chat");
  const queryClient = useQueryClient();
    

  const {mutate:isLogout,isPending}=useMutation({
    mutationFn:logout,
    onSuccess:()=>{
      toast.success("Successfully Logged Out");
      queryClient.invalidateQueries({queryKey:["authUser"]});
   
    },

    onError:(error)=>{
      toast.error(error.response.data.message)
    }
    
  })

  
  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center  '>
        
        
        


        {/* right Side */}
        <div className='container mx-auto px-4 sm:px-6 lg:px-1'>
            <div className='flex items-center justify-end w-full'>
                <div>

                </div>
                
                <div className='flex items-center gap-3 sm:gap-4'>
                    <Link to="/notifications">
                        <button className='btn btn-ghost btn-circle '>
                            <BellIcon className='h-6 w-6 text-base-content opacity-70' />
                        </button>
                    </Link>

                </div>
                <ThemeSelector/>
                <div className='avatar'>
                    <div className='w-8 rounded-full mx-3'>
                        <img src={authUser?.profilePic} alt="User Avatar" />
                    </div>

                </div>
                <button className='btn btn-ghost btn-circle  ' onClick={isLogout} >
                    <LogOutIcon className='h-6 w-6 text-base-content opacity-70'/>
                </button>

            </div>
            
            

            
        </div>



        
    </nav>
  )
}

export default Navheader