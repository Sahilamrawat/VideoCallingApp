import React, { Children } from 'react'
import SideLayout from './SideLayout'
import Navheader from './Navheader'

const Layout = ({children,showSideBar=false}) => {
  return (
    <div className='min-h-screen'>
        <div className='flex'>
            {showSideBar && <SideLayout />}
            <div className='flex-1 flex flex-col'>
                <Navheader/>
                <main className='flex-1 overflow-y-auto'>
                    {children}
                </main>
            </div>
        </div>
    </div>
  )
}

export default Layout