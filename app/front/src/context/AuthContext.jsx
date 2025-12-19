import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  )
  
  const loginPermanente = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  const login = (newToken, rememberMe) => {
    if (rememberMe) {
      loginPermanente(newToken)
    } else {
      sessionStorage.setItem("token", newToken)
      setToken(newToken)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    setToken(null)

  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
