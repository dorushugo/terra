'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

export const CookieSettingsButton: React.FC = () => {
  const handleOpenSettings = () => {
    // Supprimer le consentement existant pour rouvrir le banner
    localStorage.removeItem('terra-cookie-consent')
    // Recharger la page pour afficher le banner
    window.location.reload()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOpenSettings}
      className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-body font-medium"
    >
      <Settings className="mr-2 h-4 w-4" />
      Gérer les cookies
    </Button>
  )
}
