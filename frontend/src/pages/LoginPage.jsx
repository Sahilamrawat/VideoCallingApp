import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { login } from '../lib/api';
import { Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignUpImage from "../assets/signup.svg"

const LoginPage = () => {

  
  const [loginData,setLoginData]=useState({
    email:"",
    password:"",
  });

  const queryClient=useQueryClient();
  const {mutate:loginMutation,isPending,error}=useMutation({
    mutationFn:login,
    onSuccess:()=>
      queryClient.invalidateQueries({queryKey:["authUser"]})
    
  })

  const handleLogin=(e)=>{
    e.preventDefault();
    loginMutation(loginData);
  }
  return (
    <div className="h-screen flex items-center justify-center " data-theme="light">
      <div className="h-[80%] w-full max-w-[60%] mx-auto bg-base-100 rounded-xl  flex lg:flex  shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 h-[100%] rounded-l-xl flex flex-col px-6 py-5 border-primary/25 border-2"> 
          <div className="flex items-center mb-10">
            <Boxes className='size-10 mr-1 text-primary' />
            <h1 className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wider">VivoChat</h1>
          </div>
          {error &&(
            <div className="alert alert-error shadow-lg mb-4">
              <span>
                {error.response.data.message}
              </span>
            </div>
          )}
          
            
            
        
          <form onSubmit={handleLogin} className="flex flex-col justify-start items-center w-[100%] h-full" >
            <div className="w-[100%] h-max flex flex-col justify-center items-start mb-2 ml-2">
              <h1 className="font-semibold text-lg ">Welcome Back</h1>
              <span>Sign in to your account and continue your journey</span>
            </div>
            <div className="w-[100%] h-max flex flex-col justify-start items-start mt-10">
              

                <label htmlFor="email" className="ml-2">Email Id</label>
                <input
                id="email"
                type="email"
                placeholder="Email Id"
                className="input input-bordered w-[100%] mb-4 "
                value={loginData.email}
                onChange={(e)=>setLoginData({...loginData,email:e.target.value})}
                />


                <label htmlFor="password" className="ml-2">Password</label>
                <input
                id="password"
                type="password"
                placeholder="Password"
                className="input input-bordered w-[100%]  "
                value={loginData.password}
                onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
                />
                
            </div>
            
            <div className="w-[100%] h-max mt-20 flex flex-col justify-center items-center">
              <button className="btn btn-primary w-[100%] mb-6" type="submit">{
              isPending ?(
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Loading...
                </>
              ):("Sign In")}</button>
              <p>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign Up</Link></p>
            </div>

          </form>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex w-full lg:w-1/2  items-center justify-center bg-primary/25">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src={SignUpImage} className="w-full h-full" /> 
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with people WorldWide</h2>
              <p className="opacity-70">Talk, Chat and Video Call with Your friends and family</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage