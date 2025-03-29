import icono from '@/assets/images/otorrino/favicon.png'
import { NavLink } from 'react-router-dom'
import { LuPhone } from "react-icons/lu";
import { useAuthStore } from '@/hooks';
import { Spinner } from '@/components/ui/spinner'
import { Button } from "@/components/ui/button"



export const Menu = () => {
  const { isAuthenticated } = useAuthStore()
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-2">
            {isAuthenticated === 'Checking' && <Spinner />}
            {isAuthenticated !== 'Checking' && (
              <NavLink className='flex gap-1 items-center w-fit' to={isAuthenticated === 'Authenticated' ? '/home' : '/login'}>
                <img src={icono} alt='logo' className='w-[2rem]' />
                <p className='text-xl lg:text-2xl text-black font-bold'>Medica<span className='text-otorrino'>otorrino</span> </p>
              </NavLink>
            )}
          </div>
          <nav className="hidden lg:flex gap-6">
            <a href="#services" className="text-sm font-medium transition-colors hover:text-primary">
              Servicios
            </a>
            <a href="#about" className="text-sm font-medium transition-colors hover:text-primary">
              Conócenos
            </a>
            <a href="#doctors" className="text-sm font-medium transition-colors hover:text-primary">
              Nuestros doctores
            </a>
            <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contacto
            </a>
          </nav>
          <a href="tel:3347052681" className='flex items-center gap-3 text-sm hover:text-otorrino duration-500'>
            <LuPhone className='text-xl text-otorrino' />
            <div className='flex flex-col text-center'>
              <p>+52 33 4705 2681</p>
              <p>Lun-Vie 10am 8pm</p>
            </div>
          </a>
          <Button variant="outline" size="icon" className="hidden">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
    </>


  )
}
