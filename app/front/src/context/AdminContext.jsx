import { createContext, useContext, useState } from "react"

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  )
  

  return (
    <AdminContext.Provider value={{ token }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)