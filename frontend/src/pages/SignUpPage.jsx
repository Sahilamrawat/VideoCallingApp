import {React,useState} from 'react'
import SignUpImage from "../assets/signup.svg"
import {Boxes} from 'lucide-react'
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signup } from '../lib/api.js';
const SignUpPage = () => {
  const [signupData,setSignupData]=useState({
    fullName:"",
    email:"",
    password:"",
  });

  const queryClient=useQueryClient();
  const {mutate:signupMutation,isPending,error}=useMutation({
    mutationFn:signup,
    onSuccess:()=>
      queryClient.invalidateQueries({queryKey:["authUser"]})
    
  })
  const handleSignUp=(e)=>{
    e.preventDefault();
    signupMutation(signupData);
    
  }


  return (
    <div className="h-screen flex items-center justify-center " data-theme="light">
      <div className="h-[80%] w-full max-w-[60%] mx-auto bg-base-100 rounded-xl  flex lg:flex  shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 h-[100%] rounded-l-xl flex flex-col px-6 py-5 border-primary/25 border-2"> 
          <div className="flex items-center mb-3">
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
          
            
            
        
          <form onSubmit={handleSignUp} className="flex flex-col justify-center items-center w-[100%] h-full" >
            <div className="w-[100%] h-max flex flex-col justify-center items-start mb-2 ml-2">
              <h1 className="font-semibold text-lg ">Create an Account</h1>
              <span>Join <span className="text-primary">VivoChat</span> and Chat & Call your friends right away</span>
            </div>
            <div className="w-[100%] h-max flex flex-col justify-start items-start mt-4">
              <label htmlFor="fullName" className="ml-2">You Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Name"
                className="input input-bordered w-[100%] mb-4 "
                value={signupData.fullName}
                onChange={(e)=>setSignupData({...signupData,fullName:e.target.value})}
                />

                <label htmlFor="email" className="ml-2">Email Id</label>
                <input
                id="email"
                type="email"
                placeholder="Email Id"
                className="input input-bordered w-[100%] mb-4 "
                value={signupData.email}
                onChange={(e)=>setSignupData({...signupData,email:e.target.value})}
                />


                <label htmlFor="password" className="ml-2">Password</label>
                <input
                id="password"
                type="password"
                placeholder="Password"
                className="input input-bordered w-[100%]  "
                value={signupData.password}
                onChange={(e)=>setSignupData({...signupData,password:e.target.value})}
                />
                <p className="font-thin textarea-xs mb-2">Password must contain 6 letters</p>
            </div>
            <div className="w-[100%] h-max  flex items-center justify-start">
              <label className="label cursor-pointer justify-start gap-2">
              <input 
              type="checkbox"
              name="terms"
              id="terms"
              className="checkbox checkbox-xs"
              />
              <span className="text-sm">By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
              </label>
            </div>
            <div className="w-[100%] h-max mt-5 flex flex-col justify-center items-center">
              <button className="btn btn-primary w-[100%] mb-2" type="submit">{
              isPending ?(
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Loading...
                </>
              ):("Create Account")}</button>
              <p>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
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

export default SignUpPage