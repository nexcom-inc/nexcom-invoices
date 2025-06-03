"use client"

import type React from "react"

import { LoaderCircle } from "lucide-react"
import { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios';



const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      mode: 'no-cors'
    },
    withCredentials: true,
  });

AxiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401 || error.response.status === 403) {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
        }
        return Promise.reject(error);
    }
);


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
  logout: () => Promise<void>
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
    const data : UserResponse = (await AxiosInstance.get("/users/me")).data
    if (!data) {
      throw new Error("Failed to fetch user data")
    }
    return data
  }


  const logout = async () => {
    setIsLoading(true)
    try {
     await AxiosInstance.post("/auth/logout")
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
