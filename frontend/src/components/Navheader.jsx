import { BellIcon, Boxes, CameraIcon, LogOutIcon, PawPrint } from 'lucide-react'
import React from 'react'
import useAuthUser from '../hooks/useAuthUser';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';

const Navheader = () => {

  const {authUser} = useAuthUser();
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
    <div className='bg-base-200 max-h-[8%] h-full w-[100%] flex items-center justify-between px-4 border-b border-primary/25'>
        {/* left Side */}
        
        <div className='flex items-center justify-start lg-flex w-full max-w-[50%]'>
            <div className="flex items-center ">
                <Boxes className='sm:size-6 md:size-8 lg:size-10 mr-1 text-primary' />
                <h1 className="sm:text-lg md:text-xl lg:text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wider">VivoChat</h1>
            </div>
        </div>


        {/* right Side */}
        <div className='flex items-center text-center justify-end w-full max-w-[50%]  '>
            <div className='size-8 rounded-full flex items-center justify-center mx-4 '>
                <Link to="/notifications">
                    <button className='mt-2  '>
                        <BellIcon />
                    </button>
                </Link>

            </div>
            <ThemeSelector/>
            <div className='size-8 rounded-full flex items-center justify-center mx-4'>
                {authUser?.profilePic ?(
                    <img src={authUser?.profilePic} className=' w-full h-full ' alt="profile"/>
                ):(
                    <div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-8 text-base-content' />
                  </div>
                )}  
            </div>
            <button className=' size-7 mx-5 ' onClick={isLogout} >
                <LogOutIcon className='text-primary w-full h-full cursor-pointer'/>
            </button>

            
        </div>



        
    </div>
  )
}

export default Navheader