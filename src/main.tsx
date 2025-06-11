import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Activities from './Activities.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
      <Routes>
        <Route element={<App />} path="/" />
        <Route element={<Activities />} path="/activities" />
      </Routes>
     </BrowserRouter>
  </StrictMode>,
)
