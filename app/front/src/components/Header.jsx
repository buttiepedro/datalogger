import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import BugerBtn from "./BugerBtn"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const navigate = useNavigate()
  const [mouseEnter, setMouseEnter] = useState(false);
  const { logout, user, loading } = useAuth()
  const location = useLocation()
  const tabActivo = "block p-2 border-b-2 border-white text-white rounded-t-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
  const tanInactivo = "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
  if (loading) return null;
  
  const cerrarSesion = () => {
    logout()
    navigate("/login")
  }

  const hover = () => {
    setMouseEnter(!mouseEnter);
  }

  return (
  <nav class="relative bg-blue-900 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <BugerBtn track_menu="mobile-menu"/>
      </div>
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex shrink-0 items-center">
          <NavLink to="/dashboard">
            <img src="https://bitautomatizacion.com.ar/assets/fondo-fE01IHFW.png" alt="Your Company" class="h-8 w-auto" />
          </NavLink>
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <span className={location.pathname === "/dashboard" ? tabActivo : tanInactivo}>
              <NavLink to="/dashboard" aria-current="page">Dashboard</NavLink>
            </span>
            {user.isSuperuser ?
            <span className={location.pathname === "/tipos-de-sensores" ? tabActivo : tanInactivo}>
              <NavLink to="/tipos-de-sensores" aria-current="page">Tipos de Sensores</NavLink>
            </span>
            : <></>}
            <span className={location.pathname === "/mediciones" ? tabActivo : tanInactivo}>
              <NavLink to="/mediciones">Mediciones</NavLink>
            </span>
            <span className={location.pathname === "/dataloggers" ? tabActivo : tanInactivo}>
              <NavLink to="/dataloggers">Dataloggers</NavLink>
            </span>
            {user.isSuperuser ?
              <span className={location.pathname === "/unidades" ? tabActivo : tanInactivo}>
                <NavLink to="/unidades" >Unidades</NavLink>
              </span>
            : <></>}
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <el-dropdown className="relative ml-3">
          <button onMouseEnter={hover} onMouseLeave={hover}>
            <span className="absolute -inset-1.5"></span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-6 w-6 text-gray-300 hover:text-white transition ${mouseEnter ? 'fill-gray-300' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>

          <el-menu anchor="bottom end" popover className="w-48 origin-top-right mt-4 rounded-b-md bg-blue-900 py-1  transition transition-discrete [--anchor-gap:--spacing(1.5)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
            <p onClick={cerrarSesion} class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">Cerrar sesion</p>
          </el-menu>
        </el-dropdown>
      </div>
    </div>
  </div>

  <el-disclosure id="mobile-menu" hidden class="absolute block sm:hidden w-48 origin-top-right rounded-br-md outline-none bg-blue-900 py-1 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
    <el-menu  class="space-y- pt-2 pb-3">
      <span class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
        <NavLink to="/tipos-de-sensores" aria-current="page" >Tipos de sensor</NavLink>
      </span>
      <span class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
        <NavLink to="/unidades" >Unidades</NavLink>
      </span>
      <span class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
        <NavLink to="/mediciones" >Mediciones</NavLink>
      </span>
      <span class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
        <NavLink to="/dataloggers" >Dataloggers</NavLink>
      </span>
    </el-menu>
  </el-disclosure>
</nav>
  )
}
