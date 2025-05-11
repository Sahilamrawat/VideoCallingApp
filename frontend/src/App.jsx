import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import OnboardingPage from "./pages/OnboardingPage"
import NotificationsPage from "./pages/NotificationsPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import toast, { Toaster } from "react-hot-toast"
import { axiosInstance } from "./lib/axios.js"
import { useQuery } from "@tanstack/react-query"
import { use } from "react"
import PageLoader from "./components/PageLoader.jsx"
import { getAuthUser } from "./lib/api.js"
export default function App() {
  


  //tanstack Query
  const {data: authData,isLoading,error} = useQuery({queryKey:["authUser"],
    queryFn: getAuthUser,
    retry:false

  })
  
  

  const authUser=authData?.user;
  if(isLoading){
    return (
      <PageLoader/>
    )
  }
  return (
    
    <div className="h-screen " data-theme="night">
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>: <Navigate to='/login '/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/>:<Navigate to='/'/>}/>
        <Route path="/signup" element={!authUser ?<SignUpPage/>:<Navigate to='/'/>}/>
        <Route path="/onboarding" element={authUser ?<OnboardingPage/> : <Navigate to='/login '/>}/>
        <Route path="/notifications" element={authUser ?<NotificationsPage/>:<Navigate to='/login '/>}/>
        <Route path="/call" element={authUser ?<CallPage/>:<Navigate to='/login '/>}/>
        <Route path="/chat" element={authUser ?<ChatPage/>:<Navigate to='/login '/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}