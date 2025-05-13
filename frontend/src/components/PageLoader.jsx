import { LoaderIcon } from 'lucide-react'
import React from 'react'
import { useThemeStore } from '../store/useThemeStore';

const PageLoader = () => {
  const {theme} = useThemeStore();

  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
        <LoaderIcon className='animate-spin text-primary size-10 ' />
    </div>
  )
}

export default PageLoader