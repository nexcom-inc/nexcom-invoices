"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/nexcom/auth/stores/auth-store"
import { useOrganizationStore } from "@/store/organization.store"
import { useAppStore } from "@/store/app.store"

interface RequireOrganizationProps {
  children: React.ReactNode
}

export const RequireOrganization = ({ children }: RequireOrganizationProps) => {
  const router = useRouter()
  const pathname = usePathname()
  
  const { isAuthenticated, hasCheckedAuth } = useAuthStore()
  const { setLoadingPhase, setLoading } = useAppStore()
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
      setLoadingPhase('ORGANIZATION')
      const orgIdFromPath = getOrgIdFromPath(pathname)

      // Cas spécial: quicksetup
      if (pathname === "/quicksetup") {
        await checkAndSetOrganization()
        if (currentOrganization && currentOrganization.id) {
          router.push(`/app/${currentOrganization.id}`)
          return
        }
        setLoading(false)
        return
      }
      
      // Cas 1: On est sur /app/[orgId]/* (avec ou sans sous-chemin)
      if (orgIdFromPath) {
        // Si on a une organisation en store et que l'ID correspond
        if (currentOrganization && currentOrganization.id === orgIdFromPath) {
          setLoading(false) // Tout est bon, on peut afficher le contenu
          return
        }
        
        // Sinon, on doit vérifier que l'utilisateur a accès à cette organisation
        try {
          await checkAndSetOrganization()
          
          // Vérifier si l'organisation récupérée correspond à celle demandée
          if (currentOrganization && currentOrganization.id !== orgIdFromPath) {
            // L'orgId dans l'URL ne correspond pas à l'organisation de l'utilisateur
            // Rediriger vers la bonne organisation en gardant le sous-chemin
            const subPath = pathname.replace(/^\/app\/[^\/]+/, '') // Extraire le sous-chemin
            const newPath = `/app/${currentOrganization.id}${subPath}`
            router.push(newPath)
            return
          }
          
          // Si l'organisation correspond, on peut continuer
          if (currentOrganization && currentOrganization.id === orgIdFromPath) {
            setLoading(false)
            return
          }
          
          // Si pas d'organisation du tout, rediriger vers quicksetup
          if (!currentOrganization) {
            router.push("/quicksetup")
            return
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'organisation:', error)
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
            console.error('Erreur lors de la récupération de l\'organisation par défaut:', error)
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
      // Cas 3: Autres routes sous /app (routes invalides)
      else if (pathname.startsWith('/app/')) {
        // Probablement une route invalide, rediriger vers /app
        router.push('/app')
      }
      
      // Dans tous les autres cas, arrêter le loading
      setLoading(false)
    }

    handleOrganizationLogic()
  }, [isAuthenticated, hasCheckedAuth, hasCheckedOrganization, currentOrganization, pathname])

  return <>{children}</>
}