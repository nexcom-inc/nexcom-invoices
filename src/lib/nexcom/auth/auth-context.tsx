"use client"

import type React from "react"

import Axiosinstance from "@/lib/axios"
import { LoaderCircle } from "lucide-react"
import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: number
  email: string
  emailVerified: boolean,
  createdAt: string
  updatedAt: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

type RegisterData = {
  email: string
  password: string
}

type LoginResponse = {
  message: string
}

type UserResponse = User

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await fetchUserData()
        setUser(userData)
      } catch (error) {
        console.log("Failed to fetch user data:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchUserData = async (): Promise<User> => {
    const data : UserResponse = (await Axiosinstance.get("/users/@me")).data
    if (!data) {
      throw new Error("Failed to fetch user data")
    }
    return data
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {

      const data : LoginResponse = (await Axiosinstance.post("/auth/login", {
        email,
        password
      })).data

      

      if (!data) {
        throw new Error("Login failed")
      }

      const userData = await fetchUserData()
      setUser(userData)
    } catch (error) {
      console.log("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {

      const data = (await Axiosinstance.post("/auth/register", {
        email: userData.email,
        password: userData.password
      })).data


      if (!data) {
        throw new Error("Registration failed")
      }
      return data
    } catch (error) {
      console.log("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
     await Axiosinstance.post("/auth/logout")
      setUser(null)

    } catch (error) {
      console.log("Logout error:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
      <LoaderCircle className="w-12 h-12 animate-spin text-accent" />
    </div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
