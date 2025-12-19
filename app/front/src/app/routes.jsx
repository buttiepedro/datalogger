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
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sensores" element={<Sensores />} />
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/mediciones" element={<Mediciones />} />
          <Route path="/tipos-de-sensores" element={<TipoSensores />}/>
        </Route>
      </Route>
    </Routes>
  )
}