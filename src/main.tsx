import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AOS from "aos"

import App from './App.tsx'

import '@/assets/css/index.css'
import "aos/dist/aos.css"
import "@/assets/css/custom.css"
import "cropperjs/dist/cropper.css";

AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  once: true,
  mirror: false,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
