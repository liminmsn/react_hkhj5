// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { RouterProvider } from 'react-router'
import router from './router'
import './global.css'
import GlobalWebViewEbent from './event/GlobalWebViewEbent'

GlobalWebViewEbent.start()
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  // </StrictMode>
  <ThemeProvider
    defaultTheme="fortune"
    enableSystem
    disableTransitionOnChange
  >
    <div className='h-svh'>
        <RouterProvider router={router} />
    </div>
  </ThemeProvider>
)
