import {useState, useContext} from 'react'
import DashboardSuperUsuario from '../components/dashboard/DashboardSuperUsuario.jsx'
import DashboardEmpresas from '../components/dashboard/DashboardEmpresas.jsx'
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <>
    {user && user.isSuperuser ?
      <DashboardSuperUsuario />
    :
      <DashboardEmpresas />
    }
    </>
  )
}
