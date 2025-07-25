"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2 } from "lucide-react"
import { organizationAPI, useOrganizationStore } from "@/store/organization.store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCreateOrganization } from "@/hooks/useOrganizations"

interface CreateOrgRequest {
  name: string
  domain: string
  address: string
  language: string
  currency: string
}

interface CreateOrgResponse {
  statusCode: number
  message: string
  data?: {
    org: {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    }
    userRole: "Owner" | "Admin" | "User"
  }
  details?: {
    message: string[]
    error: string
    statusCode: number
  }
}

const DOMAINS = ["Transport", "Commerce", "Services", "Technologie", "Santé", "Éducation", "Finance", "Autre"]

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
]

const CURRENCIES = [
  { value: "XOF", label: "XOF (Franc CFA)" },
  { value: "EUR", label: "EUR (Euro)" },
  { value: "USD", label: "USD (Dollar)" },
]

export default function CreateOrganizationPage() {
  const router = useRouter()
  const { setCurrentOrganization, setLoading, setError } = useOrganizationStore()

  const [formData, setFormData] = useState<CreateOrgRequest>({
    name: "",
    domain: "",
    address: "",
    language: "fr",
    currency: "XOF",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  const handleInputChange = (field: keyof CreateOrgRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (error) setFormError(null)
    if (fieldErrors.length > 0) setFieldErrors([])
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    setFieldErrors([])

    try {
      const response = await organizationAPI.createOrganization(formData)

      if (response.statusCode === 201 && response.data) {
        // Transform the response to match the Organization interface
        const organization = {
          id: response.data.org.id,
          name: response.data.org.name,
          users: [], // Will be populated later if needed
          userRole: response.data.userRole,
        }

        // Update the store
        setCurrentOrganization(organization)
        setLoading(false)
        setError(null)

        // Redirect to dashboard or main page
        router.push("/")
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de l'organisation:", error)

      if (error.details?.message) {
        setFieldErrors(error.details.message)
      } else {
        setFormError(error.message || "Une erreur est survenue lors de la création de l'organisation")
      }

      setError(error.message || "Erreur lors de la création de l'organisation")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Créer votre organisation</CardTitle>
          <CardDescription>Configurez votre organisation pour commencer à utiliser la plateforme</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {fieldErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {fieldErrors.map((err, index) => (
                      <li key={index} className="text-sm">
                        {err}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'organisation *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Subito"
                required
              />
            </div>

            {/* Domain Field */}
            <div className="space-y-2">
              <Label htmlFor="domain">Domaine d'activité *</Label>
              <Select value={formData.domain} onValueChange={(value) => handleInputChange("domain", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un domaine" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Ex: Mariste, Dakar, Sénégal"
                required
              />
            </div>

            {/* Language and Currency Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formData.name || !formData.domain || !formData.address}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer l'organisation"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
