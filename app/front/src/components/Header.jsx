import { NavLink } from "react-router-dom"
import BugerBtn from "./BugerBtn"
import { useAuth } from "../context/AuthContext"

const linkClass = ({ isActive }) =>
  isActive
    ? "block p-2 rounded bg-blue-600 text-white"
    : "block p-2 rounded hover:bg-blue-100"

export default function Header() {
  const { logout } = useAuth()
  const cerrarSesion = () => {
    logout()
    window.location.href = "/login"
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
          <a href="/">
            <img src="https://bitautomatizacion.com.ar/assets/fondo-fE01IHFW.png" alt="Your Company" class="h-8 w-auto" />
          </a>
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <a href="/tipos-de-sensores" aria-current="page" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Tipos de Sensores</a>
            <a href="/mediciones" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Mediciones</a>
            <a href="/sensores" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Sensores</a>
            <a href="/unidades" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Unidades</a>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <el-dropdown class="relative ml-3">
          <button class="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">Abrir menú de usuario</span>
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10" />
          </button>

          <el-menu anchor="bottom end" popover class="w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
            <a href="/tipos-de-sensores" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">Unidades</a>
            <a href="/mediciones" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">Tipos de Sensor</a>
            <p onClick={cerrarSesion} class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">Cerrar sesion</p>
          </el-menu>
        </el-dropdown>
      </div>
    </div>
  </div>

  <el-disclosure id="mobile-menu" hidden class="block sm:hidden">
    <div class="space-y-1 px-2 pt-2 pb-3">
      {/* <!-- Current: "bg-gray-950/50 text-white", Default: "text-gray-300 hover:bg-white/5 hover:text-white" --> */}
      <a href="/tipos-de-sensores" aria-current="page" class="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white">Tipos de sensor</a>
      <a href="/unidades" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Unidades</a>
      <a href="/mediciones" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Mediciones</a>
      <a href="/sensores" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Sensores</a>
    </div>
  </el-disclosure>
</nav>
  )
}
