import { Routes, Route } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "./ProtectedRoutes"

import Dashboard from "../pages/Dashboard"
import Sensores from "../pages/Sensores"
import Unidades from "../pages/Unidades"
import TipoSensores from "../pages/TipoSensores"
import Mediciones from "../pages/Mediciones"
import Error404 from "../pages/Error404"
import Login from "../pages/Login"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Error404 />} />
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        {/* Rutas para CUALQUIER usuario logeado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/sensores" element={<Sensores />} />
          <Route path="/mediciones" element={<Mediciones />} />
        </Route>

        {/* Rutas solo para ADMINS de empresa o Superusers */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Rutas exclusivas del SUPERUSER (Crear empresas) */}
        <Route element={<ProtectedRoute requiredRole="superuser" />}>
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/tipos-de-sensores" element={<TipoSensores />}/>
        </Route>
      </Route>
    </Routes>
  )
}