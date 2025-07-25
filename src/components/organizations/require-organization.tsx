"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/nexcom/auth/stores/auth-store"
import { useOrganizationStore } from "@/store/organization.store"

interface RequireOrganizationProps {
  children: React.ReactNode
}

export const RequireOrganization = ({ children }: RequireOrganizationProps) => {
  const router = useRouter()
  const pathname = usePathname()
  
  const { isAuthenticated, hasCheckedAuth } = useAuthStore()
  const {
    currentOrganization,
    isLoading,
    error,
    hasCheckedOrganization,
    checkAndSetOrganization,
    setCurrentOrganization,
    setError
  } = useOrganizationStore()

  // Extraire l'orgId du pathname
  const getOrgIdFromPath = (path: string): string | null => {
    const match = path.match(/^\/app\/([^\/]+)/)
    return match ? match[1] : null
  }

  useEffect(() => {
    // Attendre que l'authentification soit vérifiée
    if (!hasCheckedAuth || !isAuthenticated) {
      return
    }

    const handleOrganizationLogic = async () => {
      const orgIdFromPath = getOrgIdFromPath(pathname)
      
      // Cas 1: On est sur /app/[orgId]/*
      if (orgIdFromPath) {
        // Si on a une organisation en store et que l'ID correspond
        if (currentOrganization && currentOrganization.id === orgIdFromPath) {
          return // Tout est bon
        }
        
        // Sinon, on doit vérifier que l'utilisateur a accès à cette organisation
        try {
          await checkAndSetOrganization()
          
          // Vérifier si l'organisation récupérée correspond à celle demandée
          if (currentOrganization && currentOrganization.id !== orgIdFromPath) {
          router.push(`/app/${currentOrganization.id}`)
            return
          }
          
          // Si pas d'organisation du tout, rediriger vers quicksetup
          if (!currentOrganization) {
            router.push("/quicksetup")
            return
          }
        } catch (error) {
          router.push("/quicksetup")
          return
        }
      } 
      // Cas 2: On est sur /app sans orgId
      else if (pathname === '/app' || pathname === '/app/') {
        // Vérifier s'il y a une organisation en store
        if (currentOrganization && hasCheckedOrganization) {
          // Rediriger vers /app/[orgId]
          router.push(`/app/${currentOrganization.id}`)
          return
        }
        
        // Pas d'organisation en store, essayer de récupérer la default
        if (!hasCheckedOrganization) {
          try {
            await checkAndSetOrganization()
            
            // Si on a récupéré une organisation, rediriger
            if (currentOrganization) {
              router.push(`/app/${currentOrganization.id}`)
              return
            }
          } catch (error) {
            // Pas d'organisation par défaut, rediriger vers quicksetup
            router.push("/quicksetup")
            return
          }
        }
        
        // Si on arrive ici sans organisation, rediriger vers quicksetup
        if (!currentOrganization) {
          router.push("/quicksetup")
          return
        }
        
        // Rediriger vers l'organisation
        router.push(`/app/${currentOrganization.id}`)
      }
      // Cas 3: Autres routes sous /app
      else if (pathname.startsWith('/app/')) {
        // Probablement une route invalide, rediriger vers /app
        router.push('/app')
      }
    }

    handleOrganizationLogic()
  }, [isAuthenticated, hasCheckedAuth, hasCheckedOrganization, currentOrganization, pathname])

  // Attendre l'authentification
  if (!hasCheckedAuth || !isAuthenticated) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Vérification de l'authentification...</p>
      </div>
    )
  }

  // Attendre la vérification de l'organisation
  if (isLoading || !hasCheckedOrganization) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Chargement de l'organisation...</p>
      </div>
    )
  }

  // Erreur lors du chargement de l'organisation
  if (error) {
    return (
      <div className="flex h-screen justify-center items-center flex-col gap-4">
        <p className="text-red-600">Erreur: {error}</p>
        <button 
          onClick={() => router.push("/quicksetup")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Configurer une organisation
        </button>
      </div>
    )
  }

  // Pas d'organisation trouvée
  if (!currentOrganization) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Redirection vers la configuration...</p>
      </div>
    )
  }

  return <>{children}</>
}