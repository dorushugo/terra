'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react'
import { CartDropdown } from './cart/CartDropdown'
import { FavoritesDropdown } from './favorites/FavoritesDropdown'
import { SearchDropdown } from './search/SearchDropdown'
import { useCart } from '@/providers/CartProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useAccount } from '@/providers/AccountProvider'

export const TerraHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const cartRef = useRef<HTMLDivElement>(null)
  const favoritesRef = useRef<HTMLDivElement>(null)
  const collectionsRef = useRef<HTMLDivElement>(null)
  const collectionsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { totalItems } = useCart()
  const { favoritesCount } = useFavorites()
  const { state: accountState } = useAccount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (collectionsTimeoutRef.current) {
        clearTimeout(collectionsTimeoutRef.current)
      }
    }
  }, [])

  // Fonctions pour gérer le dropdown collections avec délai
  const handleCollectionsMouseEnter = () => {
    if (collectionsTimeoutRef.current) {
      clearTimeout(collectionsTimeoutRef.current)
      collectionsTimeoutRef.current = null
    }
    setIsCollectionsOpen(true)
  }

  const handleCollectionsMouseLeave = () => {
    collectionsTimeoutRef.current = setTimeout(() => {
      setIsCollectionsOpen(false)
    }, 300) // Délai de 300ms avant fermeture
  }

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
      if (favoritesRef.current && !favoritesRef.current.contains(event.target as Node)) {
        setIsFavoritesOpen(false)
      }
      if (collectionsRef.current && !collectionsRef.current.contains(event.target as Node)) {
        setIsCollectionsOpen(false)
        if (collectionsTimeoutRef.current) {
          clearTimeout(collectionsTimeoutRef.current)
          collectionsTimeoutRef.current = null
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gérer les raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K pour ouvrir la recherche
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
        setIsCartOpen(false)
        setIsFavoritesOpen(false)
      }
      // Échapper pour fermer la recherche
      if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen])

  const navigation = [
    {
      name: 'Collections',
      href: '/products',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Toutes les collections', href: '/products' },
        { name: 'TERRA Origin', href: '/products?collection=origin', badge: 'À partir de 139€' },
        { name: 'TERRA Move', href: '/products?collection=move', badge: 'À partir de 159€' },
        { name: 'TERRA Limited', href: '/products?collection=limited', badge: 'Édition limitée' },
      ],
    },
    { name: 'Produits', href: '/products' },
    { name: 'Notre Impact', href: '/our-impact' },
    { name: 'À propos', href: '/about' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg border-b border-gray-200' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/Terra_logo.svg"
              alt="TERRA"
              className="h-14 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <div
                    ref={collectionsRef}
                    className="flex items-center space-x-1 cursor-pointer"
                    onMouseEnter={handleCollectionsMouseEnter}
                    onMouseLeave={handleCollectionsMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`font-terra-body font-medium transition-colors hover:text-terra-green ${
                        pathname.startsWith(item.href) ? 'text-terra-green' : 'text-urban-black'
                      }`}
                    >
                      {item.name}
                    </Link>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-terra-green transition-colors" />

                    {/* Dropdown avec zone de transition invisible */}
                    <AnimatePresence>
                      {isCollectionsOpen && (
                        <div 
                          className="absolute top-full left-0 pt-2 z-50"
                          onMouseEnter={handleCollectionsMouseEnter}
                          onMouseLeave={handleCollectionsMouseLeave}
                        >
                          {/* Zone invisible pour faciliter la transition */}
                          <div className="absolute top-0 left-0 right-0 h-2 bg-transparent" />
                          <motion.div 
                            className="w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ 
                              duration: 0.2, 
                              ease: [0.16, 1, 0.3, 1] as any 
                            }}
                          >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <div>
                              <div className="font-terra-body font-medium text-urban-black group-hover:text-terra-green">
                                {dropdownItem.name}
                              </div>
                              {dropdownItem.badge && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {dropdownItem.badge}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-terra-body font-medium transition-colors hover:text-terra-green ${
                      pathname === item.href ? 'text-terra-green' : 'text-urban-black'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Bouton de recherche */}
            <Button
              variant="outline"
              onClick={() => {
                setIsSearchOpen(true)
                setIsCartOpen(false)
                setIsFavoritesOpen(false)
              }}
              className="w-64 justify-start text-left font-terra-body text-sm text-gray-500 border-gray-300 hover:border-terra-green hover:text-terra-green bg-white"
            >
              <Search className="h-4 w-4 mr-3" />
              <span>Rechercher...</span>
              <div className="ml-auto flex items-center space-x-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>

            {/* Favoris */}
            <div className="relative" ref={favoritesRef}>
              <Button
                variant="ghost"
                size="icon"
                className={`relative transition-all duration-200 hover:scale-105 bg-transparent hover:bg-red-50 text-gray-600 hover:text-red-500 ${
                  isFavoritesOpen ? 'bg-red-50 text-red-500' : ''
                }`}
                onClick={() => {
                  setIsFavoritesOpen(!isFavoritesOpen)
                  setIsCartOpen(false)
                }}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    favoritesCount > 0 ? 'text-red-500 fill-current' : ''
                  }`}
                />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </Badge>
                )}
              </Button>

              <FavoritesDropdown
                isOpen={isFavoritesOpen}
                onClose={() => setIsFavoritesOpen(false)}
              />
            </div>

            {/* Panier */}
            <div className="relative" ref={cartRef}>
              <Button
                variant="ghost"
                size="icon"
                className={`relative transition-all duration-200 hover:scale-105 bg-transparent hover:bg-terra-green/10 text-gray-600 hover:text-terra-green ${
                  isCartOpen ? 'bg-terra-green/10 text-terra-green' : ''
                }`}
                onClick={() => {
                  setIsCartOpen(!isCartOpen)
                  setIsFavoritesOpen(false)
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-terra-green text-white text-xs">
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>

              <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>

            {/* Compte utilisateur */}
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className={`hover:scale-105 transition-transform bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800 ${
                  accountState.isAuthenticated ? 'bg-green-50 text-green-600' : ''
                }`}
                title={
                  accountState.isAuthenticated
                    ? `Connecté en tant que ${accountState.user?.firstName}`
                    : 'Mon compte'
                }
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl">
            <div className="px-4 py-6 space-y-6">
              {/* Search Mobile */}
              <Button
                variant="outline"
                onClick={() => {
                  setIsSearchOpen(true)
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-left font-terra-body text-gray-500 border-gray-300 py-3"
              >
                <Search className="h-5 w-5 mr-3" />
                <span>Rechercher des sneakers...</span>
              </Button>

              {/* Navigation Mobile */}
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={`block font-terra-body font-medium text-lg transition-colors ${
                        pathname.startsWith(item.href) ? 'text-terra-green' : 'text-urban-black'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.hasDropdown && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdownItems?.slice(1).map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block font-terra-body text-gray-600 hover:text-terra-green transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Actions Mobile */}
              <div className="flex items-center justify-around pt-6 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent hover:bg-red-50 text-gray-600 hover:text-red-500"
                  onClick={() => {
                    setIsFavoritesOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  <Heart
                    className={`h-5 w-5 ${favoritesCount > 0 ? 'text-red-500 fill-current' : ''}`}
                  />
                  <span className="font-terra-body">Favoris</span>
                  {favoritesCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">{favoritesCount}</Badge>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent hover:bg-terra-green/10 text-gray-600 hover:text-terra-green"
                  onClick={() => {
                    setIsCartOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-terra-body">Panier</span>
                  {totalItems > 0 && (
                    <Badge className="bg-terra-green text-white text-xs">{totalItems}</Badge>
                  )}
                </Button>

                <Link href="/account">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-2 bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800 ${
                      accountState.isAuthenticated ? 'bg-green-50 text-green-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-terra-body">
                      {accountState.isAuthenticated ? accountState.user?.firstName : 'Compte'}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Dropdown */}
      <SearchDropdown
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(query) => {
          console.log('Recherche:', query)
          // La navigation est gérée dans SearchDropdown
        }}
      />
    </header>
  )
}
