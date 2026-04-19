import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DemoPage from './DemoPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home page – original app */}
        <Route path="/" element={<App />} />
        {/* Demo page – shows the GSAP demo you created */}
        {/* <Route path="/example" element={<DemoPage />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
