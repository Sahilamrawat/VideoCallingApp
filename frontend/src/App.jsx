import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import OnboardingPage from "./pages/OnboardingPage"
import NotificationsPage from "./pages/NotificationsPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import toast, { Toaster } from "react-hot-toast"

import PageLoader from "./components/PageLoader.jsx"

import useAuthUser from "./hooks/useAuthUser.jsx"
import { use } from "react"
import { useThemeStore } from "./store/useThemeStore.js"
import Layout from "./components/Layout.jsx"
export default function App() {
  


  const {theme}=useThemeStore();


  //tanstack Query
  const {isLoading, authUser} =useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnBoarded = authUser?.isOnboarded
  if(isLoading){
    return (
      <PageLoader/>
    )
  }
  return (
    
    <div className="h-[100vh]" data-theme={theme} >
      
      <Routes>


        <Route path="/" element={isAuthenticated && isOnBoarded ? ( 
          <Layout showSideBar={true}>
            <HomePage/>
          </Layout> ): 
          (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)}/>



        <Route path="/login" element={!isAuthenticated ? <LoginPage/>:<Navigate to={isOnBoarded?"/":"/onboarding"}/>}/>



        <Route path="/signup" element={!isAuthenticated ?<SignUpPage/>:<Navigate to={isOnBoarded?"/":"/onboarding"}/>}/>



        <Route path="/onboarding" element={isAuthenticated ?
        (
          !isOnBoarded ? (<OnboardingPage/>):(<Navigate to='/'/> )
          
        ) :( <Navigate to='/login '/>)}/>



        <Route path="/notifications" element={isAuthenticated && isOnBoarded ?(
          <Layout showSideBar={true}>
            <NotificationsPage/>
          </Layout>

          ):(<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)
        }/>




        <Route path="/call/:id" element={isAuthenticated && isOnBoarded ? (
          <Layout showSideBar={true}>
            <CallPage/>
          </Layout>
          ):(<Navigate to={!isAuthenticated ? '/login ':"/onboarding"}/>)}/>




        <Route path="/chat/:id" element={isAuthenticated && isOnBoarded ? (
          <Layout showSideBar={true} >
            <ChatPage/>
          </Layout>
          ):(<Navigate to={!isAuthenticated ? '/login ':"/onboarding"}/>)}/>

      </Routes>
      <Toaster/>
    </div>
  )
}